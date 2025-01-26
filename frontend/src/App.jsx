import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import api from './services/api'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './features/home/Home'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import { ThemeProvider } from './context/ThemeContext'

function App() {
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
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </Router>
    </Provider>
  )
}

export default App
