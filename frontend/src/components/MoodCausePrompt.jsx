import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaTimes, FaLightbulb } from 'react-icons/fa';

const MoodCausePrompt = ({ notification, onClose }) => {
  const [selectedCause, setSelectedCause] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine if this is a positive or negative change
  const isPositiveChange = notification?.message?.includes('happy') || 
                           notification?.message?.includes('joy') || 
                           notification?.message?.includes('optimistic');
  
  // Define cause options based on notification type and direction
  const getCauseOptions = () => {
    if (isPositiveChange) {
      return [
        { id: 'achievement', label: 'Personal achievement or success' },
        { id: 'connection', label: 'Quality time with loved ones' },
        { id: 'self_care', label: 'Self-care activities' },
        { id: 'health', label: 'Health improvement' },
        { id: 'gratitude', label: 'Practicing gratitude' },
        { id: 'new_opportunity', label: 'New opportunity or change' },
        { id: 'creative', label: 'Creative expression' },
        { id: 'other_positive', label: 'Something else positive' }
      ];
    } else {
      return [
        { id: 'loss', label: 'Loss of a loved one' },
        { id: 'stress', label: 'Stress or feeling overwhelmed' },
        { id: 'relationship', label: 'Relationship difficulties' },
        { id: 'work', label: 'Work or academic challenges' },
        { id: 'health', label: 'Health concerns' },
        { id: 'loneliness', label: 'Feeling lonely or isolated' },
        { id: 'financial', label: 'Financial difficulties' },
        { id: 'other_negative', label: 'Something else challenging' }
      ];
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedCause) return;
    
    setIsLoading(true);
    try {
      console.log("Submitting cause:", selectedCause);
      
      // Call your backend API for recommendations
      const response = await axios.post('/api/mood/cause/', {
        notificationId: notification.id,
        cause: selectedCause,
        notificationType: notification.type
      });
      
      console.log("Recommendations response:", response.data);
      
      // Get recommendations from response
      setRecommendations(response.data.recommendations || []);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Provide fallback recommendations in case of error
      setRecommendations([
        {
          title: "Self-Care Activity",
          description: "Take some time for yourself today with a simple self-care activity.",
          link: "/exercises/self-care"
        }
      ]);
      setShowRecommendations(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1A2335] border border-[#3E60C1] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {showRecommendations ? 'Recommendations' : 'What might be causing this?'}
          </h3>
          <button onClick={onClose} className="text-[#B8C7E0] hover:text-white">
            <FaTimes />
          </button>
        </div>
        
        {!showRecommendations ? (
          <>
            <p className="text-[#B8C7E0] mb-4">
              {isPositiveChange
                ? "That's wonderful! Understanding what improves your mood can help maintain positive emotions."
                : "Understanding what affects your mood can help us provide better support."}
            </p>
            
            <div className="space-y-3 mb-6">
              {getCauseOptions().map(option => (
                <div 
                  key={option.id}
                  onClick={() => setSelectedCause(option.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCause === option.id
                      ? 'bg-[#3E60C1]/20 border-[#5983FC] text-white'
                      : 'bg-[#0F172A] border-[#2A3547] text-[#B8C7E0] hover:border-[#3E60C1]'
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-[#B8C7E0] hover:text-white transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedCause || isLoading}
                className={`px-4 py-2 rounded-lg ${
                  selectedCause && !isLoading
                    ? 'bg-[#3E60C1] text-white hover:bg-[#5983FC]'
                    : 'bg-[#2A3547] text-[#B8C7E0] cursor-not-allowed'
                } transition-colors`}
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[#B8C7E0] mb-4">
              {isPositiveChange
                ? "Here are some ideas to help maintain your positive mood:"
                : "Based on your input, here are some suggestions that might help:"}
            </p>
            
            <div className="space-y-4 mb-6">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547]">
                    <div className="flex items-start">
                      <FaLightbulb className="text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium mb-2">{rec.title}</h4>
                        <p className="text-[#B8C7E0] text-sm">{rec.description}</p>
                        {rec.link && (
                          <a 
                            href={rec.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#5983FC] hover:text-[#3E60C1] text-sm mt-2 inline-block"
                          >
                            Learn more →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-[#B8C7E0]">No specific recommendations found. Try a different category.</p>
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2 rounded-lg bg-[#3E60C1] text-white hover:bg-[#5983FC] transition-colors"
            >
              Close
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MoodCausePrompt; 