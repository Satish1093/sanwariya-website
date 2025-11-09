const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const bookingRoute = require('./routes/bookingRoute');
const contactRoute = require('./routes/contactRoute');
const dishRoutes = require('./routes/dishRoutes');
const eventBookings = require('./routes/eventBookings');
const imageUploadRoutes = require('./routes/imageUpload');
const mealBookingRoutes = require('./routes/mealBookingRoutes');
const orderRoutes = require('./routes/orderRoutes');
const otpRoutes = require('./routes/otpRoutes');
const adminRoutes = require('./routes/adminRoutes');



app.use('/api/bookings', bookingRoute);
app.use('/api/contact', contactRoute);
app.use('/api/dishes', dishRoutes);
app.use('/api/events', eventBookings);
app.use('/api/images', imageUploadRoutes);
app.use('/api/meals', mealBookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});