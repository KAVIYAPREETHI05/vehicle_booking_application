// routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get driver dashboard data
router.get('/dashboard/:driverID', async (req, res) => {
    try {
        const { driverID } = req.params;

        // Get driver basic info
        const [driverInfo] = await db.execute(
            'SELECT * FROM drivers WHERE driver_id = ?',
            [driverID]
        );

        if (driverInfo.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        // Get assigned vehicle
        const [vehicleAssignment] = await db.execute(
            `SELECT v.*, a.start_time, a.end_time 
             FROM assignments a 
             JOIN vehicles v ON a.vehicle_id = v.vehicleId 
             WHERE a.driver_id = ? AND a.end_time > NOW() 
             ORDER BY a.start_time DESC LIMIT 1`,
            [driverID]
        );

        // Get current bookings
        const [currentBookings] = await db.execute(
            `SELECT b.*, u.email as passenger_email 
             FROM bookings b 
             JOIN users u ON b.passID = u.generated_id 
             WHERE b.driverID = ? AND b.status IN ('Assigned', 'In Progress') 
             ORDER BY b.bookingTime DESC`,
            [driverID]
        );

        // Get booking history (last 10)
        const [bookingHistory] = await db.execute(
            `SELECT b.*, u.email as passenger_email 
             FROM bookings b 
             JOIN users u ON b.passID = u.generated_id 
             WHERE b.driverID = ? 
             ORDER BY b.bookingTime DESC LIMIT 10`,
            [driverID]
        );

        // Get unread notifications
        const [notifications] = await db.execute(
            `SELECT * FROM notifications 
             WHERE driver_id = ? AND isRead = FALSE 
             ORDER BY created_at DESC`,
            [driverID]
        );

        res.json({
            driver: driverInfo[0],
            vehicle: vehicleAssignment[0] || null,
            currentBookings,
            bookingHistory,
            notifications,
            stats: {
                totalBookings: bookingHistory.length,
                pendingBookings: currentBookings.length,
                unreadNotifications: notifications.length
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get driver's bookings
router.get('/bookings/:driverID', async (req, res) => {
    try {
        const { driverID } = req.params;
        const { status } = req.query;

        let query = `
            SELECT b.*, u.email as passenger_email, v.vehicleType, v.vehicleNumber
            FROM bookings b 
            JOIN users u ON b.passID = u.generated_id 
            LEFT JOIN vehicles v ON b.vehicleId = v.vehicleId
            WHERE b.driverID = ?
        `;

        const params = [driverID];

        if (status && status !== 'all') {
            query += ' AND b.status = ?';
            params.push(status);
        }

        query += ' ORDER BY b.bookingTime DESC';

        const [bookings] = await db.execute(query, params);
        res.json(bookings);

    } catch (error) {
        console.error('Bookings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update booking status
router.put('/bookings/:bookingId/status', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status, driverID } = req.body;

        // Verify driver owns this booking
        const [booking] = await db.execute(
            'SELECT * FROM bookings WHERE id = ? AND driverID = ?',
            [bookingId, driverID]
        );

        if (booking.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        await db.execute(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, bookingId]
        );

        // Create notification for passenger
        await db.execute(
            `INSERT INTO notifications (type, message, passID, booking_id, driver_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                'driver_message',
                `Your booking status has been updated to: ${status}`,
                booking[0].passID,
                bookingId,
                driverID
            ]
        );

        res.json({ message: 'Booking status updated successfully' });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update driver status
router.put('/status/:driverID', async (req, res) => {
    try {
        const { driverID } = req.params;
        const { status } = req.body;

        await db.execute(
            'UPDATE drivers SET status = ? WHERE driver_id = ?',
            [status, driverID]
        );

        res.json({ message: 'Driver status updated successfully' });

    } catch (error) {
        console.error('Update driver status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark notification as read
router.put('/notifications/:notificationId/read', async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { driverID } = req.body;

        await db.execute(
            'UPDATE notifications SET isRead = TRUE WHERE id = ? AND driver_id = ?',
            [notificationId, driverID]
        );

        res.json({ message: 'Notification marked as read' });

    } catch (error) {
        console.error('Mark notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;