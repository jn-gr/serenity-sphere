import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setCredentials } from './authSlice'
import api from '../../services/api'
import '../../styles/layouts/_auth.css'
import '../../styles/components/_forms.css'
import { FaUserPlus } from 'react-icons/fa'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
    setError(null)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.email) errors.email = 'Email is required'
    if (!formData.username) errors.username = 'Username is required'
    if (!formData.password) errors.password = 'Password is required'
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.post('/api/auth/register/', {
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword
      })
      
      dispatch(setCredentials(response.data))
      navigate('/')
    } catch (err) {
      if (err.response?.data) {
        setFieldErrors(err.response.data)
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
        <h2 className="auth-title">
          <FaUserPlus size={24} style={{ marginRight: '8px' }} />
          Create your account
        </h2>
        <p className="auth-subtitle">
          Or <Link to="/login" className="auth-link">sign in to your account</Link>
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-form-group">
            <div className="auth-input-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${fieldErrors.email ? 'form-input-error' : ''}`}
              />
              {fieldErrors.email && <p className="form-error-text">{fieldErrors.email}</p>}
            </div>

            <div className="auth-input-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${fieldErrors.username ? 'form-input-error' : ''}`}
              />
              {fieldErrors.username && <p className="form-error-text">{fieldErrors.username}</p>}
            </div>

            <div className="auth-input-group">
              <label htmlFor="password" className="form-label">Password</label>
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
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${fieldErrors.confirmPassword ? 'form-input-error' : ''}`}
              />
              {fieldErrors.confirmPassword && (
                <p className="form-error-text">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="form-button">
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register 