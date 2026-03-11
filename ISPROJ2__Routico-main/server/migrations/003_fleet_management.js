const runFleetMigration = async (db) => {
  console.log('Running fleet management migration...');

  // Extend trucks table with additional fields
  const columnsToAdd = [
    { name: 'vehicle_type', sql: "ALTER TABLE trucks ADD COLUMN vehicle_type VARCHAR(50) DEFAULT 'truck'" },
    { name: 'fuel_type', sql: "ALTER TABLE trucks ADD COLUMN fuel_type VARCHAR(30) DEFAULT 'diesel'" },
    { name: 'year', sql: "ALTER TABLE trucks ADD COLUMN year INT DEFAULT NULL" },
    { name: 'mileage', sql: "ALTER TABLE trucks ADD COLUMN mileage INT DEFAULT 0" },
    { name: 'insurance_expiry', sql: "ALTER TABLE trucks ADD COLUMN insurance_expiry DATE DEFAULT NULL" },
    { name: 'registration_expiry', sql: "ALTER TABLE trucks ADD COLUMN registration_expiry DATE DEFAULT NULL" },
    { name: 'last_maintenance_date', sql: "ALTER TABLE trucks ADD COLUMN last_maintenance_date DATE DEFAULT NULL" },
    { name: 'next_maintenance_date', sql: "ALTER TABLE trucks ADD COLUMN next_maintenance_date DATE DEFAULT NULL" },
    { name: 'assigned_driver_id', sql: "ALTER TABLE trucks ADD COLUMN assigned_driver_id INT DEFAULT NULL" },
    { name: 'notes', sql: "ALTER TABLE trucks ADD COLUMN notes TEXT DEFAULT NULL" },
  ];

  for (const col of columnsToAdd) {
    try {
      const [columns] = await db.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'trucks' AND COLUMN_NAME = ?`,
        [col.name]
      );
      if (columns.length === 0) {
        await db.query(col.sql);
        console.log(`  Added column: trucks.${col.name}`);
      }
    } catch (err) {
      console.error(`  Error adding column trucks.${col.name}:`, err.message);
    }
  }

  // Create vehicle_maintenance table
  await db.query(`
    CREATE TABLE IF NOT EXISTS vehicle_maintenance (
      maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
      truck_id INT NOT NULL,
      owner_id INT NOT NULL,
      maintenance_type VARCHAR(100) NOT NULL,
      description TEXT,
      cost DECIMAL(10,2) DEFAULT 0,
      maintenance_date DATE NOT NULL,
      next_due_date DATE DEFAULT NULL,
      mileage_at_service INT DEFAULT NULL,
      performed_by VARCHAR(255) DEFAULT NULL,
      status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (truck_id) REFERENCES trucks(truck_id) ON DELETE CASCADE,
      FOREIGN KEY (owner_id) REFERENCES businessowners(owner_id) ON DELETE CASCADE
    )
  `);
  console.log('  vehicle_maintenance table ready');

  console.log('Fleet management migration complete.');
};

module.exports = { runFleetMigration };
