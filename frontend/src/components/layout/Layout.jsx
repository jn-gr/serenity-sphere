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
        className="min-h-screen transition-colors"
        animate={{
          marginLeft: isAuthenticated ? (isNavExpanded ? '16rem' : '5rem') : '0',
          width: isAuthenticated ? `calc(100% - ${isNavExpanded ? '16rem' : '5rem'})` : '100%'
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout; 