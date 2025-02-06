import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../auth/authSlice';
import { useTheme } from '../../context/ThemeContext';

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
    <div className="auth-container">
      <div className={`auth-box ${isDark ? 'bg-theme-color-dark-card' : 'bg-theme-color-card'}`}>
        <h2 className="auth-title">Your Profile</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {message && <div className="auth-error">{message}</div>}
          <div className="auth-form-group">
            <div className="auth-input-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${fieldErrors.username ? 'form-input-error' : ''}`}
                required
              />
              {fieldErrors.username && <p className="form-error-text">{fieldErrors.username}</p>}
            </div>
            <div className="auth-input-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${fieldErrors.email ? 'form-input-error' : ''}`}
                required
              />
              {fieldErrors.email && <p className="form-error-text">{fieldErrors.email}</p>}
            </div>
            <div className="auth-input-group">
              <label htmlFor="oldPassword" className="form-label">Old Password</label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={`form-input ${fieldErrors.oldPassword ? 'form-input-error' : ''}`}
              />
              {fieldErrors.oldPassword && <p className="form-error-text">{fieldErrors.oldPassword}</p>}
            </div>
            <div className="auth-input-group">
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${fieldErrors.password ? 'form-input-error' : ''}`}
              />
              {fieldErrors.password && <p className="form-error-text">{fieldErrors.password}</p>}
            </div>
            <div className="auth-input-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${fieldErrors.confirmPassword ? 'form-input-error' : ''}`}
              />
              {fieldErrors.confirmPassword && <p className="form-error-text">{fieldErrors.confirmPassword}</p>}
            </div>
            <button type="submit" disabled={isLoading} className="form-button">
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 