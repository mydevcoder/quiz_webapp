const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  dateTaken: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Result', ResultSchema);