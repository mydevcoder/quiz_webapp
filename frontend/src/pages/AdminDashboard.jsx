// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import api, { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/admin/results');
        setResults(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch results', err);
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200">
          Logout
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 p-4 font-bold text-gray-400 uppercase tracking-wider">
          <div>User Email</div>
          <div>Score</div>
          <div>Date Taken</div>
        </div>

        {/* Results List */}
        <div className="divide-y divide-gray-700">
          {loading ? (
            <p className="p-4 text-center">Loading results...</p>
          ) : (
            results.map((result) => (
              <div key={result._id} className="grid grid-cols-3 gap-4 p-4">
                <div>{result.user?.email || 'Unknown User'}</div>
                <div>{result.score} / {result.totalQuestions}</div>
                <div>{new Date(result.dateTaken).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}