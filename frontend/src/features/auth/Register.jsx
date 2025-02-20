import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setCredentials } from './authSlice'
import api from '../../services/api'
import { motion } from 'framer-motion'
import { FiMail, FiUser, FiLock } from 'react-icons/fi'
import RegisterImage from '../../assets/images/RegisterImage.jpg'

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
    <div className="min-h-screen bg-[#0F172A] pt-20 p-8">
      <br />
      <br />
      <br />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-[#1A2335] rounded-2xl border border-[#2A3547] p-12"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Your Account
          </h1>
          <p className="text-[#B8C7E0]">Start your mental wellness journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 border-[#2A3547] focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568]"
                placeholder="Email address"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-2 ml-1">{fieldErrors.email}</p>
              )}
            </div>

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
              {fieldErrors.username && (
                <p className="text-red-500 text-sm mt-2 ml-1">{fieldErrors.username}</p>
              )}
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 border-[#2A3547] focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568]"
                placeholder="Password"
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-2 ml-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 border-[#2A3547] focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568]"
                placeholder="Confirm Password"
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2 ml-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-[#5983FC]/30 transition-all"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </motion.button>

          <div className="text-center mt-6">
            <p className="text-[#B8C7E0]">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#5983FC] font-semibold hover:text-[#3E60C1] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Register 