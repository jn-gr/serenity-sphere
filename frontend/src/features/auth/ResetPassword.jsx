import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiAlertCircle, FiX, FiArrowLeft } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyResetLink = async () => {
      try {
        const response = await api.get(`/api/auth/password-reset/${uidb64}/${token}/`);
        setIsValid(true);
        setUserInfo(response.data);
      } catch (err) {
        setError('Invalid or expired reset link. Please request a new password reset.');
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);
      }
    };

    verifyResetLink();
  }, [uidb64, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError(null);
  };

  const validatePasswords = () => {
    const errors = {};
    if (!formData.new_password) {
      errors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters long';
    }
    if (!formData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (formData.new_password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post('/api/auth/password-reset/confirm/', {
        uid: uidb64,
        token: token,
        new_password: formData.new_password,
      });
      
      toast.success('Password has been reset successfully! You can now login with your new password.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.detail || 'Failed to reset password. Please try again.');
      } else {
        setError('Unable to connect to the server. Please check your internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValid) {
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
            <p className="text-[#B8C7E0] mt-3">Verifying reset link...</p>
          </div>
        </motion.div>
      </div>
    );
  }

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

              <div className="space-y-5">
                <div>
                  <label htmlFor="new_password" className="block text-[#B8C7E0] text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                    <input
                      id="new_password"
                      name="new_password"
                      type="password"
                      value={formData.new_password}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${
                        fieldErrors.new_password ? 'border-red-500' : 'border-[#2A3547]'
                      } focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                  </div>
                  <AnimatePresence>
                    {fieldErrors.new_password && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-sm mt-2 ml-1 flex items-center"
                      >
                        <FiAlertCircle className="mr-1" size={12} />
                        {fieldErrors.new_password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-[#B8C7E0] text-sm font-medium mb-2">Confirm New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${
                        fieldErrors.confirm_password ? 'border-red-500' : 'border-[#2A3547]'
                      } focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                  </div>
                  <AnimatePresence>
                    {fieldErrors.confirm_password && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-sm mt-2 ml-1 flex items-center"
                      >
                        <FiAlertCircle className="mr-1" size={12} />
                        {fieldErrors.confirm_password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
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
                      <span>Resetting password...</span>
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-[#B8C7E0] hover:text-white transition-colors inline-flex items-center"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to Login
                </button>
              </div>
            </form>
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

export default ResetPassword; 