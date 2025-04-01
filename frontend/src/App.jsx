import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from './store/store'
import api from './services/api'
import Layout from './components/layout/Layout'
import Home from './features/home/Home'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import ForgotPassword from './features/auth/ForgotPassword'
import JournalList from './features/journal/JournalList'
import MoodLog from './features/mood/MoodLog'
import { setCredentials, logout } from './features/auth/authSlice'
import { ThemeProvider } from './context/ThemeContext'
import Profile from './features/profile/Profile'
import ResetPassword from './features/auth/ResetPassword'

const AppContent = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  
  useEffect(() => {
    // Fetch CSRF token when app loads
    const fetchCSRFToken = async () => {
      try {
        await api.get('/api/csrf/')
      } catch (error) {
        console.error('Error fetching CSRF token:', error)
      }
    }
    fetchCSRFToken()

    // If user is authenticated (from localStorage), verify the session
    if (isAuthenticated) {
      const verifySession = async () => {
        try {
          const response = await api.get('/api/auth/user/')
          // Update the user data in case it changed
          dispatch(setCredentials({ user: response.data }))
        } catch (error) {
          console.error('Session verification failed:', error)
          // Only logout if the error is authentication-related (401 or 403)
          if (error.response && [401, 403].includes(error.response.status)) {
            dispatch(logout())
          }
        }
      }
      verifySession()
    }
  }, [dispatch, isAuthenticated])

  return (
    <Router>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />
            <Route path="/reset-password/:uidb64/:token" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/" />} />
            <Route path="/journal" element={isAuthenticated ? <JournalList /> : <Navigate to="/login" />} />
            <Route path="/mood" element={isAuthenticated ? <MoodLog /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            {/* Add more routes as needed */}
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
