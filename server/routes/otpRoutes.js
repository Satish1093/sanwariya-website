const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Temporary in-memory OTP store (replace with DB for production)
const otpStore = new Map();

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP to Email
router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    const msg = {
      to: email,
      from: 'sanwariyahotel@outlook.com', // use verified email from SendGrid
      subject: 'Sanwariya Hotel OTP Verification',
      html: `
        <h3>Hello,</h3>
        <p>Your OTP for booking verification is:</p>
        <h1 style="color:#ff9900;">${otp}</h1>
        <p>This code is valid for <strong>5 minutes</strong>.</p>
        <p>If you didn’t request this, please ignore this email.</p>
        <p>— Sanwariya Hotel Team</p>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ OTP sent successfully to ${email}`);
    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (err) {
    console.error('❌ OTP sending failed:', err.message);
    res.status(500).json({ message: 'Failed to send OTP email' });
  }
});

// ✅ Verify OTP
router.post('/verify-email-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record) return res.status(400).json({ message: 'OTP not found or expired' });
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP expired' });
  }
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  otpStore.delete(email);
  res.status(200).json({ message: 'OTP verified successfully!' });
});

module.exports = router;
