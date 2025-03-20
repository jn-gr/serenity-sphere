import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, dismissNotification } from './notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// A new component to handle the cause selection and recommendations
import MoodCausePrompt from '../../components/MoodCausePrompt';

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const { items = [] } = useSelector(state => state.notifications || { items: [] });
  const [activeNotification, setActiveNotification] = useState(null);
  const [showCausePrompt, setShowCausePrompt] = useState(false);
  
  useEffect(() => {
    dispatch(fetchNotifications());
    
    const intervalId = setInterval(() => {
      dispatch(fetchNotifications());
    }, 300000);
    
    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (items && items.length > 0 && !activeNotification) {
      setActiveNotification(items[0]);
    }
  }, [items, activeNotification]);
  
  const handleDismiss = (id) => {
    dispatch(dismissNotification(id));
    setActiveNotification(null);
    setShowCausePrompt(false);
  };
  
  const handleTellMore = (notification) => {
    setShowCausePrompt(true);
  };
  
  if (!activeNotification) {
    return null;
  }
  
  return (
    <>
      <AnimatePresence>
        {activeNotification && !showCausePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1A2335] border border-[#3E60C1] rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4"
            >
              <div className="flex items-start">
                <div className="bg-[#3E60C1]/20 p-3 rounded-lg mr-4 flex-shrink-0">
                  {activeNotification.severity === 'high' ? (
                    <FaExclamationTriangle className="text-amber-400 text-xl" />
                  ) : (
                    <FaInfoCircle className="text-blue-400 text-xl" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-medium text-xl mb-2">
                      {activeNotification.type === 'mood_shift' ? 'Mood Change Detected' : 
                       activeNotification.type === 'extended_sadness' ? 'Extended Sadness Detected' : 
                       'Notification'}
                    </h3>
                    <button 
                      onClick={() => handleDismiss(activeNotification.id)} 
                      className="text-[#B8C7E0] hover:text-white"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <p className="text-[#B8C7E0] mb-4">
                    {activeNotification.message}
                  </p>
                  
                  <div className="text-[#B8C7E0] text-sm mb-4">
                    {new Date(activeNotification.timestamp).toLocaleString()}
                  </div>
                  
                  <div className="border-t border-[#2A3547] my-4"></div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleDismiss(activeNotification.id)}
                      className="px-4 py-2 rounded-lg text-[#B8C7E0] hover:text-white transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleTellMore(activeNotification)}
                      className="px-4 py-2 rounded-lg bg-[#3E60C1] text-white hover:bg-[#5983FC] transition-colors"
                    >
                      Tell Us More
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showCausePrompt && activeNotification && (
        <MoodCausePrompt 
          notification={activeNotification}
          onClose={() => {
            setShowCausePrompt(false);
            handleDismiss(activeNotification.id);
          }}
        />
      )}
    </>
  );
};

export default NotificationCenter;