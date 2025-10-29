// routes/admin.js
const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const adminAuth = require('../middleware/adminAuth');

// GET /api/admin/results (Get all results)
router.get('/results', adminAuth, async (req, res) => {
  try {
    // Find all results, populate the 'user' field with their email
    const results = await Result.find()
      .populate('user', 'email')
      .sort({ dateTaken: -1 }); // Show newest first

    res.json(results);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;