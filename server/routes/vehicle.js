// backend/routes/vehicle.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");


//add vehicle to db
router.post("/add", (req, res) => {
  const { vehicleId, vehicleType, vehicleNumber, capacity, status } = req.body;

  const sql = `
    INSERT INTO vehicles (vehicleId, vehicleType, vehicleNumber, capacity, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [vehicleId, vehicleType, vehicleNumber, capacity, status], (err, result) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ message: "Database insert error" });
    }
    res.status(201).json({ message: "Vehicle added successfully" });
  });
});

// fetch vehicles from db and post in vehicle management system
router.get("/list", (req, res) => {
  const sql = "SELECT * FROM vehicles";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching vehicles:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(result);
  });
});

// Update vehicle status
router.put("/update-status", (req, res) => {
  const { vehicleId, status } = req.body;
  const sql = "UPDATE vehicles SET status = ? WHERE vehicleId = ?";

  db.query(sql, [status, vehicleId], (err, result) => {
    if (err) {
      console.error("Error updating vehicle status:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Vehicle status updated successfully" });
  });
});

//to get available vehicle for booking
router.get("/available", (req, res) => {
  const sql = "SELECT * FROM vehicles WHERE status = 'Available'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching available vehicles:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


module.exports = router;
