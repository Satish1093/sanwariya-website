const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

// ---------------------------------------------------------
// ✅ Validate environment variables
// ---------------------------------------------------------
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY missing in environment variables.");
} else {
  console.log("✔ SENDGRID_API_KEY loaded.");
}

if (!process.env.SENDGRID_FROM_EMAIL) {
  console.error("❌ SENDGRID_FROM_EMAIL missing in environment variables.");
}

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ---------------------------------------------------------
// INTERNAL OTP STORE (in-memory) – OK for student projects
// ---------------------------------------------------------
const otpStore = new Map();
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ---------------------------------------------------------
// 📩 SEND OTP
// ---------------------------------------------------------
router.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Generate OTP
    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Email message
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // MUST be verified
      subject: "Sanwariya Hotel OTP Verification",
      html: `
        <h2>Your OTP Code</h2>
        <p><strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes.</p>
        <p>– Sanwariya Hotel</p>
      `,
    };

    // Send OTP
    await sgMail.send(msg);

    console.log(`✔ OTP sent to: ${email}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("❌ OTP sending failed:", error.message);

    // SendGrid detailed error
    if (error.response?.body) {
      console.error("SendGrid Error:", error.response.body);
    }

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

// ---------------------------------------------------------
// 🔐 VERIFY OTP
// ---------------------------------------------------------
router.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({
      success: false,
      message: "OTP not found or expired",
    });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  if (record.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  otpStore.delete(email);

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

module.exports = router;

