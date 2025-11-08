const express = require('express');
const router = express.Router();
const { createMealBooking, getMealBookings } = require('../controllers/mealBookingController');
const MealBooking = require('../models/MealBooking'); 

router.post('/', createMealBooking);
router.get('/', getMealBookings); 

router.delete('/:id', async (req, res) => {
  try {
    await MealBooking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Meal booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting meal booking' });
  }
});

module.exports = router;