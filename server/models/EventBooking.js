const mongoose = require('mongoose');

const eventBookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  occasion: { type: String, required: true }, // e.g., Birthday, Anniversary
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  specialRequests: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('EventBooking', eventBookingSchema);