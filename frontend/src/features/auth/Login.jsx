// frontend/src/features/auth/Login.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiMail, FiAlertCircle, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle navigation after successful login
  useEffect(() => {
    if (shouldNavigate) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldNavigate, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError(null);
  }, [fieldErrors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // Validate form fields
  const validateField = useCallback((name, value) => {
    if (!touched[name]) return '';
    
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        return '';
      default:
        return '';
    }
  }, [touched]);

  // Check each field validation
  const emailError = validateField('email', formData.email);
  const passwordError = validateField('password', formData.password);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate all fields before submission
    const touchedAll = {
      email: true,
      password: true,
    };
    setTouched(touchedAll);
    
    const errors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
    };
    
    // Check if there are any validation errors
    if (Object.values(errors).some(error => error)) {
      setFieldErrors(errors);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login/', formData);
      
      // Update credentials in Redux store
      dispatch(setCredentials(response.data));
      
      // Show success notification
      toast.success('Welcome back! Successfully logged in.', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });

      // Set navigation flag instead of navigating immediately
      setShouldNavigate(true);
    } catch (err) {
      setIsLoading(false);
      
      if (err.response?.data) {
        const backendErrors = {};
        Object.entries(err.response.data).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        
        if (err.response.status === 401 || backendErrors.detail) {
          const errorMessage = backendErrors.detail || 'Invalid email or password';
          setError(errorMessage);
          setFieldErrors({
            email: 'Invalid email or password',
            password: 'Invalid email or password'
          });
          
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark"
          });
        } else if (Object.keys(backendErrors).length > 0) {
          const errorMessage = 'Please correct the errors below.';
          setError(errorMessage);
          setFieldErrors(backendErrors);
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark"
          });
        } else {
          const errorMessage = 'Login failed. Please try again.';
          setError(errorMessage);
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark"
          });
        }
      } else {
        const errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark"
        });
      }
    }
  }, [formData, validateField, dispatch]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-12">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-[#3E60C1]/50 to-[#5983FC]/50 opacity-40 blur-3xl -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-bold bg-gradient-to-r from-[#FFFFFF] to-[#B8C7E0] inline-block text-transparent bg-clip-text mb-3"
          >
            Serenity Sphere
          </motion.h1>
          <p className="text-[#B8C7E0] mt-3">Welcome back! Please sign in to your account</p>
        </div>

        {/* Main card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-[#1A2335] rounded-2xl border border-[#2A3547] shadow-xl shadow-black/20 overflow-hidden p-1"
        >
          <div className="bg-gradient-to-br from-[#1A2335] to-[#1A2335] p-8 rounded-xl backdrop-blur-sm">
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              noValidate
            >
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-500/10 rounded-xl flex items-start relative"
                  >
                    <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-red-500 text-sm">{error}</span>
                    <button 
                      type="button" 
                      onClick={() => setError(null)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                    >
                      <FiX size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-[#B8C7E0] text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${
                        emailError || fieldErrors.email ? 'border-red-500' : 'border-[#2A3547]'
                      } focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>
                  <AnimatePresence>
                    {(emailError || fieldErrors.email) && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-sm mt-2 ml-1 flex items-center"
                      >
                        <FiAlertCircle className="mr-1" size={12} />
                        {emailError || fieldErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-[#B8C7E0] text-sm font-medium">Password</label>
                    <Link to="/forgot-password" className="text-xs text-[#5983FC] hover:text-[#3E60C1] transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${
                        passwordError || fieldErrors.password ? 'border-red-500' : 'border-[#2A3547]'
                      } focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                  </div>
                  <AnimatePresence>
                    {(passwordError || fieldErrors.password) && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-sm mt-2 ml-1 flex items-center"
                      >
                        <FiAlertCircle className="mr-1" size={12} />
                        {passwordError || fieldErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sign in button with loading state */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-[#5983FC]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </div>

              {/* Divider */}
              <div className="flex items-center pt-2">
                <div className="flex-grow h-px bg-[#2A3547]"></div>
                <span className="mx-4 text-sm text-[#64748B]">OR</span>
                <div className="flex-grow h-px bg-[#2A3547]"></div>
              </div>

              <div className="text-center">
                <p className="text-[#B8C7E0]">
                  Don't have an account yet?{' '}
                  <Link 
                    to="/register" 
                    className="text-[#5983FC] font-semibold hover:text-[#3E60C1] transition-colors"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
        
        {/* Footer text */}
        <p className="text-center mt-8 text-[#64748B] text-sm">
          By signing in, you agree to our <a href="#" className="text-[#5983FC] hover:text-[#3E60C1]">Terms of Service</a> and <a href="#" className="text-[#5983FC] hover:text-[#3E60C1]">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;