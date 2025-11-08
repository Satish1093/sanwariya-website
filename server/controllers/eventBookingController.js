const EventBooking = require('../models/EventBooking');

exports.createEventBooking = async (req, res) => {
  try {
    const newBooking = new EventBooking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Event booking saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save event booking' });
  }
};

exports.getAllEventBookings = async (req, res) => {
  try {
    const bookings = await EventBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};