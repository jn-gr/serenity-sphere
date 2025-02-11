// frontend/src/features/auth/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FiLock, FiMail } from 'react-icons/fi';
import LoginImage from '../../assets/images/LoginImage.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login/', formData);
      dispatch(setCredentials(response.data));
      navigate('/');
    } catch (err) {
      if (err.response?.data) {
        setFieldErrors(err.response.data);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary.light/20 to-calm-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl flex"
      >
        {/* Image Section */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary.DEFAULT to-primary.dark p-12">
          <div className="h-full flex items-center justify-center">
            <img 
              src={LoginImage}
              alt="Wellness Illustration"
              className="w-full h-full object-cover rounded-l-3xl"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-serenity-dark mb-4">
              Serenity Sphere
            </h1>
            <h2 className="text-2xl text-calm-500 font-medium">
              Welcome back to your wellness journey
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-calm-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 rounded-xl border-2 border-calm-200 focus:border-primary.DEFAULT focus:ring-0 transition-all"
                  placeholder="Email address"
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-2 ml-1">{fieldErrors.email}</p>
                )}
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-calm-400" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 rounded-xl border-2 border-calm-200 focus:border-primary.DEFAULT focus:ring-0 transition-all"
                  placeholder="Password"
                />
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm mt-2 ml-1">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary.DEFAULT to-primary.dark text-white py-5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-primary.light/40 transition-all"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>

            <div className="text-center mt-6">
              <p className="text-calm-500">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary.DEFAULT font-semibold hover:text-primary.dark transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;