// frontend/src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import ThemeToggle from './ThemeToggle';
import '../../styles/components/_navbar.css';
import api from '../../services/api';
import { FaSignOutAlt, FaBook, FaSignInAlt, FaHome, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-serenity-dark"
            >
              Serenity Sphere
            </motion.span>
          </Link>
          <div className="flex items-center space-x-6">
            
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/" className="hover:text-primary.DEFAULT transition-colors text-calm-400">
                  <FaHome size={20} />
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/journal" className="hover:text-primary.DEFAULT transition-colors text-calm-400">
                      <FaBook size={20} />
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-primary.DEFAULT transition-colors text-calm-400">
                      <FaUser size={20} />
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="hover:text-primary.DEFAULT transition-colors text-calm-400"
                    >
                      <FaSignOutAlt size={20} />
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="hover:text-primary.DEFAULT transition-colors text-calm-400">
                    <FaSignInAlt size={20} />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;