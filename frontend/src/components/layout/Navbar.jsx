// frontend/src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, resetState } from '../../features/auth/authSlice';
import ThemeToggle from './ThemeToggle';
import '../../styles/components/_navbar.css';
import api from '../../services/api';
import { FaSignOutAlt, FaBook, FaSignInAlt, FaHome, FaUser, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
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

  // Don't render the sidebar at all for unauthenticated users
  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-[#1A2335] border-b border-[#2A3547] z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#5983FC] to-[#3E60C1] bg-clip-text text-transparent">
            Serenity Sphere
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 rounded-lg text-[#B8C7E0] hover:bg-[#2A3547] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 rounded-lg bg-[#3E60C1] text-white hover:bg-[#5983FC] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Render sidebar for authenticated users
  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-[#1A2335] border-r border-[#2A3547] flex flex-col p-6">
      <div className="mb-10">
        <span className="text-2xl font-bold bg-gradient-to-r from-[#5983FC] to-[#3E60C1] bg-clip-text text-transparent">
          Serenity Sphere
        </span>
      </div>

      <ul className="space-y-4 flex-1">
        <li>
          <Link
            to="/"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2A3547] transition-colors text-[#B8C7E0]"
          >
            <FaHome size={20} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/journal"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2A3547] transition-colors text-[#B8C7E0]"
          >
            <FaBook size={20} />
            <span>Journal</span>
          </Link>
        </li>
        <li>
          <Link
            to="/mood"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2A3547] transition-colors text-[#B8C7E0]"
          >
            <FaChartLine size={20} />
            <span>Mood Trends</span>
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2A3547] transition-colors text-[#B8C7E0]"
          >
            <FaUser size={20} />
            <span>Profile</span>
          </Link>
        </li>
      </ul>

      <div className="border-t border-[#2A3547] pt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-[#2A3547] text-[#B8C7E0]"
        >
          <FaSignOutAlt size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;