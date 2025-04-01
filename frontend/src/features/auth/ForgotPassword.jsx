import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiAlertCircle, FiX, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({
    email: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }
    setError(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Validate email field
  const validateEmail = (value) => {
    if (!touched.email) return '';
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const emailError = validateEmail(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    const touchedAll = {
      email: true,
    };
    setTouched(touchedAll);
    
    const errors = {
      email: validateEmail(email),
    };
    
    if (errors.email) {
      setFieldErrors(errors);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      await api.post('/api/auth/password-reset/', { email });
      setSuccess(true);
      toast.success('Password reset instructions have been sent to your email');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err.response?.data) {
        const backendErrors = {};
        Object.entries(err.response.data).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setFieldErrors(backendErrors);
        
        if (err.response.status === 404) {
          setError('No account found with this email address.');
        } else if (Object.keys(backendErrors).length > 0) {
          setError('Please correct the errors below.');
        } else {
          setError('Failed to send reset instructions. Please try again.');
        }
      } else {
        setError('Unable to connect to the server. Please check your internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-12">
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
          <p className="text-[#B8C7E0] mt-3">Reset your password</p>
        </div>

        {/* Main card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-[#1A2335] rounded-2xl border border-[#2A3547] shadow-xl shadow-black/20 overflow-hidden p-1"
        >
          <div className="bg-gradient-to-br from-[#1A2335] to-[#1A2335] p-8 rounded-xl backdrop-blur-sm">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h3 className="text-xl font-semibold text-white">Check your email</h3>
                <p className="text-[#B8C7E0]">
                  We've sent password reset instructions to your email address.
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-sm text-[#64748B]">
                  Redirecting to login page...
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                  {error && (
                    <motion.div
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

                <div>
                  <label htmlFor="email" className="block text-[#B8C7E0] text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
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

                {/* Submit button */}
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
                        <span>Sending instructions...</span>
                      </div>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </motion.button>
                </div>

                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-[#B8C7E0] hover:text-white transition-colors inline-flex items-center"
                  >
                    <FiArrowLeft className="mr-2" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </motion.div>
        
        {/* Footer text */}
        <p className="text-center mt-8 text-[#64748B] text-sm">
          By using this service, you agree to our <a href="#" className="text-[#5983FC] hover:text-[#3E60C1]">Terms of Service</a> and <a href="#" className="text-[#5983FC] hover:text-[#3E60C1]">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 