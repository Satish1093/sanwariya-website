const MealBooking = require('../models/MealBooking');

exports.createMealBooking = async (req, res) => {
  try {
    const newBooking = new MealBooking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Meal booking saved successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving meal booking', error: err });
  }
};

exports.getMealBookings = async (req, res) => {
  try {
    const bookings = await MealBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meal bookings', error: err });
  }
};