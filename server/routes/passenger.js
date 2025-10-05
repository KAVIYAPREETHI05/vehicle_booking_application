const express = require('express');
const router = express.Router();
const db = require('../config/db');



/**
 * GET /passenger/dashboard/:passID
 * Returns passenger details, bookings, and notifications
 */
router.get("/dashboard/:passID", async (req, res) => {
  const { passID } = req.params;

  try {
    // ✅ 1. Verify passenger exists in users table
    const [user] = await db.query(
      "SELECT generated_id, email, role, created_at FROM users WHERE generated_id = ? AND role = 'passenger'",
      [passID]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: "Passenger not found" });
    }

    // ✅ 2. Fetch bookings for this passenger
    const [bookings] = await db.query(
      `SELECT b.id, b.place, b.time, b.reason, b.status, b.bookingTime,
              v.vehicleType, v.vehicleNumber, v.capacity,
              d.name as driverName, d.phone as driverPhone
       FROM bookings b
       LEFT JOIN vehicles v ON b.vehicleId = v.vehicleId
       LEFT JOIN drivers d ON b.driverID = d.driver_id
       WHERE b.passID = ?`,
      [passID]
    );

    // ✅ 3. Fetch notifications for this passenger
    const [notifications] = await db.query(
      `SELECT id, type, message, isRead, created_at
       FROM notifications
       WHERE passID = ?
       ORDER BY created_at DESC`,
      [passID]
    );

    // ✅ 4. Respond to frontend
    res.json({
      passenger: user[0],
      bookings,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching passenger dashboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add these routes to your passenger routes file

/**
 * GET /api/bookings/analytics/weekly/:passID
 * Get weekly ride count for passenger
 */
/**
 * GET /api/bookings/analytics/rides/:passID
 * Get rides for analytics table with time filter
 */
router.get("/analytics/rides/:passID", async (req, res) => {
  const { passID } = req.params;
  const { period = 'week' } = req.query;
  
  try {
    let dateFilter = '';
    switch (period) {
      case 'week':
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case 'month':
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      case 'year':
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
        break;
      default:
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    }
    
    const [results] = await db.query(
      `SELECT b.id, b.place, b.time, b.status, b.bookingTime,
              d.name as driverName, v.vehicleType
       FROM bookings b
       LEFT JOIN drivers d ON b.driverID = d.driver_id
       LEFT JOIN vehicles v ON b.vehicleId = v.vehicleId
       WHERE b.passID = ? ${dateFilter}
       ORDER BY b.bookingTime DESC
       LIMIT 50`,
      [passID]
    );
    
    res.json(results);
  } catch (error) {
    console.error("Error fetching ride analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/bookings/analytics/drivers/:passID
 * Get driver statistics with time filter
 */
router.get("/analytics/drivers/:passID", async (req, res) => {
  const { passID } = req.params;
  const { period = 'week' } = req.query;
  
  try {
    let dateFilter = '';
    switch (period) {
      case 'week':
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case 'month':
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      case 'year':
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
        break;
      default:
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    }
    
    const [results] = await db.query(
      `SELECT d.driver_id, d.name, COUNT(b.id) as count
       FROM bookings b
       JOIN drivers d ON b.driverID = d.driver_id
       WHERE b.passID = ? AND b.driverID IS NOT NULL ${dateFilter}
       GROUP BY d.driver_id, d.name
       ORDER BY count DESC
       LIMIT 10`,
      [passID]
    );
    
    res.json(results);
  } catch (error) {
    console.error("Error fetching driver analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/bookings/analytics/vehicles/:passID
 * Get vehicle statistics with time filter
 */
router.get("/analytics/vehicles/:passID", async (req, res) => {
  const { passID } = req.params;
  const { period = 'week' } = req.query;
  
  try {
    let dateFilter = '';
    switch (period) {
      case 'week':
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case 'month':
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      case 'year':
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
        break;
      default:
        dateFilter = 'AND b.bookingTime >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    }
    
    const [results] = await db.query(
      `SELECT v.vehicleId, v.vehicleType, COUNT(b.id) as count
       FROM bookings b
       JOIN vehicles v ON b.vehicleId = v.vehicleId
       WHERE b.passID = ? AND b.vehicleId IS NOT NULL ${dateFilter}
       GROUP BY v.vehicleId, v.vehicleType
       ORDER BY count DESC
       LIMIT 10`,
      [passID]
    );
    
    res.json(results);
  } catch (error) {
    console.error("Error fetching vehicle analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/bookings/analytics/timeline/:passID
 * Get timeline data for charts
 */
router.get("/analytics/timeline/:passID", async (req, res) => {
  const { passID } = req.params;
  const { period = 'week' } = req.query;
  
  try {
    let dateFormat, dateRange;
    switch (period) {
      case 'week':
        dateFormat = '%Y-%m-%d';
        dateRange = '7 DAY';
        break;
      case 'month':
        dateFormat = '%Y-%m-%d';
        dateRange = '30 DAY';
        break;
      case 'year':
        dateFormat = '%Y-%m';
        dateRange = '1 YEAR';
        break;
      default:
        dateFormat = '%Y-%m-%d';
        dateRange = '7 DAY';
    }
    
    const [results] = await db.query(
      `SELECT DATE_FORMAT(bookingTime, ?) as date, COUNT(*) as count
       FROM bookings 
       WHERE passID = ? 
       AND bookingTime >= DATE_SUB(NOW(), INTERVAL ?)
       GROUP BY DATE_FORMAT(bookingTime, ?)
       ORDER BY date`,
      [dateFormat, passID, dateRange, dateFormat]
    );
    
    res.json(results);
  } catch (error) {
    console.error("Error fetching timeline analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
