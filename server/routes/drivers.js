const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// Get all drivers for the authenticated business owner
router.get('/', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;

    const [ownerResult] = await db.query(
      'SELECT owner_id FROM businessowners WHERE user_id = ?',
      [userId]
    );

    if (ownerResult.length === 0) {
      return res.json([]);
    }

    const ownerId = ownerResult[0].owner_id;

    const [drivers] = await db.query(
      `SELECT * FROM drivers WHERE owner_id = ? ORDER BY created_at DESC`,
      [ownerId]
    );

    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get single driver
router.get('/:driverId', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const driverId = req.params.driverId;

    const [ownerResult] = await db.query(
      'SELECT owner_id FROM businessowners WHERE user_id = ?',
      [userId]
    );

    if (ownerResult.length === 0) {
      return res.status(403).json({ error: 'No owner profile' });
    }

    const ownerId = ownerResult[0].owner_id;

    const [drivers] = await db.query(
      'SELECT * FROM drivers WHERE driver_id = ? AND owner_id = ?',
      [driverId, ownerId]
    );

    if (drivers.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(drivers[0]);
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});

// Create a new driver
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;

    const { firstName, lastName, email, phone, licenseNumber, licenseExpiry, status } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const [ownerResult] = await db.query(
      'SELECT owner_id FROM businessowners WHERE user_id = ?',
      [userId]
    );

    if (ownerResult.length === 0) {
      return res.status(403).json({ error: 'No owner profile' });
    }

    const ownerId = ownerResult[0].owner_id;

    const [result] = await db.query(
      `INSERT INTO drivers (owner_id, first_name, last_name, email, phone, license_number, license_expiry, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [ownerId, firstName, lastName, email || null, phone || null, licenseNumber || null, licenseExpiry || null, status || 'active']
    );

    const [newDriver] = await db.query(
      'SELECT * FROM drivers WHERE driver_id = ?',
      [result.insertId]
    );

    res.status(201).json(newDriver[0]);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ error: 'Failed to create driver', details: error.message });
  }
});

// Update driver details
router.put('/:driverId', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const driverId = req.params.driverId;

    const { firstName, lastName, email, phone, licenseNumber, licenseExpiry, status } = req.body;

    const [ownerResult] = await db.query(
      'SELECT owner_id FROM businessowners WHERE user_id = ?',
      [userId]
    );

    if (ownerResult.length === 0) {
      return res.status(403).json({ error: 'No owner profile' });
    }

    const ownerId = ownerResult[0].owner_id;

    // Verify driver belongs to this owner
    const [existing] = await db.query(
      'SELECT * FROM drivers WHERE driver_id = ? AND owner_id = ?',
      [driverId, ownerId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Driver not found or unauthorized' });
    }

    await db.query(
      `UPDATE drivers SET first_name=?, last_name=?, email=?, phone=?, license_number=?, license_expiry=?, status=?
       WHERE driver_id=? AND owner_id=?`,
      [firstName, lastName, email || null, phone || null, licenseNumber || null, licenseExpiry || null, status || 'active', driverId, ownerId]
    );

    const [updated] = await db.query('SELECT * FROM drivers WHERE driver_id = ?', [driverId]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ error: 'Failed to update driver', details: error.message });
  }
});

// Update driver status only
router.put('/:driverId/status', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const driverId = req.params.driverId;
    const { status } = req.body;

    const validStatuses = ['active', 'on_leave', 'sick_leave', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const [ownerResult] = await db.query(
      'SELECT owner_id FROM businessowners WHERE user_id = ?',
      [userId]
    );

    if (ownerResult.length === 0) {
      return res.status(403).json({ error: 'No owner profile' });
    }

    const ownerId = ownerResult[0].owner_id;

    const [existing] = await db.query(
      'SELECT * FROM drivers WHERE driver_id = ? AND owner_id = ?',
      [driverId, ownerId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Driver not found or unauthorized' });
    }

    await db.query(
      'UPDATE drivers SET status = ? WHERE driver_id = ? AND owner_id = ?',
      [status, driverId, ownerId]
    );

    const [updated] = await db.query('SELECT * FROM drivers WHERE driver_id = ?', [driverId]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({ error: 'Failed to update driver status' });
  }
});

// Delete a driver
router.delete('/:driverId', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const driverId = req.params.driverId;

    const [ownerResult] = await db.query(
      'SELECT owner_id FROM businessowners WHERE user_id = ?',
      [userId]
    );

    if (ownerResult.length === 0) {
      return res.status(403).json({ error: 'No owner profile' });
    }

    const ownerId = ownerResult[0].owner_id;

    const [existing] = await db.query(
      'SELECT * FROM drivers WHERE driver_id = ? AND owner_id = ?',
      [driverId, ownerId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Driver not found or unauthorized' });
    }

    await db.query('DELETE FROM drivers WHERE driver_id = ? AND owner_id = ?', [driverId, ownerId]);
    res.json({ message: 'Driver deleted', driver_id: driverId });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ error: 'Failed to delete driver', details: error.message });
  }
});

module.exports = router;
