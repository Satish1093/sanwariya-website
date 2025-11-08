const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

router.post('/', async (req, res) => {
  try {
    const { name, price, category, imageUrl, publicId } = req.body;
    if (!name || !price || !category || !imageUrl || !publicId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newDish = new Dish({ name, price, category, imageUrl, publicId });
    await newDish.save();
    res.status(201).json({ message: 'Dish added successfully', dish: newDish });
  } catch (err) {
    console.error('❌ Error adding dish:', err);
    res.status(500).json({ message: 'Error adding dish' });
  }
});

router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.status(200).json(dishes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dishes' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Dish.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting dish' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, price, category, imageUrl, publicId } = req.body;

    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      { name, price, category, imageUrl, publicId },
      { new: true }
    );

    if (!updatedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    res.json({ message: 'Dish updated successfully', dish: updatedDish });
  } catch (err) {
    console.error('❌ Error updating dish:', err);
    res.status(500).json({ message: 'Error updating dish' });
  }
});

module.exports = router;