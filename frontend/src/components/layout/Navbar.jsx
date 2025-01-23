import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import ThemeToggle from './ThemeToggle'
import '../../styles/components/_navbar.css'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const handleSignOut = () => {
    // Remove token from localStorage
    localStorage.removeItem('token')
    // Dispatch logout action
    dispatch(logout())
    // Redirect to login page
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Serenity Sphere
        </Link>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <button onClick={handleSignOut} className="navbar-link">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar 