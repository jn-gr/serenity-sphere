import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setCredentials } from './authSlice'
import api from '../../services/api'
import '../../styles/layouts/_auth.css'
import '../../styles/components/_forms.css'

const Register = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  
  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Check if user is already logged in
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  if (isAuthenticated) {
    navigate('/')
    return null
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    setError(null) // Clear general error
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!formData.username) {
      errors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    return errors
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const registrationData = {
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword
      }
      
      const response = await api.post('/api/auth/register/', registrationData)
      
      localStorage.setItem('token', response.data.token)
      dispatch(setCredentials(response.data))
      navigate('/')
      
    } catch (err) {
      if (err.response?.data) {
        // Handle specific field errors
        const serverErrors = err.response.data
        const fieldErrors = {}
        
        // Map server errors to fields
        Object.keys(serverErrors).forEach(key => {
          if (Array.isArray(serverErrors[key])) {
            fieldErrors[key] = serverErrors[key][0]
          } else {
            fieldErrors[key] = serverErrors[key]
          }
        })
        
        setFieldErrors(fieldErrors)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Or{' '}
          <Link to="/login" className="auth-link">
            sign in to your account
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">{error}</div>
          )}

          <div className="auth-form-group">
            <div className="auth-input-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${fieldErrors.email ? 'form-input-error' : ''}`}
              />
              {fieldErrors.email && (
                <p className="form-error-text">{fieldErrors.email}</p>
              )}
            </div>

            <div className="auth-input-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${fieldErrors.username ? 'form-input-error' : ''}`}
              />
              {fieldErrors.username && (
                <p className="form-error-text">{fieldErrors.username}</p>
              )}
            </div>

            <div className="auth-input-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${fieldErrors.password ? 'form-input-error' : ''}`}
              />
              {fieldErrors.password && (
                <p className="form-error-text">{fieldErrors.password}</p>
              )}
            </div>

            <div className="auth-input-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${fieldErrors.confirmPassword ? 'form-input-error' : ''}`}
              />
              {fieldErrors.confirmPassword && (
                <p className="form-error-text">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="form-button"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register 