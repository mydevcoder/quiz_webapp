// src/pages/Quiz.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../context/AuthContext'; // Import the configured axios

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get('/quiz/questions');
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate('/'); // Go back home on error
      }
    };
    fetchQuestions();
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
    if (!loading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, loading]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmit = async () => {
    try {
      // Format answers for the backend
      const formattedAnswers = userAnswers.map(ans => ({
        questionId: ans.questionId,
        answer: ans.answer
      }));

      // Add the final answer if one was selected
      if (selectedAnswer) {
         formattedAnswers.push({
            questionId: questions[currentQ]._id,
            answer: selectedAnswer
         });
      }

      await api.post('/quiz/submit', { answers: formattedAnswers });
      navigate('/complete');
    } catch (err) {
      console.error('Failed to submit quiz', err);
    }
  };

  const handleNext = () => {
    // Save the current answer
    setUserAnswers([
      ...userAnswers,
      { questionId: questions[currentQ]._id, answer: selectedAnswer }
    ]);

    // Check if it's the last question
    if (currentQ === questions.length - 1) {
      handleSubmit();
    } else {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null); // Reset selection for next question
    }
  };

  if (loading) return <p>Loading Quiz...</p>;
  if (questions.length === 0) return <p>No questions available.</p>;

  const currentQuestion = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Question {currentQ + 1}/{questions.length}</span>
        <span className="bg-green-600 text-white text-lg font-bold px-4 py-1 rounded">
          {formatTime(timeLeft)}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>

      <h2 className="text-2xl font-bold mb-6">{currentQuestion.questionText}</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`p-4 rounded-lg text-left font-medium transition duration-200
              ${selectedAnswer === option
                ? 'bg-blue-600 ring-2 ring-blue-300' // Selected
                : 'bg-gray-700 hover:bg-gray-600' // Default
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedAnswer} // **Requirement: Only move next when answer is selected**
        className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition duration-200
                  disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {currentQ === questions.length - 1 ? 'Submit' : 'Next'}
      </button>
    </div>
  );
}