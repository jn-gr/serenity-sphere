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
    <nav className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Serenity Sphere
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link to="/" title="Home">
              <FaHome size={20} />
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/journal" title="Journal">
                  <FaBook size={20} />
                </Link>
              </li>
              <li>
                <Link to="/profile" title="Profile">
                  <FaUser size={20} />
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} aria-label="Logout">
                  <FaSignOutAlt size={20} />
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" title="Login">
                <FaSignInAlt size={20} />
              </Link>
            </li>
          )}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;