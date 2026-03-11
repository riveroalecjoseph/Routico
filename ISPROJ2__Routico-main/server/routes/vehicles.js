const express = require('express');
const router = express.Router();
const { requirePerm } = require('../middleware/auth');

// Helper: get owner_id from authenticated user
async function getOwnerId(db, userId) {
  const [rows] = await db.query('SELECT owner_id FROM businessowners WHERE user_id = ?', [userId]);
  return rows.length > 0 ? rows[0].owner_id : null;
}

// ==================== VEHICLES ====================

// Get all vehicles for the business owner
router.get('/', requirePerm('view_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.json([]);

    const [vehicles] = await db.query(
      `SELECT t.*,
              d.first_name AS driver_first_name,
              d.last_name AS driver_last_name
       FROM trucks t
       LEFT JOIN drivers d ON t.assigned_driver_id = d.driver_id
       WHERE t.owner_id = ?
       ORDER BY t.truck_id DESC`,
      [ownerId]
    );
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get single vehicle
router.get('/:truckId', requirePerm('view_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.status(403).json({ error: 'No owner profile' });

    const [vehicles] = await db.query(
      `SELECT t.*, d.first_name AS driver_first_name, d.last_name AS driver_last_name
       FROM trucks t
       LEFT JOIN drivers d ON t.assigned_driver_id = d.driver_id
       WHERE t.truck_id = ? AND t.owner_id = ?`,
      [req.params.truckId, ownerId]
    );

    if (vehicles.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicles[0]);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Create vehicle
router.post('/', requirePerm('manage_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.status(403).json({ error: 'No owner profile' });

    const {
      plate_number, model, capacity, status, vehicle_type, fuel_type,
      year, mileage, insurance_expiry, registration_expiry,
      assigned_driver_id, notes
    } = req.body;

    if (!plate_number) return res.status(400).json({ error: 'Plate number is required' });

    // Check for duplicate plate number under this owner
    const [existing] = await db.query(
      'SELECT truck_id FROM trucks WHERE plate_number = ? AND owner_id = ?',
      [plate_number, ownerId]
    );
    if (existing.length > 0) return res.status(409).json({ error: 'A vehicle with this plate number already exists' });

    const [result] = await db.query(
      `INSERT INTO trucks (owner_id, plate_number, model, capacity, status, vehicle_type, fuel_type, year, mileage, insurance_expiry, registration_expiry, assigned_driver_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ownerId, plate_number, model || null, capacity || null,
        status || 'active', vehicle_type || 'truck', fuel_type || 'diesel',
        year || null, mileage || 0, insurance_expiry || null,
        registration_expiry || null, assigned_driver_id || null, notes || null
      ]
    );

    const [newVehicle] = await db.query(
      `SELECT t.*, d.first_name AS driver_first_name, d.last_name AS driver_last_name
       FROM trucks t LEFT JOIN drivers d ON t.assigned_driver_id = d.driver_id
       WHERE t.truck_id = ?`,
      [result.insertId]
    );
    res.status(201).json(newVehicle[0]);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle', details: error.message });
  }
});

// Update vehicle
router.put('/:truckId', requirePerm('manage_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.status(403).json({ error: 'No owner profile' });

    const truckId = req.params.truckId;
    const [existing] = await db.query('SELECT * FROM trucks WHERE truck_id = ? AND owner_id = ?', [truckId, ownerId]);
    if (existing.length === 0) return res.status(404).json({ error: 'Vehicle not found' });

    const {
      plate_number, model, capacity, status, vehicle_type, fuel_type,
      year, mileage, insurance_expiry, registration_expiry,
      last_maintenance_date, next_maintenance_date, assigned_driver_id, notes
    } = req.body;

    await db.query(
      `UPDATE trucks SET plate_number=?, model=?, capacity=?, status=?, vehicle_type=?, fuel_type=?,
       year=?, mileage=?, insurance_expiry=?, registration_expiry=?,
       last_maintenance_date=?, next_maintenance_date=?, assigned_driver_id=?, notes=?
       WHERE truck_id=? AND owner_id=?`,
      [
        plate_number, model || null, capacity || null, status || 'active',
        vehicle_type || 'truck', fuel_type || 'diesel', year || null,
        mileage || 0, insurance_expiry || null, registration_expiry || null,
        last_maintenance_date || null, next_maintenance_date || null,
        assigned_driver_id || null, notes || null, truckId, ownerId
      ]
    );

    const [updated] = await db.query(
      `SELECT t.*, d.first_name AS driver_first_name, d.last_name AS driver_last_name
       FROM trucks t LEFT JOIN drivers d ON t.assigned_driver_id = d.driver_id
       WHERE t.truck_id = ?`,
      [truckId]
    );
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Failed to update vehicle', details: error.message });
  }
});

// Delete vehicle
router.delete('/:truckId', requirePerm('manage_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.status(403).json({ error: 'No owner profile' });

    const truckId = req.params.truckId;
    const [existing] = await db.query('SELECT * FROM trucks WHERE truck_id = ? AND owner_id = ?', [truckId, ownerId]);
    if (existing.length === 0) return res.status(404).json({ error: 'Vehicle not found' });

    await db.query('DELETE FROM trucks WHERE truck_id = ? AND owner_id = ?', [truckId, ownerId]);
    res.json({ message: 'Vehicle deleted', truck_id: truckId });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'Failed to delete vehicle', details: error.message });
  }
});

// Assign driver to vehicle
router.put('/:truckId/assign-driver', requirePerm('manage_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.status(403).json({ error: 'No owner profile' });

    const truckId = req.params.truckId;
    const { driver_id } = req.body;

    const [existing] = await db.query('SELECT * FROM trucks WHERE truck_id = ? AND owner_id = ?', [truckId, ownerId]);
    if (existing.length === 0) return res.status(404).json({ error: 'Vehicle not found' });

    if (driver_id) {
      // Verify driver belongs to this owner
      const [driver] = await db.query('SELECT * FROM drivers WHERE driver_id = ? AND owner_id = ?', [driver_id, ownerId]);
      if (driver.length === 0) return res.status(404).json({ error: 'Driver not found' });

      // Unassign driver from any other vehicle first
      await db.query('UPDATE trucks SET assigned_driver_id = NULL WHERE assigned_driver_id = ? AND owner_id = ?', [driver_id, ownerId]);
    }

    await db.query('UPDATE trucks SET assigned_driver_id = ? WHERE truck_id = ? AND owner_id = ?', [driver_id || null, truckId, ownerId]);

    const [updated] = await db.query(
      `SELECT t.*, d.first_name AS driver_first_name, d.last_name AS driver_last_name
       FROM trucks t LEFT JOIN drivers d ON t.assigned_driver_id = d.driver_id
       WHERE t.truck_id = ?`,
      [truckId]
    );
    res.json(updated[0]);
  } catch (error) {
    console.error('Error assigning driver:', error);
    res.status(500).json({ error: 'Failed to assign driver' });
  }
});

// ==================== MAINTENANCE ====================

// Get maintenance records for a vehicle
router.get('/:truckId/maintenance', requirePerm('view_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.json([]);

    const [records] = await db.query(
      `SELECT vm.* FROM vehicle_maintenance vm
       JOIN trucks t ON vm.truck_id = t.truck_id
       WHERE vm.truck_id = ? AND t.owner_id = ?
       ORDER BY vm.maintenance_date DESC`,
      [req.params.truckId, ownerId]
    );
    res.json(records);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
});

// Get all maintenance records for this owner
router.get('/maintenance/all', requirePerm('view_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.json([]);

    const [records] = await db.query(
      `SELECT vm.*, t.plate_number, t.model
       FROM vehicle_maintenance vm
       JOIN trucks t ON vm.truck_id = t.truck_id
       WHERE vm.owner_id = ?
       ORDER BY vm.maintenance_date DESC`,
      [ownerId]
    );
    res.json(records);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
});

// Create maintenance record
router.post('/:truckId/maintenance', requirePerm('manage_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.status(403).json({ error: 'No owner profile' });

    const truckId = req.params.truckId;
    const [vehicle] = await db.query('SELECT * FROM trucks WHERE truck_id = ? AND owner_id = ?', [truckId, ownerId]);
    if (vehicle.length === 0) return res.status(404).json({ error: 'Vehicle not found' });

    const { maintenance_type, description, cost, maintenance_date, next_due_date, mileage_at_service, performed_by, status } = req.body;

    if (!maintenance_type || !maintenance_date) {
      return res.status(400).json({ error: 'Maintenance type and date are required' });
    }

    const [result] = await db.query(
      `INSERT INTO vehicle_maintenance (truck_id, owner_id, maintenance_type, description, cost, maintenance_date, next_due_date, mileage_at_service, performed_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [truckId, ownerId, maintenance_type, description || null, cost || 0, maintenance_date, next_due_date || null, mileage_at_service || null, performed_by || null, status || 'scheduled']
    );

    // Update truck's maintenance dates based on record status
    const effectiveStatus = status || 'scheduled';
    if (effectiveStatus === 'completed') {
      // Completed: update last_maintenance_date, set next from next_due_date
      await db.query(
        'UPDATE trucks SET last_maintenance_date = ?, next_maintenance_date = ? WHERE truck_id = ?',
        [maintenance_date, next_due_date || null, truckId]
      );
    } else if (effectiveStatus === 'scheduled' || effectiveStatus === 'in_progress') {
      // Scheduled/In Progress: this IS the upcoming maintenance
      await db.query(
        'UPDATE trucks SET next_maintenance_date = ? WHERE truck_id = ?',
        [maintenance_date, truckId]
      );
    }

    const [newRecord] = await db.query('SELECT * FROM vehicle_maintenance WHERE maintenance_id = ?', [result.insertId]);
    res.status(201).json(newRecord[0]);
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    res.status(500).json({ error: 'Failed to create maintenance record', details: error.message });
  }
});

// Update maintenance record
router.put('/maintenance/:maintenanceId', requirePerm('manage_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.status(403).json({ error: 'No owner profile' });

    const maintenanceId = req.params.maintenanceId;
    const [existing] = await db.query('SELECT * FROM vehicle_maintenance WHERE maintenance_id = ? AND owner_id = ?', [maintenanceId, ownerId]);
    if (existing.length === 0) return res.status(404).json({ error: 'Maintenance record not found' });

    const { maintenance_type, description, cost, maintenance_date, next_due_date, mileage_at_service, performed_by, status } = req.body;

    await db.query(
      `UPDATE vehicle_maintenance SET maintenance_type=?, description=?, cost=?, maintenance_date=?, next_due_date=?, mileage_at_service=?, performed_by=?, status=?
       WHERE maintenance_id=? AND owner_id=?`,
      [maintenance_type, description || null, cost || 0, maintenance_date, next_due_date || null, mileage_at_service || null, performed_by || null, status || 'scheduled', maintenanceId, ownerId]
    );

    const [updated] = await db.query('SELECT * FROM vehicle_maintenance WHERE maintenance_id = ?', [maintenanceId]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    res.status(500).json({ error: 'Failed to update maintenance record' });
  }
});

// Delete maintenance record
router.delete('/maintenance/:maintenanceId', requirePerm('manage_drivers'), async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ownerId = await getOwnerId(db, req.user.user_id);
    if (!ownerId) return res.status(403).json({ error: 'No owner profile' });

    const maintenanceId = req.params.maintenanceId;
    const [existing] = await db.query('SELECT * FROM vehicle_maintenance WHERE maintenance_id = ? AND owner_id = ?', [maintenanceId, ownerId]);
    if (existing.length === 0) return res.status(404).json({ error: 'Maintenance record not found' });

    await db.query('DELETE FROM vehicle_maintenance WHERE maintenance_id = ? AND owner_id = ?', [maintenanceId, ownerId]);
    res.json({ message: 'Maintenance record deleted' });
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    res.status(500).json({ error: 'Failed to delete maintenance record' });
  }
});

module.exports = router;
