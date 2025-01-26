import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setCredentials } from './authSlice'
import api from '../../services/api'
import '../../styles/layouts/_auth.css'
import '../../styles/components/_forms.css'

const Login = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
    setError(null) // Clear general error
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.post('/api/auth/login/', formData)
      dispatch(setCredentials(response.data))
      navigate('/')
    } catch (err) {
      if (err.response?.data) {
        setFieldErrors(err.response.data)
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Sign in to your account</h2>
        <p className="auth-subtitle">
          Or{' '}
          <Link to="/register" className="auth-link">
            create a new account
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
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${fieldErrors.password ? 'form-input-error' : ''}`}
              />
              {fieldErrors.password && (
                <p className="form-error-text">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="form-button"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
