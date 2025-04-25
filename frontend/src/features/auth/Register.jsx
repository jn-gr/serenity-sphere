import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setCredentials } from './authSlice'
import api from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiUser, FiLock, FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'
import TermsOfService from '../../components/legal/TermsOfService'
import PrivacyPolicy from '../../components/legal/PrivacyPolicy'

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
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false
  })
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: ''
  })

  useEffect(() => {
    if (formData.password) {
      // Check password strength
      let score = 0
      let message = ''
      let color = ''

      // Length check
      if (formData.password.length >= 8) score += 1
      
      // Complexity checks
      if (/[A-Z]/.test(formData.password)) score += 1
      if (/[0-9]/.test(formData.password)) score += 1
      if (/[^A-Za-z0-9]/.test(formData.password)) score += 1

      // Set appropriate message based on score
      if (score === 0) {
        message = 'Very weak'
        color = 'red-500'
      } else if (score === 1) {
        message = 'Weak'
        color = 'red-400'
      } else if (score === 2) {
        message = 'Fair'
        color = 'yellow-500'
      } else if (score === 3) {
        message = 'Good'
        color = 'green-400'
      } else {
        message = 'Strong'
        color = 'green-500'
      }

      setPasswordStrength({ score, message, color })
    } else {
      setPasswordStrength({ score: 0, message: '', color: '' })
    }
  }, [formData.password])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
    setError(null)
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  // Validate form fields
  const validateField = (name, value) => {
    if (!touched[name]) return ''
    
    switch (name) {
      case 'email':
        if (!value) return 'Email is required'
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address'
        return ''
      case 'username':
        if (!value) return 'Username is required'
        if (value.length < 3) return 'Username must be at least 3 characters'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters'
        return ''
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
        return ''
      default:
        return ''
    }
  }

  // Check each field validation
  const emailError = validateField('email', formData.email)
  const usernameError = validateField('username', formData.username)
  const passwordError = validateField('password', formData.password)
  const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword)

  // Check if passwords match
  const passwordsMatch = formData.password && formData.confirmPassword && 
    formData.password === formData.confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields before submission
    const touchedAll = {
      email: true,
      username: true,
      password: true,
      confirmPassword: true
    }
    setTouched(touchedAll)
    
    const errors = {
      email: validateField('email', formData.email),
      username: validateField('username', formData.username),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    }
    
    // Check if there are any validation errors
    if (Object.values(errors).some(error => error)) {
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
        // Format backend errors for better display
        const backendErrors = {}
        Object.entries(err.response.data).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value) ? value[0] : value
        })
        setFieldErrors(backendErrors)
        
        // Set a general error message for the form
        if (backendErrors.detail) {
          setError(backendErrors.detail)
        } else {
          setError('Please correct the errors below.')
        }
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
            <br />
            Join Serenity Sphere
          </motion.h1>
          <p className="text-[#B8C7E0] mt-3">Create your account and start your wellness journey</p>
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
                  <label htmlFor="email" className="block text-[#B8C7E0] text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
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

                <div>
                  <label htmlFor="username" className="block text-[#B8C7E0] text-sm font-medium mb-2">Username</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${
                        usernameError || fieldErrors.username ? 'border-red-500' : 'border-[#2A3547]'
                      } focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                      placeholder="Choose a username"
                      autoComplete="username"
                    />
                  </div>
                  <AnimatePresence>
                    {(usernameError || fieldErrors.username) && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-sm mt-2 ml-1 flex items-center"
                      >
                        <FiAlertCircle className="mr-1" size={12} />
                        {usernameError || fieldErrors.username}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="password" className="block text-[#B8C7E0] text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${
                        passwordError || fieldErrors.password ? 'border-red-500' : touched.password && passwordStrength.score > 1 ? `border-${passwordStrength.color}` : 'border-[#2A3547]'
                      } focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                      placeholder="Create a password"
                      autoComplete="new-password"
                    />
                  </div>
                  <AnimatePresence>
                    {(passwordError || fieldErrors.password) ? (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-sm mt-2 ml-1 flex items-center"
                      >
                        <FiAlertCircle className="mr-1" size={12} />
                        {passwordError || fieldErrors.password}
                      </motion.p>
                    ) : formData.password && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-2"
                      >
                        <div className="flex items-center mb-1">
                          <div className="w-full h-1 bg-[#2A3547] rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-${passwordStrength.color}`} 
                              style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`ml-2 text-xs text-${passwordStrength.color}`}>
                            {passwordStrength.message}
                          </span>
                        </div>
                        <ul className="text-xs text-[#B8C7E0] space-y-1 ml-1">
                          <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-400' : 'text-[#64748B]'}`}>
                            {formData.password.length >= 8 ? <FiCheckCircle size={10} className="mr-1" /> : <FiInfo size={10} className="mr-1" />}
                            At least 8 characters
                          </li>
                          <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-[#64748B]'}`}>
                            {/[A-Z]/.test(formData.password) ? <FiCheckCircle size={10} className="mr-1" /> : <FiInfo size={10} className="mr-1" />}
                            Contains uppercase letters
                          </li>
                          <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-400' : 'text-[#64748B]'}`}>
                            {/[0-9]/.test(formData.password) ? <FiCheckCircle size={10} className="mr-1" /> : <FiInfo size={10} className="mr-1" />}
                            Contains numbers
                          </li>
                          <li className={`flex items-center ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-400' : 'text-[#64748B]'}`}>
                            {/[^A-Za-z0-9]/.test(formData.password) ? <FiCheckCircle size={10} className="mr-1" /> : <FiInfo size={10} className="mr-1" />}
                            Contains special characters
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-[#B8C7E0] text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5983FC]" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-11 pr-4 py-4 bg-[#0F172A] rounded-xl border-2 ${
                        confirmPasswordError || fieldErrors.confirmPassword 
                          ? 'border-red-500' 
                          : touched.confirmPassword && passwordsMatch 
                            ? 'border-green-500' 
                            : 'border-[#2A3547]'
                      } focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] transition`}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                    />
                    {touched.confirmPassword && passwordsMatch && (
                      <FiCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  <AnimatePresence>
                    {(confirmPasswordError || fieldErrors.confirmPassword) && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-sm mt-2 ml-1 flex items-center"
                      >
                        <FiAlertCircle className="mr-1" size={12} />
                        {confirmPasswordError || fieldErrors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sign up button with loading state */}
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
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              </div>

              {/* Divider */}
              <div className="flex items-center pt-2">
                <div className="flex-grow h-px bg-[#2A3547]"></div>
                <span className="mx-4 text-sm text-[#64748B]">OR</span>
                <div className="flex-grow h-px bg-[#2A3547]"></div>
              </div>

              <div className="text-center">
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
          </div>
        </motion.div>
        
        {/* Footer text */}
        <p className="text-center mt-8 text-[#64748B] text-sm">
          By creating an account, you agree to our <TermsOfService /> and <PrivacyPolicy />.
        </p>
      </motion.div>
    </div>
  )
}

export default Register 