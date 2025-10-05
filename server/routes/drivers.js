const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Get all drivers
router.get("/", (req, res) => {
  const sql = "SELECT * FROM drivers ORDER BY driver_id";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching drivers:", err);
      return res.status(500).json({ message: "Error fetching drivers" });
    }
    res.json(results);
  });
});

// ✅ Add new driver
router.post("/", (req, res) => {
  const { name, email, phone, experience, status } = req.body;

  console.log("Received driver data:", { name, email, phone, experience, status });

  if (!name || !email || !phone || experience === undefined || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

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
      const lastId = results[0].driver_id;
      const lastNum = parseInt(lastId.replace("driver", ""), 10);
      newIdNumber = lastNum + 1;
    }

    const newDriverId = `driver${String(newIdNumber).padStart(3, "0")}`;
    console.log("Generated new driver ID:", newDriverId);

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
      
      console.log("Driver inserted successfully, rows affected:", result.affectedRows);
      
      res.status(201).json({ 
        message: "Driver added successfully", 
        driver_id: newDriverId
      });
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

// ✅ Delete driver
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

// ✅ Get driver by ID from users table
router.get("/:driverID", (req, res) => {
  const { driverID } = req.params;
  console.log("Looking for driver with ID:", driverID);

  const sql = "SELECT * FROM users WHERE generated_id = ? AND role = 'driver'";
  
  db.query(sql, [driverID], (err, results) => {
    if (err) {
      console.error("Error fetching driver:", err);
      return res.status(500).json({ message: "Error fetching driver" });
    }
    
    console.log("Query results:", results);
    
    if (results.length === 0) {
      console.log(`Driver ${driverID} not found in users table`);
      return res.status(404).json({ message: "Driver not found" });
    }
    
    res.json(results[0]);
  });
});

// ✅ Get driver's bookings with filter
router.get("/:driverID/bookings", (req, res) => {
  const { driverID } = req.params;
  const { status } = req.query;

  console.log("Fetching bookings for driver:", driverID, "with status:", status);

  // First verify the driver exists in users table
  const verifySql = "SELECT * FROM users WHERE generated_id = ? AND role = 'driver'";
  
  db.query(verifySql, [driverID], (err, userResults) => {
    if (err) {
      console.error("Error verifying driver:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (userResults.length === 0) {
      console.log(`Driver ${driverID} not found in users table`);
      return res.status(404).json({ message: "Driver not found" });
    }

    // Then fetch bookings
    let sql = `
      SELECT b.*, u.email as passenger_email, v.vehicleType, v.vehicleNumber
      FROM bookings b 
      JOIN users u ON b.passID = u.generated_id 
      LEFT JOIN vehicles v ON b.vehicleId = v.vehicleId
      WHERE b.driverID = ?
    `;

    const params = [driverID];

    if (status && status !== 'all') {
      sql += ' AND b.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY b.bookingTime DESC';

    console.log("Executing bookings query:", sql, "with params:", params);

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Error fetching driver bookings:", err);
        return res.status(500).json({ message: "Error fetching bookings" });
      }
      
      console.log(`Found ${results.length} bookings for driver ${driverID}`);
      res.json(results);
    });
  });
});

// ✅ Update booking status
router.put("/:driverID/bookings/:bookingId/status", (req, res) => {
  const { driverID, bookingId } = req.params;
  const { status } = req.body;

  console.log(`Updating booking ${bookingId} status to ${status} for driver ${driverID}`);

  const verifySql = "SELECT * FROM bookings WHERE id = ? AND driverID = ?";
  
  db.query(verifySql, [bookingId, driverID], (err, results) => {
    if (err) {
      console.error("Error verifying booking:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updateSql = "UPDATE bookings SET status = ? WHERE id = ?";
    
    db.query(updateSql, [status, bookingId], (err, result) => {
      if (err) {
        console.error("Error updating booking status:", err);
        return res.status(500).json({ message: "Error updating booking status" });
      }

      res.json({ message: "Booking status updated successfully" });
    });
  });
});

module.exports = router;


// // routes/drivers.js
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');

// // ✅ Get all drivers
// router.get("/", (req, res) => {
//   const sql = "SELECT * FROM drivers ORDER BY id";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error fetching drivers:", err);
//       return res.status(500).json({ message: "Error fetching drivers" });
//     }
//     res.json(results);
//   });
// });

// // ✅ Get driver by ID
// router.get("/:driverID", (req, res) => {
//   const { driverID } = req.params;
//   const sql = "SELECT * FROM drivers WHERE driver_id = ?";
  
//   db.query(sql, [driverID], (err, results) => {
//     if (err) {
//       console.error("Error fetching driver:", err);
//       return res.status(500).json({ message: "Error fetching driver" });
//     }
    
//     if (results.length === 0) {
//       return res.status(404).json({ message: "Driver not found" });
//     }
    
//     res.json(results[0]);
//   });
// });

// // ✅ Get driver's bookings with filter
// router.get("/:driverID/bookings", (req, res) => {
//   const { driverID } = req.params;
//   const { status } = req.query;

//   let sql = `
//     SELECT b.*, u.email as passenger_email, v.vehicleType, v.vehicleNumber
//     FROM bookings b 
//     JOIN users u ON b.passID = u.generated_id 
//     LEFT JOIN vehicles v ON b.vehicleId = v.vehicleId
//     WHERE b.driverID = ?
//   `;

//   const params = [driverID];

//   if (status && status !== 'all') {
//     sql += ' AND b.status = ?';
//     params.push(status);
//   }

//   sql += ' ORDER BY b.bookingTime DESC';

//   db.query(sql, params, (err, results) => {
//     if (err) {
//       console.error("Error fetching driver bookings:", err);
//       return res.status(500).json({ message: "Error fetching bookings" });
//     }
//     res.json(results);
//   });
// });

// // ✅ Update booking status
// router.put("/:driverID/bookings/:bookingId/status", (req, res) => {
//   const { driverID, bookingId } = req.params;
//   const { status } = req.body;

//   const verifySql = "SELECT * FROM bookings WHERE id = ? AND driverID = ?";
  
//   db.query(verifySql, [bookingId, driverID], (err, results) => {
//     if (err) {
//       console.error("Error verifying booking:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const updateSql = "UPDATE bookings SET status = ? WHERE id = ?";
    
//     db.query(updateSql, [status, bookingId], (err, result) => {
//       if (err) {
//         console.error("Error updating booking status:", err);
//         return res.status(500).json({ message: "Error updating booking status" });
//       }

//       res.json({ message: "Booking status updated successfully" });
//     });
//   });
// });

// // ✅ Update driver status
// router.put("/:driverID/status", (req, res) => {
//   const { driverID } = req.params;
//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({ message: "Status is required" });
//   }

//   const sql = "UPDATE drivers SET status = ?, updated_at = NOW() WHERE driver_id = ?";
  
//   db.query(sql, [status, driverID], (err, result) => {
//     if (err) {
//       console.error("Error updating driver status:", err);
//       return res.status(500).json({ message: "Error updating driver status" });
//     }
    
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Driver not found" });
//     }
    
//     res.json({ message: "Driver status updated successfully" });
//   });
// });

// // ✅ Your existing POST route
// router.post("/", (req, res) => {
//   const { name, email, phone, experience, status } = req.body;
//   // ... your post code
// });

// // ✅ Your existing DELETE route
// router.delete("/:driver_id", (req, res) => {
//   const { driver_id } = req.params;
//   const sql = "DELETE FROM drivers WHERE driver_id = ?";
  
//   db.query(sql, [driver_id], (err, result) => {
//     if (err) {
//       console.error("Error deleting driver:", err);
//       return res.status(500).json({ message: "Error deleting driver" });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Driver not found" });
//     }
//     res.json({ message: "Driver deleted successfully" });
//   });
// });

// module.exports = router;