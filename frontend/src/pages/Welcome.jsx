// src/pages/Welcome.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-lg text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome,</h1>
      <h2 className="text-3xl font-bold text-teal-400 mb-6">{user?.email}</h2>
      <p className="text-lg text-gray-300 mb-8">Ready to test your knowledge? You'll have 5 minutes to answer the questions.</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => navigate('/quiz')}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200">
          Start Quiz
        </button>
        <button onClick={handleLogout}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200">
          Logout
        </button>
      </div>
    </div>
  );
}