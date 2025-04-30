import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const mainPaddingClasses = isAuthenticated 
    ? "pb-16 md:pb-0 md:pl-[4.5rem]" 
    : "pt-16 md:pt-20";

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar />
      <motion.main
        className={`min-h-screen w-full ${mainPaddingClasses}`}
        // Remove animation props related to old sidebar hover state
        // animate={{}}
        // transition={{}}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout; 