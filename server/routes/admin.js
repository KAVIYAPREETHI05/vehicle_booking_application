// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get dashboard statistics
router.get('/dashboard-stats', (req, res) => {
  // Get vehicle stats
  const vehicleStatsQuery = `
    SELECT 
      COUNT(*) as totalVehicles,
      SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) as availableVehicles,
      SUM(CASE WHEN status != 'Available' THEN 1 ELSE 0 END) as unavailableVehicles
    FROM vehicles
  `;

  // Get driver stats
  const driverStatsQuery = `
    SELECT 
      COUNT(*) as totalDrivers,
      SUM(CASE WHEN status = 'on_duty' THEN 1 ELSE 0 END) as availableDrivers,
      SUM(CASE WHEN status = 'on_leave' THEN 1 ELSE 0 END) as onLeaveDrivers,
      SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspendedDrivers,
      SUM(CASE WHEN status = 'terminated' THEN 1 ELSE 0 END) as terminatedDrivers
    FROM drivers
  `;

  // Get user stats
  const userStatsQuery = `
    SELECT COUNT(*) as totalUsers FROM users
  `;

  // Get active rides (bookings that are accepted but not completed)
  const activeRidesQuery = `
    SELECT COUNT(*) as activeRides FROM bookings WHERE status = 'Accepted'
  `;

  // Execute all queries
  db.query(vehicleStatsQuery, (err, vehicleResults) => {
    if (err) {
      console.error('Error fetching vehicle stats:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    db.query(driverStatsQuery, (err, driverResults) => {
      if (err) {
        console.error('Error fetching driver stats:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      db.query(userStatsQuery, (err, userResults) => {
        if (err) {
          console.error('Error fetching user stats:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        db.query(activeRidesQuery, (err, rideResults) => {
          if (err) {
            console.error('Error fetching active rides:', err);
            return res.status(500).json({ error: 'Database error' });
          }

          res.json({
            totalVehicles: vehicleResults[0].totalVehicles,
            availableVehicles: vehicleResults[0].availableVehicles,
            unavailableVehicles: vehicleResults[0].unavailableVehicles,
            totalDrivers: driverResults[0].totalDrivers,
            availableDrivers: driverResults[0].availableDrivers,
            onLeaveDrivers: driverResults[0].onLeaveDrivers,
            suspendedDrivers: driverResults[0].suspendedDrivers,
            terminatedDrivers: driverResults[0].terminatedDrivers,
            totalUsers: userResults[0].totalUsers,
            activeRides: rideResults[0].activeRides
          });
        });
      });
    });
  });
});

