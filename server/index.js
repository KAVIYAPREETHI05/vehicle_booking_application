const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use('/api/auth', authRoutes);

const bookingRoutes=require('./routes/booking');
app.use('/api/bookings',bookingRoutes);

const vehicleRoutes=require('./routes/vehicle');
app.use('/api/vehicles',vehicleRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const driversRouter = require('./routes/drivers');
app.use('/api/drivers', driversRouter);

const assignmentsRoutes = require('./routes/assignments');
app.use('/api/assignments', assignmentsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
