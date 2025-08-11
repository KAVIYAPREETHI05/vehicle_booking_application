const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust if your DB config is named differently

// Get passenger data by passengerID
router.get('/passenger/:passengerID', (req, res) => {
  const { passengerID } = req.params;

  const sql = 'SELECT * FROM users WHERE userID = ? AND role = "passenger"';
  db.query(sql, [passengerID], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    res.json(result[0]);
  });
});

module.exports = router;
