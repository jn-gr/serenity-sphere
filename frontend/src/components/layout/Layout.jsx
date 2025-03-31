import { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar onHoverChange={setIsNavExpanded} />
      <motion.main
        className="min-h-screen transition-all duration-200 ease-in-out"
        animate={{
          marginLeft: isAuthenticated ? (isNavExpanded ? '16rem' : '5rem') : '0',
          width: isAuthenticated ? (isNavExpanded ? 'calc(100% - 16rem)' : 'calc(100% - 5rem)') : '100%'
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout; 