import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const HomeJournalCard = () => {
  const { isDark } = useTheme();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`flex flex-col ${
        isDark ? 'bg-serenity-dark text-white' : 'bg-white'
      } rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full`}
    >
      <div className="flex-1">
        <div className="text-primary.DEFAULT text-4xl mb-4">📖</div>
        <h3 className="text-xl font-semibold mb-3">Digital Journal</h3>
        <p className="text-calm-400 mb-4">
          Express your thoughts freely with our AI-powered journal that helps you 
          understand your emotional patterns.
        </p>
      </div>
      <Link
        to="/journal"
        className="inline-block text-center bg-primary.DEFAULT hover:bg-primary.dark text-white px-6 py-3 rounded-full transition-colors duration-300"
      >
        Start Writing
      </Link>
    </motion.div>
  );
}

export default HomeJournalCard;