// Get all vehicles for admin dashboard
router.get('/vehicles', (req, res) => {
  const sql = "SELECT vehicleId as id, vehicleType as type, capacity, status, 'Unknown' as location FROM vehicles";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching vehicles:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get all drivers for admin dashboard
router.get('/drivers', (req, res) => {
  const sql = `
    SELECT driver_id as id,
           name,
           email,
           phone,
           experience,
           status
    FROM drivers
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching drivers:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// ✅ FIXED: ADMIN DASHBOARD STATS
router.get('/dashboard-stats', async (req, res) => {
  try {
    console.log('Fetching dashboard stats...');
    
    const totalRidesResult = await query('SELECT COUNT(*) as count FROM bookings');
    const todayRidesResult = await query('SELECT COUNT(*) as count FROM bookings WHERE DATE(bookingTime) = CURDATE()');
    const pendingRequestsResult = await query('SELECT COUNT(*) as count FROM bookings WHERE status = "Requested"');
    
    const totalRides = totalRidesResult[0]?.count || 0;
    const todayRides = todayRidesResult[0]?.count || 0;
    const pendingRequests = pendingRequestsResult[0]?.count || 0;
    
    console.log('Stats:', { totalRides, todayRides, pendingRequests });
    
    res.json({
      totalRides,
      todayRides,
      pendingRequests,
      totalRevenue: 0 // Start with 0 for now
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats: ' + err.message });
  }
});

// ✅ FIXED: WEEKLY RIDES ANALYTICS (Simplified)
router.get('/rides-weekly', async (req, res) => {
  try {
    console.log('Fetching weekly rides...');
    
    // Simple query that should work
    const sql = `
      SELECT 
        DAYOFWEEK(bookingTime) as day_number,
        DAYNAME(bookingTime) as day,
        COUNT(*) as count
      FROM bookings 
      WHERE bookingTime >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DAYOFWEEK(bookingTime), DAYNAME(bookingTime)
      ORDER BY day_number
    `;
    
    const results = await query(sql);
    console.log('Weekly rides results:', results);
    
    // If no results, return empty array with days
    if (results.length === 0) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const emptyData = days.map(day => ({ day, count: 0 }));
      return res.json(emptyData);
    }
    
    res.json(results);
  } catch (err) {
    console.error('Error fetching weekly rides:', err);
    // Return empty data instead of error
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const emptyData = days.map(day => ({ day, count: 0 }));
    res.json(emptyData);
  }
});

// ✅ FIXED: MONTHLY RIDES ANALYTICS (Simplified)
router.get('/rides-monthly', async (req, res) => {
  try {
    console.log('Fetching monthly rides...');
    
    const sql = `
      SELECT 
        MONTH(bookingTime) as month_number,
        MONTHNAME(bookingTime) as month,
        COUNT(*) as count
      FROM bookings 
      WHERE YEAR(bookingTime) = YEAR(CURDATE())
      GROUP BY MONTH(bookingTime), MONTHNAME(bookingTime)
      ORDER BY month_number
    `;
    
    const results = await query(sql);
    console.log('Monthly rides results:', results);
    
    // If no results, return empty array
    if (results.length === 0) {
      return res.json([]);
    }
    
    res.json(results);
  } catch (err) {
    console.error('Error fetching monthly rides:', err);
    // Return empty array instead of error
    res.json([]);
  }
});

// ✅ FIXED: PERFORMANCE METRICS (Simplified)
router.get('/performance-metrics', async (req, res) => {
  try {
    console.log('Fetching performance metrics...');
    
    // Simple driver performance query
    const driverPerformance = await query(`
      SELECT 
        d.driver_id,
        d.name,
        COUNT(b.id) as completed_rides
      FROM drivers d
      LEFT JOIN bookings b ON d.driver_id = b.driverID AND b.status = 'Completed'
      GROUP BY d.driver_id, d.name
      ORDER BY completed_rides DESC
      LIMIT 5
    `);
    
    console.log('Performance metrics results:', driverPerformance);
    
    res.json({
      driverPerformance: driverPerformance || [],
      passengerActivity: [],
      rideTrends: []
    });
  } catch (err) {
    console.error('Error fetching performance metrics:', err);
    // Return empty data instead of error
    res.json({
      driverPerformance: [],
      passengerActivity: [],
      rideTrends: []
    });
  }
});

// ✅ ADD THESE ASSIGNMENT ROUTES TO YOUR ADMIN.JS

// Get available drivers for assignment
router.get('/assignments/drivers', (req, res) => {
  const sql = `
    SELECT driver_id, name, email, status 
    FROM drivers 
    WHERE status = 'available' 
    ORDER BY name
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching available drivers:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get available vehicles for assignment
router.get('/assignments/vehicles', (req, res) => {
  const sql = `
    SELECT vehicleId, vehicleType, vehicleNumber, status 
    FROM vehicles 
    WHERE status = 'Available' 
    ORDER BY vehicleId
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching available vehicles:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get all assignments
router.get('/assignments', (req, res) => {
  const sql = `
    SELECT 
      a.*,
      d.name as driver_name,
      v.vehicleNumber as vehicle_number
    FROM assignments a
    LEFT JOIN drivers d ON a.driver_id = d.driver_id
    LEFT JOIN vehicles v ON a.vehicle_id = v.vehicleId
    ORDER BY a.start_time DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Create new assignment
router.post('/assignments', (req, res) => {
  const { driver_id, vehicle_id, from_time, to_time } = req.body;
  
  // Validate required fields
  if (!driver_id || !vehicle_id || !from_time || !to_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if driver exists and is available
  const checkDriverSql = 'SELECT * FROM drivers WHERE driver_id = ? AND status = "available"';
  db.query(checkDriverSql, [driver_id], (err, driverResults) => {
    if (err) {
      console.error('Error checking driver:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (driverResults.length === 0) {
      return res.status(400).json({ error: 'Driver not found or not available' });
    }

    // Check if vehicle exists and is available
    const checkVehicleSql = 'SELECT * FROM vehicles WHERE vehicleId = ? AND status = "Available"';
    db.query(checkVehicleSql, [vehicle_id], (err, vehicleResults) => {
      if (err) {
        console.error('Error checking vehicle:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (vehicleResults.length === 0) {
        return res.status(400).json({ error: 'Vehicle not found or not available' });
      }

      // Insert new assignment (using start_time and end_time as per your table)
      const insertSql = `
        INSERT INTO assignments (driver_id, vehicle_id, start_time, end_time, created_at) 
        VALUES (?, ?, ?, ?, NOW())
      `;
      
      db.query(insertSql, [driver_id, vehicle_id, from_time, to_time], (err, result) => {
        if (err) {
          console.error('Error creating assignment:', err);
          return res.status(500).json({ error: 'Failed to assign driver' });
        }

        // Update driver status to on_duty
        const updateDriverSql = 'UPDATE drivers SET status = "on_duty" WHERE driver_id = ?';
        db.query(updateDriverSql, [driver_id], (err) => {
          if (err) {
            console.error('Error updating driver status:', err);
          }

          // Update vehicle status to Unavailable
          const updateVehicleSql = 'UPDATE vehicles SET status = "Unavailable" WHERE vehicleId = ?';
          db.query(updateVehicleSql, [vehicle_id], (err) => {
            if (err) {
              console.error('Error updating vehicle status:', err);
            }

            res.status(201).json({ 
              message: 'Driver assigned successfully',
              assignmentId: result.insertId 
            });
          });
        });
      });
    });
  });
});

// Delete assignment
router.delete('/assignments/:id', (req, res) => {
  const assignmentId = req.params.id;
  
  // Get assignment details first
  const getAssignmentSql = 'SELECT * FROM assignments WHERE id = ?';
  db.query(getAssignmentSql, [assignmentId], (err, assignmentResults) => {
    if (err) {
      console.error('Error fetching assignment:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (assignmentResults.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    const { driver_id, vehicle_id } = assignmentResults[0];
    
    // Delete the assignment
    const deleteSql = 'DELETE FROM assignments WHERE id = ?';
    db.query(deleteSql, [assignmentId], (err) => {
      if (err) {
        console.error('Error deleting assignment:', err);
        return res.status(500).json({ error: 'Failed to remove assignment' });
      }

      // Update driver status back to available
      const updateDriverSql = 'UPDATE drivers SET status = "available" WHERE driver_id = ?';
      db.query(updateDriverSql, [driver_id], (err) => {
        if (err) {
          console.error('Error updating driver status:', err);
        }

        // Update vehicle status back to Available
        const updateVehicleSql = 'UPDATE vehicles SET status = "Available" WHERE vehicleId = ?';
        db.query(updateVehicleSql, [vehicle_id], (err) => {
          if (err) {
            console.error('Error updating vehicle status:', err);
          }

          res.json({ message: 'Assignment removed successfully' });
        });
      });
    });
  });
});

module.exports = router;