import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import '../../styles/components/_navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Serenity Sphere
        </Link>
        <div className="navbar-links">
          <Link to="/login" className="navbar-link">Login</Link>
          <Link to="/register" className="navbar-link">Register</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar 