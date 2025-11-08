const mongoose = require('mongoose');

const mealBookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  date: String,
  time: String,
  guests: Number,
  specialRequests: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MealBooking', mealBookingSchema);