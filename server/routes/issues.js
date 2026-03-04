const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// Get all issues for business owner
router.get('/', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;

    const [ownerResult] = await db.query(
      'SELECT owner_id FROM businessowners WHERE user_id = ?',
      [userId]
    );
    if (ownerResult.length === 0) return res.json([]);
    const ownerId = ownerResult[0].owner_id;

    // Get user_id for reported_by filter
    const [issues] = await db.query(
      `SELECT i.*, ic.category_name,
              o.pickup_location, o.drop_off_location, o.order_status,
              c.company_name as customer_name
       FROM issues i
       LEFT JOIN issuescategories ic ON i.category_id = ic.category_id
       LEFT JOIN orders o ON i.order_id = o.order_id
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       WHERE i.reported_by = ?
       ORDER BY i.reported_at DESC`,
      [userId]
    );

    res.json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get issue categories
router.get('/categories', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [categories] = await db.query('SELECT * FROM issuescategories ORDER BY category_name');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create new issue
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const { orderId, categoryId, description } = req.body;

    if (!orderId || !categoryId || !description) {
      return res.status(400).json({ error: 'Order, category, and description are required' });
    }

    // Verify order belongs to this user's business
    const [ownerResult] = await db.query(
      'SELECT owner_id FROM businessowners WHERE user_id = ?',
      [userId]
    );
    if (ownerResult.length === 0) return res.status(403).json({ error: 'No owner profile' });
    const ownerId = ownerResult[0].owner_id;

    const [orderCheck] = await db.query(
      'SELECT order_id FROM orders WHERE order_id = ? AND business_owner_id = ?',
      [orderId, ownerId]
    );
    if (orderCheck.length === 0) return res.status(404).json({ error: 'Order not found' });

    const [result] = await db.query(
      `INSERT INTO issues (reported_by, order_id, category_id, description, status)
       VALUES (?, ?, ?, ?, 'open')`,
      [userId, orderId, categoryId, description]
    );

    // Fetch created issue with joins
    const [newIssue] = await db.query(
      `SELECT i.*, ic.category_name,
              o.pickup_location, o.drop_off_location,
              c.company_name as customer_name
       FROM issues i
       LEFT JOIN issuescategories ic ON i.category_id = ic.category_id
       LEFT JOIN orders o ON i.order_id = o.order_id
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       WHERE i.issue_id = ?`,
      [result.insertId]
    );

    res.status(201).json(newIssue[0]);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: 'Failed to create issue', details: error.message });
  }
});

// Update issue status
router.put('/:issueId/status', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const issueId = req.params.issueId;
    const { status } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be: ${validStatuses.join(', ')}` });
    }

    // Verify issue belongs to user
    const [existing] = await db.query(
      'SELECT * FROM issues WHERE issue_id = ? AND reported_by = ?',
      [issueId, userId]
    );
    if (existing.length === 0) return res.status(404).json({ error: 'Issue not found' });

    await db.query(
      'UPDATE issues SET status = ? WHERE issue_id = ?',
      [status, issueId]
    );

    const [updated] = await db.query(
      `SELECT i.*, ic.category_name,
              o.pickup_location, o.drop_off_location,
              c.company_name as customer_name
       FROM issues i
       LEFT JOIN issuescategories ic ON i.category_id = ic.category_id
       LEFT JOIN orders o ON i.order_id = o.order_id
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       WHERE i.issue_id = ?`,
      [issueId]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ error: 'Failed to update issue status' });
  }
});

module.exports = router;
