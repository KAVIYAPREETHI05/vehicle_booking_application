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


router.post('/book', async (req, res) => {
  const { place, time, reason, passID } = req.body;

  console.log("Received booking:", { place, time, reason, passID });

  // Check for missing fields
  if (!passID || !place || !time || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Validate time format (should be HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ error: "Time must be in HH:mm format" });
    }

    // Combine with current date to check if it's in the future
    const currentDate = moment().format("YYYY-MM-DD");
    const selectedDateTime = moment(`${currentDate} ${time}`, "YYYY-MM-DD HH:mm");

    if (!selectedDateTime.isValid()) {
      return res.status(400).json({ error: "Invalid time" });
    }

    // Check if selected time is in the future
    if (selectedDateTime.isBefore(moment())) {
      return res.status(400).json({ error: "Selected time must be in the future" });
    }

    // Format time for database (HH:mm:00)
    const formattedTime = time + ':00'; // Convert "21:00" to "21:00:00"

    // Step 1: Find available vehicle
    const findVehicleSql = `
      SELECT vehicleId FROM vehicles 
      WHERE vehicleId NOT IN (
        SELECT vehicleId FROM bookings 
        WHERE time = ? AND status IN ('Requested', 'Accepted')
      ) 
      AND status = 'available' 
      LIMIT 1
    `;

    console.log("Searching for vehicle at time:", formattedTime);
    const vehicles = await query(findVehicleSql, [formattedTime]);
    
    if (vehicles.length === 0) {
      return res.status(409).json({ error: "No vehicles available at this time slot" });
    }

    const vehicleId = vehicles[0].vehicleId;
    console.log("Found available vehicle:", vehicleId);

    // Step 2: Insert booking with time only
    const insertSql = `
      INSERT INTO bookings (passID, vehicleId, place, time, reason, status)
      VALUES (?, ?, ?, ?, ?, 'Requested')
    `;

    console.log("Inserting booking with time:", formattedTime);
    const result = await query(insertSql, [
      passID, 
      vehicleId, 
      place, 
      formattedTime,  // Store as "HH:mm:00"
      reason
    ]);

    console.log("Booking successful, ID:", result.insertId);

    res.status(201).json({ 
      message: "Booking successful", 
      bookingId: result.insertId,
      vehicleId: vehicleId,
      bookedTime: time
    });

  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ 
      error: "Booking failed: " + err.message,
      note: "Make sure time column in database is TIME type, not DATETIME"
    });
  }
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

// Get accepted rides for a passenger
// router.get('/accepted-rides/:passengerID', (req, res) => {
//   const { passengerID } = req.params;
  
//   const sql = `
//     SELECT b.*, d.name as driverName, v.vehicleType 
//     FROM bookings b
//     LEFT JOIN drivers d ON b.driverID = d.driverID
//     LEFT JOIN vehicles v ON b.vehicleId = v.vehicleId
//     WHERE b.passID = ? AND b.status = 'accepted'
//     ORDER BY b.time ASC
//   `;
  
//   db.query(sql, [passengerID], (err, results) => {
//     if (err) {
//       console.error('Error fetching accepted rides:', err);
//       return res.status(500).json({ error: 'Failed to fetch accepted rides' });
//     }
//     res.json(results);
//   });
// });

