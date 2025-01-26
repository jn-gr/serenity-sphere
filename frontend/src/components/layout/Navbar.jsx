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
import signoutDark from '../../assets/signout_dark.svg'
import signoutWhite from '../../assets/signout_white.svg'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const { isDark } = useTheme()

  const handleSignOut = async () => {
    try {
      await api.post('/api/auth/logout/')
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
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
            <button onClick={handleSignOut} className="navbar-link">
              <img src={isDark ? signoutDark : signoutWhite} alt="Sign Out" style={{ height: '24px' }} />
            </button>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                <img src={isDark ? loginDark : loginWhite} alt="Login" style={{ height: '24px' }} />
              </Link>
              <Link to="/register" className="navbar-link">
                <img src={isDark ? registerDark : registerWhite} alt="Register" style={{ height: '24px' }} />
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