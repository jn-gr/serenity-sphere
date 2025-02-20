import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../auth/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
  const { isDark } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [oldPassword, setOldPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the current profile if not in the redux store
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
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage('Failed to fetch profile. Please try again later.');
      }
    };

    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: ''
      });
    } else {
      fetchProfile();
    }
  }, [user, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Validate new password fields if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      setIsLoading(false);
      return;
    }
    try {
      // Prepare data for submission; omit password if not changed
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        old_password: oldPassword
      };
      if (formData.password) {
        dataToSend.password = formData.password;
      }
      const response = await api.put('/api/user-profile/', dataToSend);
      setMessage('Profile updated successfully');
      dispatch(setCredentials({ user: response.data, isAuthenticated: true }));
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      if (err.response && err.response.data) {
        setFieldErrors(err.response.data);
      } else {
        setMessage('Failed to update profile. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-8">
          <h2 className="text-2xl font-bold text-white mb-8">Profile Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl text-sm">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 border-[#2A3547] focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568]"
                  placeholder="Username"
                />
              </div>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 border-[#2A3547] focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568]"
                  placeholder="Email"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                <input
                  name="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 border-[#2A3547] focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568]"
                  placeholder="Old Password"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 border-[#2A3547] focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568]"
                  placeholder="New Password"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 border-[#2A3547] focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568]"
                  placeholder="Confirm New Password"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-[#5983FC]/30 transition-all"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 