router.get('/accepted-rides/:passengerId', async (req, res) => {
  const passengerId = req.params.passengerId;
  
  try {
    const sql = `
      SELECT 
        b.*, 
        d.name as driverName, 
        v.vehicleType,
        v.vehicleNumber
      FROM bookings b
      LEFT JOIN drivers d ON b.driverID = d.driver_id
      LEFT JOIN vehicles v ON b.vehicleId = v.vehicleId
      WHERE b.passID = ? AND b.status = 'accepted'
      ORDER BY b.bookingTime ASC
    `;
    
    const results = await query(sql, [passengerId]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching accepted rides:', err);
    res.status(500).json({ 
      error: 'Failed to fetch accepted rides',
      details: err.message 
    });
  }
});


// Accept booking and send notification to passenger
router.put('/accept/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const { driverID } = req.body;
  
  // First get booking details
  const getBookingSql = `
    SELECT b.*, v.vehicleType 
    FROM bookings b 
    JOIN vehicles v ON b.vehicleId = v.vehicleId 
    WHERE b.id = ?
  `;
  
  db.query(getBookingSql, [bookingId], (err, bookingResults) => {
    if (err) {
      console.error('Error fetching booking details:', err);
      return res.status(500).json({ error: 'Failed to accept booking' });
    }
    
    if (bookingResults.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const booking = bookingResults[0];
    
    // Update booking with driverID and status
    const updateSql = 'UPDATE bookings SET driverID = ?, status = "accepted" WHERE id = ?';
    
    db.query(updateSql, [driverID, bookingId], (err, result) => {
      if (err) {
        console.error('Error accepting booking:', err);
        return res.status(500).json({ error: 'Failed to accept booking' });
      }
      
      // Create notification for passenger with vehicle and driver info
      const notificationSql = `
        INSERT INTO notifications (type, message, driver_id, passID, booking_id, isRead, created_at)
        VALUES (?, ?, ?, ?, ?, FALSE, NOW())
      `;
      
      const notificationMessage = `Your ride has been accepted! Driver ID: ${driverID}, Vehicle ID: ${booking.vehicleId} (${booking.vehicleType}). Pickup at ${booking.place} - ${booking.time}`;
      
      db.query(notificationSql, [
        'system', 
        notificationMessage, 
        driverID, 
        booking.passID, 
        bookingId
      ], (err, result) => {
        if (err) {
          console.error('Error creating passenger notification:', err);
          // Don't fail the request if notification fails
        }
        
        res.json({ 
          message: 'Booking accepted successfully',
          vehicleId: booking.vehicleId,
          passID: booking.passID
        });
      });
    });
  });
});

// Get accepted rides for a passenger
router.get('/accepted-rides/:passID', (req, res) => {
  const { passID } = req.params;
  
  const sql = `
    SELECT b.*, v.vehicleType, d.name as driverName
    FROM bookings b
    LEFT JOIN vehicles v ON b.vehicleId = v.vehicleId
    LEFT JOIN drivers d ON b.driverID = d.driver_id
    WHERE b.passID = ? AND b.status = 'accepted'
    ORDER BY b.time ASC
  `;
  
  db.query(sql, [passID], (err, results) => {
    if (err) {
      console.error('Error fetching accepted rides:', err);
      return res.status(500).json({ error: 'Failed to fetch accepted rides' });
    }
    res.json(results);
  });
});

// Get accepted rides for a driver
router.get('/accepted-rides-driver/:driverID', (req, res) => {
  const { driverID } = req.params;
  
  const sql = `
    SELECT b.*, v.vehicleType 
    FROM bookings b
    JOIN vehicles v ON b.vehicleId = v.vehicleId
    WHERE b.driverID = ? AND b.status = 'accepted'
    ORDER BY b.time ASC
  `;
  
  db.query(sql, [driverID], (err, results) => {
    if (err) {
      console.error('Error fetching driver accepted rides:', err);
      return res.status(500).json({ error: 'Failed to fetch accepted rides' });
    }
    res.json(results);
  });
});
// Add this to your bookings routes
router.get('/today/:driverID', async (req, res) => {
  const driverID = req.params.driverID;
  
  try {
    console.log('Fetching today rides for driver:', driverID);
    
    // Use bookingTime column instead of created_at or date
    const sql = `
      SELECT * FROM bookings 
      WHERE driverID = ? 
      AND status = 'accepted'
      AND DATE(bookingTime) = CURDATE()
      ORDER BY time ASC
    `;
    
    const results = await query(sql, [driverID]);
    console.log('Today rides found:', results.length);
    res.json(results);
  } catch (err) {
    console.error('Database error fetching today\'s rides:', err);
    res.status(500).json({ error: 'Failed to fetch today\'s rides: ' + err.message });
  }
});


module.exports = router;