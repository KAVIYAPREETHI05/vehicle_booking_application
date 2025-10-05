const express = require('express');
const router = express.Router();
const db = require('../config/db');

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Get notifications for driver
router.get('/driver/:driverID', async (req, res) => {
  const driverID = req.params.driverID;
  
  try {
    const sql = `
      SELECT * FROM notifications 
      WHERE driver_id = ? 
      ORDER BY created_at DESC
    `;
    
    const results = await query(sql, [driverID]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching driver notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get notifications for passenger
router.get('/passenger/:passID', async (req, res) => {
  const passID = req.params.passID;
  
  try {
    const sql = `
      SELECT * FROM notifications 
      WHERE passID = ? 
      ORDER BY created_at DESC
    `;
    
    const results = await query(sql, [passID]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching passenger notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// ✅ FIXED: Single POST route for creating notifications
// Create new notification - UPDATED
router.post('/', async (req, res) => {
  const { type, message, driver_id, passID, booking_id } = req.body;
  
  try {
    console.log('Creating notification with data:', req.body);
    
    // Better validation
    if (!type || !message) {
      return res.status(400).json({ error: 'Type and message are required' });
    }

    const sql = `
      INSERT INTO notifications (type, message, driver_id, passID, booking_id, isRead, created_at)
      VALUES (?, ?, ?, ?, ?, FALSE, NOW())
    `;
    
    // Use NULL for empty values to avoid foreign key issues
    const driverIdValue = driver_id || null;
    const passIDValue = passID || null; 
    const bookingIdValue = booking_id || null;
    
    const result = await query(sql, [type, message, driverIdValue, passIDValue, bookingIdValue]);
    
    console.log('Notification created successfully, ID:', result.insertId);
    
    res.status(201).json({ 
      message: 'Notification created successfully',
      notificationId: result.insertId 
    });
  } catch (err) {
    console.error('Database error creating notification:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  const notificationId = req.params.id;
  
  try {
    const sql = 'UPDATE notifications SET isRead = TRUE WHERE id = ?';
    await query(sql, [notificationId]);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Clear all notifications for driver
router.delete('/driver/:driverID', async (req, res) => {
  const driverID = req.params.driverID;
  
  try {
    const sql = 'DELETE FROM notifications WHERE driver_id = ?';
    await query(sql, [driverID]);
    res.json({ message: 'All notifications cleared' });
  } catch (err) {
    console.error('Error clearing driver notifications:', err);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

// Clear all notifications for passenger
router.delete('/passenger/:passID', async (req, res) => {
  const passID = req.params.passID;
  
  try {
    const sql = 'DELETE FROM notifications WHERE passID = ?';
    await query(sql, [passID]);
    res.json({ message: 'All notifications cleared' });
  } catch (err) {
    console.error('Error clearing passenger notifications:', err);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

// ✅ ADD THIS: Get recent unread notifications for popup
router.get('/popup/:userType/:userId', async (req, res) => {
  const { userType, userId } = req.params;
  
  try {
    let sql;
    if (userType === 'driver') {
      sql = `
        SELECT * FROM notifications 
        WHERE driver_id = ? AND isRead = FALSE 
        ORDER BY created_at DESC 
        LIMIT 5
      `;
    } else if (userType === 'passenger') {
      sql = `
        SELECT * FROM notifications 
        WHERE passID = ? AND isRead = FALSE 
        ORDER BY created_at DESC 
        LIMIT 5
      `;
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
    
    const results = await query(sql, [userId]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching popup notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// ✅ ADD THIS: Quick check for new notifications
router.get('/has-new/:userType/:userId', async (req, res) => {
  const { userType, userId } = req.params;
  
  try {
    let sql;
    if (userType === 'driver') {
      sql = 'SELECT COUNT(*) as count FROM notifications WHERE driver_id = ? AND isRead = FALSE';
    } else if (userType === 'passenger') {
      sql = 'SELECT COUNT(*) as count FROM notifications WHERE passID = ? AND isRead = FALSE';
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
    
    const results = await query(sql, [userId]);
    res.json({ hasNew: results[0].count > 0, count: results[0].count });
  } catch (err) {
    console.error('Error checking new notifications:', err);
    res.status(500).json({ error: 'Failed to check notifications' });
  }
});

module.exports = router;