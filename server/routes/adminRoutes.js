const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  console.log('Login attempt with:', email, password);
  console.log('Env:', adminEmail, adminPassword);

  if (email === adminEmail && password === adminPassword) {
    res.json({ success: true, isAdmin: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
