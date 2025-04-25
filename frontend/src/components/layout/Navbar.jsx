// frontend/src/components/layout/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, resetState } from '../../features/auth/authSlice';
import { motion } from 'framer-motion';
import { 
  FaSignOutAlt, 
  FaBook, 
  FaHome, 
  FaUser, 
  FaChartLine, 
  FaBars,
  FaTimes
} from 'react-icons/fa';
import api from '../../services/api';

// Sidebar NavLink (for large screens)
const SidebarNavLink = ({ to, icon: Icon, children }) => (
  <Link
    to={to}
    className="w-full flex items-center justify-center relative rounded-xl text-[#B8C7E0] hover:bg-[#2A3547] hover:text-white transition-all duration-200 h-11 group-hover:justify-start group-hover:px-3"
  >
    <Icon size={20} className="flex-shrink-0 transition-all duration-200" />
    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pl-3">
      {children}
    </span>
  </Link>
);

// Bottom Navbar NavLink (for small screens)
const BottomNavLink = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center flex-1 p-2 rounded-md ${isActive ? 'text-[#5983FC]' : 'text-[#B8C7E0]'} hover:bg-[#2A3547]/50 transition-colors duration-200`}
  >
    <Icon size={20} className="mb-1" />
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-[#1A2335]/80 backdrop-blur-md border-b border-[#2A3547] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#5983FC] to-[#3E60C1] bg-clip-text text-transparent">
            Serenity Sphere
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/login"
              className="px-3 sm:px-5 py-2 rounded-lg text-sm sm:text-base text-[#B8C7E0] hover:bg-[#2A3547] transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-3 sm:px-5 py-2 rounded-lg text-sm sm:text-base bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white hover:shadow-md hover:shadow-[#5983FC]/20 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Sidebar - Hidden on small screens (md:block) */}
      <motion.nav 
        className="fixed left-0 top-0 h-screen bg-[#1A2335] border-r border-[#2A3547] flex-col py-6 group z-50 hidden md:flex"
        initial={{ width: '4.5rem' }}
        whileHover={{ width: '14rem' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {/* Logo */}
        <div className="mb-8 px-3 flex items-center h-[30px] overflow-hidden">
          <span className="text-3xl font-bold text-[#5983FC]">S</span>
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[#5983FC] to-[#3E60C1] bg-clip-text text-transparent whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
             erenity Sphere
          </span>
        </div>

        <ul className="space-y-1 flex-1 px-3">
          <li>
            <SidebarNavLink to="/" icon={FaHome}>Dashboard</SidebarNavLink>
          </li>
          <li>
            <SidebarNavLink to="/journal" icon={FaBook}>Journal</SidebarNavLink>
          </li>
          <li>
            <SidebarNavLink to="/mood" icon={FaChartLine}>Mood Trends</SidebarNavLink>
          </li>
          <li>
            <SidebarNavLink to="/profile" icon={FaUser}>Profile</SidebarNavLink>
          </li>
        </ul>

        <div className="pt-4 border-t border-[#2A3547] px-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center relative rounded-xl text-[#B8C7E0] hover:bg-[#2A3547] hover:text-white transition-all duration-200 h-11 group-hover:justify-start group-hover:px-3"
          >
            <FaSignOutAlt size={20} className="flex-shrink-0 transition-all duration-200" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pl-3">
              Log Out
            </span>
          </button>
        </div>
      </motion.nav>

      {/* Bottom Navbar - Hidden on medium screens and up (md:hidden) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#1A2335]/90 backdrop-blur-md border-t border-[#2A3547] z-50 flex md:hidden px-2">
        <BottomNavLink 
          to="/" 
          icon={FaHome} 
          label="Dashboard" 
          isActive={location.pathname === '/'}
        />
        <BottomNavLink 
          to="/journal" 
          icon={FaBook} 
          label="Journal" 
          isActive={location.pathname.startsWith('/journal')}
        />
        <BottomNavLink 
          to="/mood" 
          icon={FaChartLine} 
          label="Moods" 
          isActive={location.pathname.startsWith('/mood')}
        />
        <BottomNavLink 
          to="/profile" 
          icon={FaUser} 
          label="Profile" 
          isActive={location.pathname.startsWith('/profile')}
        />
        <button 
          onClick={handleLogout} 
          className="flex flex-col items-center justify-center flex-1 p-2 rounded-md text-[#B8C7E0] hover:bg-[#2A3547]/50 transition-colors duration-200"
          aria-label="Log Out"
        >
           <FaSignOutAlt size={20} className="mb-1" />
           <span className="text-xs font-medium">Log Out</span>
        </button>
      </nav>
    </>
  );
};

export default Navbar;