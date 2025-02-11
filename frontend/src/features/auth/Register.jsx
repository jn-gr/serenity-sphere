import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setCredentials } from './authSlice'
import api from '../../services/api'
import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'

const Register = () => {
  const { isDark } = useTheme()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    <div className="min-h-screen bg-calm-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md rounded-3xl p-8 shadow-xl ${
          isDark ? 'bg-serenity-dark text-white' : 'bg-white'
        }`}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-calm-400">
            Or{' '}
            <Link 
              to="/login" 
              className="text-primary.DEFAULT hover:text-primary.dark transition-colors"
            >
              sign in to your account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  fieldErrors.email 
                    ? 'border-red-500' 
                    : isDark 
                    ? 'border-calm-400 bg-serenity-dark' 
                    : 'border-calm-200'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  fieldErrors.username 
                    ? 'border-red-500' 
                    : isDark 
                    ? 'border-calm-400 bg-serenity-dark' 
                    : 'border-calm-200'
                }`}
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  fieldErrors.password 
                    ? 'border-red-500' 
                    : isDark 
                    ? 'border-calm-400 bg-serenity-dark' 
                    : 'border-calm-200'
                }`}
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  fieldErrors.confirmPassword 
                    ? 'border-red-500' 
                    : isDark 
                    ? 'border-calm-400 bg-serenity-dark' 
                    : 'border-calm-200'
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary.DEFAULT hover:bg-primary.dark text-white py-3 rounded-full transition-colors"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default Register 