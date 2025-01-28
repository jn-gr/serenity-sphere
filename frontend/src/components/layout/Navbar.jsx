import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import ThemeToggle from './ThemeToggle'
import '../../styles/components/_navbar.css'
import api from '../../services/api'
import homeDark from '../../assets/home_dark.svg'
import homeWhite from '../../assets/home_white.svg'
import loginDark from '../../assets/login_dark.svg'
import loginWhite from '../../assets/login_white.svg'
import registerDark from '../../assets/register_dark.svg'
import registerWhite from '../../assets/register_white.svg'

import { useTheme } from '../../context/ThemeContext'
import { FaSignOutAlt, FaBook, FaSignInAlt, FaUserPlus } from 'react-icons/fa'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user)
  const { isDark } = useTheme()

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/')
      dispatch(logout())
      navigate('/login')
    } catch (err) {
      console.error('Failed to logout:', err)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Serenity Sphere
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            <img src={isDark ? homeDark : homeWhite} alt="Home" style={{ height: '24px' }} />
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/journal" className="navbar-link" title="Journal">
                <FaBook size={20} />
              </Link>
              <span className="navbar-user">Hello, {user.username}</span>
              <button onClick={handleLogout} className="navbar-icon-button" aria-label="Logout">
                <FaSignOutAlt size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link" title="Login">
                <FaSignInAlt size={20} />
              </Link>
              <Link to="/register" className="navbar-link" title="Register">
                <FaUserPlus size={20} />
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar 