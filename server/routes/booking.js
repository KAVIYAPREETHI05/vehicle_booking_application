const moment = require('moment');

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // using mysql package

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


router.post('/book', (req, res) => {
const { vehicleId, place, time, reason, passID } = req.body;
  // Combine current date and provided time (HH:mm)
  const currentDate = moment().format("YYYY-MM-DD");
  const selectedTime = moment(`${currentDate} ${time}`, "YYYY-MM-DD HH:mm");

  // Check for missing fields
  if (!passID || !vehicleId || !place || !time || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if selected time is in the past
  if (!selectedTime.isValid() || selectedTime.isBefore(moment())) {
    return res.status(400).json({ error: "Selected time must be in the future" });
  }

  // Step 2: Check for existing booking at the same time for the same vehicle
  const checkSql = `
    SELECT * FROM bookings WHERE vehicleId = ? AND time = ?
  `;
  db.query(checkSql, [vehicleId, time], (err, results) => {
    if (err) {
      console.error("Slot check error:", err);
      return res.status(500).json({ error: "Error checking slot availability" });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "Time slot already booked for this vehicle" });
    }

    // Step 3: Proceed to book if slot is free
    const insertSql = `
      INSERT INTO bookings (passID, vehicleId, place, time, reason)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [passID, vehicleId, place, time, reason], (insertErr, result) => {
      if (insertErr) {
        console.error("Booking insert error:", insertErr);
        return res.status(500).json({ error: "Booking failed" });
      }

      res.status(201).json({ message: "Booking successful" });
    });
  });
});

//get bookings of passenger
router.get('/status/:passengerID', (req, res) => {
  const passID = req.params.passengerID;
  const sql = 'SELECT * FROM bookings WHERE passID = ?';
  db.query(sql, [passID], (err, result) => {
    if (err) {
      console.error("Fetch booking error:", err);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
    res.json(result);
  });
});


//to cancel booking
router.put('/cancel/:id', (req, res) => {
  const bookingId = req.params.id;
  const checkSql = 'SELECT status FROM bookings WHERE id = ?';

  db.query(checkSql, [bookingId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const currentStatus = results[0].status;

    if (currentStatus !== 'Requested') {
      return res.status(403).json({ error: 'Cannot cancel booking with current status' });
    }

    const updateSql = 'UPDATE bookings SET status = ? WHERE id = ?';
    db.query(updateSql, ['rejected', bookingId], (err2) => {
      if (err2) {
        return res.status(500).json({ error: 'Failed to cancel booking' });
      }
      res.json({ message: 'Booking cancelled successfully', newStatus: 'rejected' });
    });
  });
});


// data for passenger dashboard
router.get('/counts/:passengerID', (req, res) => {
  const { passengerID } = req.params;

  const sql = `
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected,
      SUM(CASE WHEN status = 'requested' THEN 1 ELSE 0 END) AS requested
    FROM bookings
    WHERE passID = ?
  `;

  db.query(sql, [passengerID], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No rides found for this passenger' });
    }

    res.json(results[0]); // returns total, completed, rejected, requested
  });
});

// GET only bookings with status = 'Requested'
// routes/bookings.js
// routes/bookings.js
router.get('/requested', (req, res) => {
  const sql = `
    SELECT 
      id, 
      passID, 
      place AS pickup,  -- aliasing 'place' as 'pickup'
      time, 
      reason 
    FROM bookings 
    WHERE status = 'Requested'
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


//ride request accept
// PUT /api/bookings/accept/:id
// Accept a booking by ID
// Accept a booking and assign driverID
router.put('/accept/:id', (req, res) => {
  const bookingId = req.params.id;
  const { driverID } = req.body;

  const sql = 'UPDATE bookings SET status = "Accepted", driverID = ? WHERE id = ?';

  db.query(sql, [driverID, bookingId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to accept booking' });
    }
    res.json({ message: 'Booking accepted', driverID });
  });
});



// fetches accepted rides
// routes/bookings.js
router.get('/accepted/:driverID', (req, res) => {
  const driverID = req.params.driverID;
  const sql = `
    SELECT id, passID, place AS pickup, time, reason 
    FROM bookings 
    WHERE status = 'Accepted' AND driverID = ?
  `;

  db.query(sql, [driverID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});



// Mark a booking as completed by driver
router.put('/complete/:id', (req, res) => {
  const bookingId = req.params.id;
  const sql = 'UPDATE bookings SET status = "Completed" WHERE id = ?';

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to mark ride as completed' });
    }
    res.json({ message: 'Ride marked as completed' });
  });
});


// Get all completed bookings for a specific driver
// GET /api/bookings/completed/:driverID
router.get('/completed/:driverID', (req, res) => {
  const driverID = req.params.driverID;
  const sql = `
    SELECT 
      id, 
      passID, 
      place AS pickup, 
      time, 
      reason 
    FROM bookings 
    WHERE status = 'Completed' AND driverID = ?
  `;

  db.query(sql, [driverID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});







module.exports = router;
