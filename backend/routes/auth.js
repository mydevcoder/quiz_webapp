// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Admin logic
    let role = 'user';
    if (email === 'admin@admin.com' && password === 'admin112') {
      role = 'admin';
    }

    user = new User({ email, password: hashedPassword, role });
    await user.save();

    // Don't send token on register, force login
    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) { 
    // --- ADD THIS LINE ---
    console.error('REGISTER ERROR:', err.message); 
    // ---
    res.status(500).send('Server error'); 
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
      user: { id: user.id, role: user.role, email: user.email }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: payload.user });

  } catch (err) { res.status(500).send('Server error'); }
});

module.exports = router;