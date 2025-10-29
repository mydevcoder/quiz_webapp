// src/pages/QuizComplete.jsx
import { Link } from 'react-router-dom';

export default function QuizComplete() {
  return (
    <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md text-center">
      <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
      <p className="text-lg text-gray-300 mb-8">
        Thank you for participating. Your results have been recorded.
      </p>
      <Link
        to="/"
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200 inline-block"
      >
        Back to Home
      </Link>
    </div>
  );
}