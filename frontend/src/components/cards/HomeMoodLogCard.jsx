import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomeMoodLogCard = () => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="flex flex-col bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
    >
      <div className="flex-1">
        <div className="text-secondary.DEFAULT text-4xl mb-4">😌</div>
        <h3 className="text-xl font-semibold mb-3">Mood Tracker</h3>
        <p className="text-calm-400 mb-4">
          Track your daily emotions and visualize your mental health journey through interactive charts.
        </p>
      </div>
      <Link
        to="/mood-log"
        className="inline-block text-center bg-secondary.DEFAULT hover:bg-secondary.dark text-white px-6 py-3 rounded-full transition-colors duration-300"
      >
        Track Mood
      </Link>
    </motion.div>
  );
};

export default HomeMoodLogCard;