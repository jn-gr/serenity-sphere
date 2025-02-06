import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from './store/store'
import api from './services/api'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './features/home/Home'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import JournalList from './features/journal/JournalList'
import JournalForm from './features/journal/JournalForm'
import { setCredentials } from './features/auth/authSlice'
import { ThemeProvider } from './context/ThemeContext'
import Profile from './features/profile/Profile'

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

    // Optionally, fetch user data to maintain authentication state
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/user/')
        dispatch(setCredentials({ user: response.data, isAuthenticated: true }))
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [dispatch])

  return (
    <Router>
      <ThemeProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
              <Route path="/journal" element={isAuthenticated ? <JournalList /> : <Navigate to="/login" />} />
              <Route path="/journal/new" element={isAuthenticated ? <JournalForm /> : <Navigate to="/login" />} />
              <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
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
