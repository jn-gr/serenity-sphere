import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../auth/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiEdit, 
  FiSave, 
  FiInfo, 
  FiCheckCircle, 
  FiAlertCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaCheckCircle as FaCheckCircleIcon, FaSpinner, FaUser } from 'react-icons/fa';
import { updateStart, updateSuccess, updateFailure, clearError, clearSuccess } from './profileSlice';

const updateProfile = (data) => {
  return async (dispatch) => {
    try {
      dispatch(updateStart());
      const response = await api.patch('/api/user-profile/', data);
      dispatch(updateSuccess());
      dispatch(setCredentials({ user: response.data, isAuthenticated: true }));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      dispatch(updateFailure(errorMessage));
      throw new Error(errorMessage);
    }
  };
};

const Profile = () => {
  const { isDark } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  
  const { isLoading, error, success } = useSelector(state => state.profile);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [oldPassword, setOldPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);


  const [avatar, setAvatar] = useState(null);
  const [passwordError, setPasswordError] = useState('');


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/user-profile/');
        dispatch(setCredentials({ user: response.data, isAuthenticated: true }));
        setFormData({
          username: response.data.username,
          email: response.data.email,
          password: '',
          confirmPassword: ''
        });
        

        setAvatar(`https://ui-avatars.com/api/?name=${response.data.username}&background=5983FC&color=fff`);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage({
          type: 'error',
          text: 'Failed to fetch profile. Please try again later.'
        });
      }
    };

    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: ''
      });
      

      setAvatar(`https://ui-avatars.com/api/?name=${user.username}&background=5983FC&color=fff`);
    } else {
      fetchProfile();
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    
    if (success) {

      const updatedFields = [];
      if (formData.username !== user?.username) updatedFields.push('username');
      if (formData.email !== user?.email) updatedFields.push('email');
      if (formData.password) updatedFields.push('password');

      let successMessage = 'Profile updated successfully!';
      if (updatedFields.length > 0) {
        successMessage = `Successfully updated ${updatedFields.join(', ')}!`;
      }
      
      toast.success(successMessage);
      dispatch(clearSuccess());
      setSuccessAnimation(true);
      setTimeout(() => setSuccessAnimation(false), 2000);
    }
  }, [error, success, dispatch, formData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    

    if (name === 'username') {
      setAvatar(`https://ui-avatars.com/api/?name=${value}&background=5983FC&color=fff`);
    }
    
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setMessage(null);
    

    if (name === 'password' || name === 'confirmPassword') {
      const newFormData = {
        ...formData,
        [name]: value
      };
      
      if (newFormData.password && newFormData.confirmPassword) {
        if (newFormData.password !== newFormData.confirmPassword) {
          setPasswordError('Passwords do not match');
        } else {
          setPasswordError('');
        }
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    let hasErrors = false;
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      hasErrors = true;
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      hasErrors = true;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      hasErrors = true;
    }
    
    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }
    
    const updateData = { ...formData };
    if (!updateData.password.trim()) {
      delete updateData.password;
      delete updateData.confirmPassword;
    } else {
      delete updateData.confirmPassword;
      
      if (activeTab === 'security' && oldPassword) {
        updateData.old_password = oldPassword;
      }
    }
    
    try {
      await dispatch(updateProfile(updateData));
      
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      setOldPassword('');
      
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        if (backendErrors.old_password) {
          toast.error('Incorrect current password');
        } else {
          setFieldErrors(backendErrors);
        }
      } else {
        setMessage({
          type: 'error',
          text: err.message || 'Failed to update profile'
        });
      }
    }
  };

  const resetForm = () => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: ''
      });
      
      setAvatar(`https://ui-avatars.com/api/?name=${user.username}&background=5983FC&color=fff`);
    }
    setOldPassword('');
    setFieldErrors({});
    setMessage(null);
    setShowPasswordSection(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#1A2335] rounded-2xl border border-[#2A3547] overflow-hidden"
        >
          <div className="relative h-40 bg-gradient-to-r from-[#3E60C1] to-[#5983FC]">
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-[#1A2335] overflow-hidden bg-[#0F172A] flex items-center justify-center">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUser size={36} className="text-[#5983FC]" />
                  )}
                </div>
              </div>
              <div className="mb-4 ml-4">
                <h2 className="text-xl font-bold text-white">{user?.username || 'User'}</h2>
                <p className="text-white/80 text-sm">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          <div className="mt-20 px-8">
            <div className="flex border-b border-[#2A3547]">
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-6 py-4 font-medium text-sm transition ${activeTab === 'personal' 
                  ? 'text-[#5983FC] border-b-2 border-[#5983FC]' 
                  : 'text-[#B8C7E0] hover:text-white'}`}
              >
                Personal Information
              </button>
              <button
                onClick={() => {
                  setActiveTab('security');
                  setShowPasswordSection(true);
                }}
                className={`px-6 py-4 font-medium text-sm transition ${activeTab === 'security' 
                  ? 'text-[#5983FC] border-b-2 border-[#5983FC]' 
                  : 'text-[#B8C7E0] hover:text-white'}`}
              >
                Security
              </button>
            </div>
          </div>

          <div className="px-8 pt-6">
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl flex items-start mb-6 ${
                    message.type === 'success' ? 'bg-green-500/10 text-green-500' :
                    message.type === 'error' ? 'bg-red-500/10 text-red-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}
                >
                  {message.type === 'success' ? (
                    <FiCheckCircle className="mr-3 mt-0.5 flex-shrink-0" />
                  ) : message.type === 'error' ? (
                    <FiAlertCircle className="mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <FiInfo className="mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-8 pt-2">
            <form onSubmit={handleSubmit}>
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-4">Update Your Profile</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#B8C7E0] text-sm mb-2">Username</label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                        <input
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${fieldErrors.username ? 'border-red-500' : 'border-[#2A3547]'} focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                          placeholder="Enter your username"
                        />
                      </div>
                      {fieldErrors.username && (
                        <p className="mt-1 text-sm text-red-500">{fieldErrors.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#B8C7E0] text-sm mb-2">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${fieldErrors.email ? 'border-red-500' : 'border-[#2A3547]'} focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {fieldErrors.email && (
                        <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-4">Update Your Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#B8C7E0] text-sm mb-2">Current Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                        <input
                          name="oldPassword"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${fieldErrors.oldPassword || fieldErrors.old_password ? 'border-red-500' : 'border-[#2A3547]'} focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                          placeholder="Enter your current password"
                        />
                      </div>
                      {(fieldErrors.oldPassword || fieldErrors.old_password) && (
                        <p className="mt-1 text-sm text-red-500">{fieldErrors.oldPassword || fieldErrors.old_password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#B8C7E0] text-sm mb-2">New Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                        <input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${fieldErrors.password ? 'border-red-500' : 'border-[#2A3547]'} focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                          placeholder="Enter your new password"
                        />
                      </div>
                      {fieldErrors.password && (
                        <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#B8C7E0] text-sm mb-2">Confirm New Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                        <input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${
                            passwordError ? 'border-red-500' : 'border-[#2A3547]'
                          } focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                          placeholder="Confirm your new password"
                        />
                      </div>
                      {passwordError && (
                        <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl bg-[#0F172A] text-[#B8C7E0] border border-[#2A3547] hover:bg-[#2A3547] transition"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center min-w-[120px] ${
                    successAnimation 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white'
                  } shadow-lg hover:shadow-[#5983FC]/30 transition-all`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Saving Changes...
                    </span>
                  ) : successAnimation ? (
                    <span className="flex items-center">
                      <FaCheckCircleIcon className="mr-2" /> Saved!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiSave className="mr-2" /> Save Changes
                    </span>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 