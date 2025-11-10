const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Order = require('../models/Order');

const RESTAURANT_COORDS = { lat: 23.33880, lng: 76.83752 }; 

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * (Math.PI / 180);
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function sendConfirmationEmail(order) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `Sanwariya Hotel <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: 'Order Confirmation - Sanwariya Hotel',
    html: `
      <h3>Dear ${order.name},</h3>
      <p>Thank you for your order! Here are your order details:</p>
      <ul>
        ${order.items.map(item => `<li>${item.name}${item.variant ? ` (${item.variant})` : ''} - ₹${item.price}</li>`).join('')}
      </ul>
      <p><strong>Delivery Address:</strong> ${order.address}</p>
      <p><strong>Delivery Charge:</strong> ₹${order.deliveryCharge}</p>
      <p><strong>Total Amount:</strong> ₹${order.total}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p>We will contact you shortly for confirmation.</p>
      <p>Regards,<br>Sanwariya Hotel</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

router.post('/', async (req, res) => {
  const order = req.body;
  console.log("📦 Received Order:", order);

  try {
    const requiredFields = ['name', 'email', 'phone', 'address', 'paymentMethod', 'items', 'total', 'location'];
    for (const field of requiredFields) {
      if (!order[field] || (Array.isArray(order[field]) && order[field].length === 0)) {
        return res.status(400).json({ message: `Missing or invalid field: ${field}` });
      }
    }

    const { lat, lng } = order.location;
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Missing location coordinates' });
    }

    const distance = getDistanceKm(RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng, lat, lng);

    let charge = 0;
    if (distance <= 2) charge = 0;
    else if (distance <= 5) charge = 30;
    else if (distance <= 10) charge = 50;
    else return res.status(400).json({ message: 'Delivery address is out of range (more than 10 km).' });

    if (!['Cash on Delivery', 'UPI'].includes(order.paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const fullOrder = new Order({
      name: order.name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      paymentMethod: order.paymentMethod,
      deliveryCharge: charge,
      total: order.total, 
      items: order.items,
      location: {
        lat,
        lng
      },
      createdAt: new Date(),
      distance
    });

    await fullOrder.save();
    await sendConfirmationEmail(fullOrder);

    res.status(200).json({
      message: 'Order placed successfully! Email sent.',
      order: fullOrder,
      upiMessage: order.paymentMethod === 'UPI'
        ? 'Please proceed to pay using UPI: 9753600206@ybl'
        : null
    });

  } catch (err) {
  console.error("❌ ORDER ERROR DETAILS:", err);
  res.status(500).json({
    message: "Error processing order",
    error: err.message,
    stack: err.stack
  });
}
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.delete('/:id', async (req, res) => {
  console.log('🔴 DELETE hit with ID:', req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid order ID format' });
  }

  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password here
  },
});

module.exports = router;