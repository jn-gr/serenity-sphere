// frontend/src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import ThemeToggle from './ThemeToggle';
import '../../styles/components/_navbar.css';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { FaSignOutAlt, FaBook, FaSignInAlt, FaHome, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const { isDark } = useTheme();

  console.log('Is Authenticated:', isAuthenticated);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/');
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  

  return (
    <nav >
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Serenity Sphere
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link" title='Home'>
            <FaHome size={20} />
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/journal" className="navbar-link" title="Journal">
                <FaBook size={20} />
              </Link>
              <Link to="/profile" className="navbar-link" title="Profile">
                <FaUser size={20} />
              </Link>
              <button onClick={handleLogout} className="navbar-icon-button" aria-label="Logout">
                <FaSignOutAlt size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link" title="Login">
                <FaSignInAlt size={20} />
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;