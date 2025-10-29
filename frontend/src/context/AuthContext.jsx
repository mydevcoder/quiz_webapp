import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Set up axios default
const api = axios.create({
  baseURL: 'https://quiz-webapp-zl3m.onrender.com/api', // Your backend URL
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
      // Try to fetch user data on load if token exists
      // (You would add a '/api/auth/me' route for this)
      // For this guide, we'll parse the user from local storage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      delete api.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user; // Return user to check role
  };

  const register = async (email, password) => {
    await api.post('/auth/register', { email, password });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default api; // Export the configured axios instance