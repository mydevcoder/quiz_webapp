// routes/quiz.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// GET /api/quiz/questions (Get 10 random questions)
// NOTE: We strip the 'correctAnswer' before sending to the client!
router.get('/questions', auth, async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    const safeQuestions = questions.map(q => {
      const { correctAnswer, ...questionData } = q; // Exclude correct answer
      return questionData;
    });
    res.json(safeQuestions);
  } catch (err) { res.status(500).send('Server error'); }
});

// POST /api/quiz/submit
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body; // e.g., [{ questionId: '...', answer: '...' }]
    const questionIds = answers.map(a => a.questionId);

    // Get the correct answers from the DB
    const correctQuestions = await Question.find({ '_id': { $in: questionIds } });

    let score = 0;
    answers.forEach(userAnswer => {
      const question = correctQuestions.find(q => q._id.toString() === userAnswer.questionId);
      if (question && question.correctAnswer === userAnswer.answer) {
        score++;
      }
    });

    // Save the result
    const result = new Result({
      user: req.user.id,
      score: score,
      totalQuestions: answers.length,
    });
    await result.save();

    // Per requirements, DON'T send the score back to the user
    res.json({ msg: 'Quiz submitted successfully!' });

  } catch (err) { res.status(500).send('Server error'); }
});

module.exports = router;