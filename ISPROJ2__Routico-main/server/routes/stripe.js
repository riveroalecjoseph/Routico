const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, requireBusinessOwnerOrInactive } = require('../middleware/auth');

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey && !stripeKey.includes('YOUR_STRIPE')
  ? require('stripe')(stripeKey)
  : null;

// Create Stripe Checkout Session for a billing statement
router.post('/create-checkout-session', requireBusinessOwnerOrInactive, async (req, res) => {
  try {
    const { statementId } = req.body;
    const db = req.app.locals.db;
    const userId = req.user.user_id;

    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured. Please add your Stripe API keys to .env' });
    }

    if (!statementId) {
      return res.status(400).json({ error: 'Statement ID is required' });
    }

    // Get the billing statement and verify ownership
    const [rows] = await db.query(
      `SELECT b.*, bo.owner_id
       FROM billing b
       JOIN businessowners bo ON b.owner_id = bo.owner_id
       WHERE b.billing_id = ? AND bo.user_id = ?`,
      [statementId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Statement not found' });
    }

    const statement = rows[0];

    if (statement.status === 'paid') {
      return res.status(400).json({ error: 'This statement has already been paid' });
    }

    const totalDue = parseFloat(statement.total_due);
    const amountInCentavos = Math.round(totalDue * 100);

    // Format the billing period for display
    const periodDate = new Date(statement.billing_period + '-01');
    const periodLabel = periodDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'php',
            product_data: {
              name: `Routico Billing - ${periodLabel}`,
              description: `Monthly subscription and commission fees for ${periodLabel}`,
            },
            unit_amount: amountInCentavos,
          },
          quantity: 1,
        },
      ],
      metadata: {
        statementId: statementId.toString(),
        ownerId: statement.owner_id.toString(),
        userId: userId.toString(),
      },
      success_url: `${req.headers.origin || 'http://localhost:5173'}/dashboard?tab=billing&payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:5173'}/dashboard?tab=billing&payment=cancelled`,
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
});

// Verify a completed checkout session and mark statement as paid
router.post('/verify-session', requireBusinessOwnerOrInactive, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const db = req.app.locals.db;
    const userId = req.user.user_id;

    if (!stripe || !sessionId) {
      return res.status(400).json({ error: 'Missing session ID or Stripe not configured' });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const { statementId } = session.metadata;

    if (!statementId) {
      return res.status(400).json({ error: 'Invalid session metadata' });
    }

    // Verify ownership
    const [rows] = await db.query(
      `SELECT b.billing_id, b.status FROM billing b
       JOIN businessowners bo ON b.owner_id = bo.owner_id
       WHERE b.billing_id = ? AND bo.user_id = ?`,
      [statementId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Statement not found' });
    }

    if (rows[0].status === 'paid') {
      return res.json({ success: true, message: 'Already paid' });
    }

    // Mark as paid
    await db.query(
      `UPDATE billing SET status = 'paid', payment_method = 'stripe', stripe_payment_intent_id = ? WHERE billing_id = ?`,
      [session.payment_intent, statementId]
    );

    // Reactivate user account if suspended
    await db.query(
      `UPDATE users SET active_status = 'active' WHERE user_id = ? AND active_status = 'inactive'`,
      [userId]
    );

    console.log(`Payment verified for statement ${statementId} via Stripe session ${sessionId}`);
    res.json({ success: true, message: 'Payment verified and statement updated' });
  } catch (error) {
    console.error('Stripe session verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Stripe webhook handler - auto-approve payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // In development without webhook secret, parse the body directly
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { statementId, ownerId, userId } = session.metadata;

    try {
      const db = req.app.locals.db;

      // Update billing statement to paid
      await db.query(
        `UPDATE billing SET status = 'paid', payment_method = 'stripe', stripe_payment_intent_id = ? WHERE billing_id = ?`,
        [session.payment_intent, statementId]
      );

      // Reactivate user account if it was suspended
      await db.query(
        `UPDATE users SET active_status = 'active' WHERE user_id = ? AND active_status = 'inactive'`,
        [userId]
      );

      console.log(`Payment successful for statement ${statementId} via Stripe`);
    } catch (dbError) {
      console.error('Error processing webhook:', dbError);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  res.json({ received: true });
});

module.exports = router;
