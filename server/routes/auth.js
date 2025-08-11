// For promise-based db.query
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


const express = require("express");
const router = express.Router();
require("dotenv").config();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; // 🔐 Store securely via env in production

// --- SIGNUP ---
router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email.endsWith("@bitsathy.ac.in")) {
    return res.status(400).json({ message: "Only @bitsathy.ac.in allowed." });
  }

  try {
    // ✅ Check for duplicate email
    const existing = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate role-based ID
    let prefix = role === "admin" ? "admin" : role === "driver" ? "driver" : "pass";
    const id = prefix + Math.floor(100 + Math.random() * 900); // e.g., pass123

    await query(
      "INSERT INTO users (generated_id, email, password, role) VALUES (?, ?, ?, ?)",
      [id, email, hashedPassword, role]
    );

    res.status(201).json({ message: "User created", generatedId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});


// --- LOGIN ---
router.post("/login", async (req, res) => {
  const { id, password } = req.body;

  try {
    // 1. Find user by ID
const rows = await query("SELECT * FROM users WHERE generated_id = ?", [id]);

    if (rows.length === 0) {
      console.log("LOGIN ATTEMPT:", id);
      console.log("DB User: NOT FOUND");
      return res.status(401).json({ message: "User not found" });
    }

    const user = rows[0];

    // 2. Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
      // ✅ DEBUGGING LOGS HERE
    console.log("LOGIN ATTEMPT:", id);
    console.log("DB User:", user);
    console.log("Password Match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT token
    const token = jwt.sign({ id: user.generated_id, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

    // 4. Respond with token and user data
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        generated_id: user.generated_id,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/passenger/:passengerID', async (req, res) => {
  const { passengerID } = req.params;
  const passenger = await Passenger.findOne({ passengerID });
  if (!passenger) return res.status(404).send("Passenger not found");
  res.json(passenger);
});


module.exports = router;
