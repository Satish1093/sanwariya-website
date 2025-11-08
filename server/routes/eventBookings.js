const express = require('express');
const router = express.Router();
const eventBookingController = require('../controllers/eventBookingController');
const EventBooking = require('../models/EventBooking');

router.post('/', eventBookingController.createEventBooking);

router.get('/', eventBookingController.getAllEventBookings);

router.delete('/:id', async (req, res) => {
  try {
    await EventBooking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event booking' });
  }
});

module.exports = router;