import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaLightbulb } from 'react-icons/fa';

const PositiveReinforcement = ({ notification, onClose }) => {
  const positiveMessages = {
    happy: "Keep spreading that joy! 😊",
    excited: "Your enthusiasm is contagious! 🚀",
    optimistic: "Your positive outlook is inspiring! 🌟",
    calm: "Your inner peace is admirable! 🧘♂️"
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#1A2335] rounded-xl p-6 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Amazing Consistency!
        </h3>
        <p className="text-[#B8C7E0] mb-4">
          {positiveMessages[notification.mood] || "Your positive mood trend is impressive!"}
        </p>
        <button
          onClick={onClose}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-lg transition-colors"
        >
          Continue Journey
        </button>
      </div>
    </div>
  );
};

export default PositiveReinforcement; 