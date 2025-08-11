// routes/drivers.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // your db.js file

// ✅ Get all drivers
router.get("/", (req, res) => {
  const sql = "SELECT * FROM drivers ORDER BY id"; // use id for ordering (it's INT)
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching drivers:", err);
      return res.status(500).json({ message: "Error fetching drivers" });
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { name, email, phone, experience, status } = req.body;

  if (!name || !email || !phone || experience === undefined || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Step 1: Get last driver_id
  const getLastIdSql = `
    SELECT driver_id 
    FROM drivers 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  db.query(getLastIdSql, (err, results) => {
    if (err) {
      console.error("Error fetching last driver_id:", err);
      return res.status(500).json({ message: "Database error" });
    }

    let newIdNumber = 1;
    if (results.length > 0) {
      const lastId = results[0].driver_id; // e.g. "driver007"
      const lastNum = parseInt(lastId.replace("driver", ""), 10);
      newIdNumber = lastNum + 1;
    }

    // Step 2: Format like driver001
    const newDriverId = `driver${String(newIdNumber).padStart(3, "0")}`;

    // Step 3: Insert new driver
    const insertSql = `
      INSERT INTO drivers (driver_id, name, email, phone, experience, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.query(insertSql, [newDriverId, name, email, phone, experience, status], (err, result) => {
      if (err) {
        console.error("Error adding driver:", err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "Duplicate entry (driver_id or email already exists)" });
        }
        return res.status(500).json({ message: "Error adding driver" });
      }
      res.status(201).json({ message: "Driver added successfully", driverId: newDriverId });
    });
  });
});




// ✅ Update driver status
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const sql = "UPDATE drivers SET status = ?, updated_at = NOW() WHERE driver_id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating driver status:", err);
      return res.status(500).json({ message: "Error updating driver status" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json({ message: "Driver status updated successfully" });
  });
});

router.delete("/:driver_id", (req, res) => {
  const { driver_id } = req.params;
  const sql = "DELETE FROM drivers WHERE driver_id = ?";
  
  db.query(sql, [driver_id], (err, result) => {
    if (err) {
      console.error("Error deleting driver:", err);
      return res.status(500).json({ message: "Error deleting driver" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json({ message: "Driver deleted successfully" });
  });
});




module.exports = router;
