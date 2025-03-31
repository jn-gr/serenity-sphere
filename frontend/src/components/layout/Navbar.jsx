// frontend/src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, resetState } from '../../features/auth/authSlice';
import { motion } from 'framer-motion';
import { 
  FaSignOutAlt, 
  FaBook, 
  FaHome, 
  FaUser, 
  FaChartLine, 
  FaRegSmile 
} from 'react-icons/fa';
import api from '../../services/api';

const NavLink = ({ to, icon: Icon, children }) => (
  <Link
    to={to}
    className="flex items-center justify-center relative rounded-xl text-[#B8C7E0] hover:bg-[#2A3547] hover:text-white transition-all duration-200 h-11"
  >
    <Icon size={20} className="flex-shrink-0 absolute left-1/2 -translate-x-1/2 group-hover:left-3 group-hover:translate-x-0 transition-all duration-200" />
    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pl-10">
      {children}
    </span>
  </Link>
);

const Navbar = ({ onHoverChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/');
      dispatch(resetState());
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  // Public navbar for unauthenticated users
  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-[#1A2335] border-b border-[#2A3547] z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#5983FC] to-[#3E60C1] bg-clip-text text-transparent">
            Serenity Sphere
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl text-[#B8C7E0] hover:bg-[#2A3547] transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white hover:shadow-lg hover:shadow-[#5983FC]/20 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Sidebar navigation for authenticated users
  return (
    <motion.nav 
      className="fixed left-0 top-0 h-screen bg-[#1A2335] border-r border-[#2A3547] flex flex-col py-6 group z-50"
      initial={{ width: '4rem' }}
      whileHover={{ width: '16rem' }}
      onHoverStart={() => onHoverChange?.(true)}
      onHoverEnd={() => onHoverChange?.(false)}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="mb-8 px-3">
        <motion.span 
          className="text-2xl font-bold bg-gradient-to-r from-[#5983FC] to-[#3E60C1] bg-clip-text text-transparent whitespace-nowrap overflow-hidden"
        >
          <span className="inline-block group-hover:opacity-100 opacity-0 transition-opacity duration-200">
            Serenity Sphere
          </span>
        </motion.span>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-1 flex-1 px-2">
        <li>
          <NavLink to="/" icon={FaHome}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/journal" icon={FaBook}>Journal</NavLink>
        </li>
        <li>
          <NavLink to="/mood" icon={FaChartLine}>Mood Trends</NavLink>
        </li>
        <li>
          <NavLink to="/profile" icon={FaUser}>Profile</NavLink>
        </li>
      </ul>

      {/* Logout Button */}
      <div className="pt-4 border-t border-[#2A3547] px-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center relative rounded-xl text-[#B8C7E0] hover:bg-[#2A3547] hover:text-white transition-all duration-200 h-11"
        >
          <FaSignOutAlt size={20} className="flex-shrink-0 absolute left-1/2 -translate-x-1/2 group-hover:left-3 group-hover:translate-x-0 transition-all duration-200" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pl-10">
            Log Out
          </span>
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;