import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { UserData } from '../services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser, checkAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

     try {
      const userData: UserData = await authService.login(email, password);
      loginUser(userData); // Update AuthContext state
      alert('Login successful!');
      navigate('/'); // Redirect to home or dashboard after successful login
      checkAuth(); // Re-check auth to ensure user data is fresh
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center -mt-3">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading? 'Logging in..' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;