const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Get only ON DUTY drivers
router.get("/drivers", (req, res) => {
  const status = req.query.status;
  const query = status
    ? "SELECT * FROM drivers WHERE status = ?"
    : "SELECT * FROM drivers";
  const params = status ? [status] : [];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching drivers:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


// ✅ Get only AVAILABLE vehicles
router.get('/vehicles', (req, res) => {
  const sql = "SELECT vehicleId, vehicleNumber FROM vehicles WHERE status = 'Available'";

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching vehicles:', err);
      return res.status(500).json({ message: 'Error fetching vehicles' });
    }
    res.json(results);
  });
});


// ✅ Create new assignment
// Create new assignment
router.post('/', (req, res) => {
  console.log('Incoming data:', req.body);

  const { driver_id, vehicle_id, from_time, to_time } = req.body;

  if (!driver_id || !vehicle_id || !from_time || !to_time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const start_time = from_time;
  const end_time = to_time;

  const insertSql = `
    INSERT INTO assignments (driver_id, vehicle_id, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertSql, [driver_id, vehicle_id, start_time, end_time], (err) => {
    if (err) {
      console.error('Error inserting assignment:', err);
      return res.status(500).json({ message: 'Error creating assignment' });
    }

    // Update driver status
    db.query("UPDATE drivers SET status = 'not_available' WHERE driver_id = ?", [driver_id], (err) => {
      if (err) {
        console.error('Error updating driver status:', err);
        return res.status(500).json({ message: 'Error updating driver status' });
      }

      // Update vehicle status
      db.query("UPDATE vehicles SET status = 'Unavailable' WHERE vehicleId = ?", [vehicle_id], (err) => {
        if (err) {
          console.error('Error updating vehicle status:', err);
          return res.status(500).json({ message: 'Error updating vehicle status' });
        }

        res.json({ message: 'Driver assigned successfully' });
      });
    });
  });
});



// Get all assignments with driver + vehicle info
// inside assignments.js
router.get('/', (req, res) => {
  const sql = `
    SELECT a.*, d.name AS driver_name, v.vehicleNumber
    FROM assignments a
    JOIN drivers d ON a.driver_id = d.driver_id
    JOIN vehicles v ON a.vehicle_id = v.vehicleId
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      return res.status(500).json({ error: 'Failed to fetch assignments' });
    }
    res.json(results);
  });
});




module.exports = router;
