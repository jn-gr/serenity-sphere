import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaLightbulb } from 'react-icons/fa';

const PositiveReinforcement = ({ notification, dominantEmotion, onClose }) => {
  // Emotion categories reference
  const emotionCategories = {
    veryPositive: ['happy', 'excited', 'loving', 'optimistic', 'proud', 'grateful', 'relieved', 'amused'],
    positive: ['calm', 'caring', 'surprised', 'curious'],
    neutral: ['neutral', 'confused'],
    negative: ['anxious', 'nervous', 'embarrassed', 'disappointed', 'annoyed', 'disapproving', 'sad'],
    veryNegative: ['angry', 'grieving', 'disgusted', 'remorseful']
  };
  
  // Get personalized message based on emotion
  const getPositiveReinforcementMessage = () => {
    // Base messages for different positive emotions
    const emotionMessages = {
      'happy': [
        "You're maintaining a happy mood - that's wonderful! Keep engaging in activities that bring you joy.",
        "Your consistent happiness is something to celebrate. What positive habits have been working for you?"
      ],
      'excited': [
        "Your excitement continues to shine through! Channeling that energy into meaningful activities can be rewarding.",
        "Maintaining your excitement is wonderful. What are you looking forward to?"
      ],
      'grateful': [
        "Your grateful mindset is serving you well. Continuing to practice gratitude strengthens positive emotions.",
        "You've been feeling grateful consistently - this attitude is linked to greater well-being!"
      ],
      'calm': [
        "Your calm state of mind is valuable. Continue nurturing this peaceful mindset.",
        "Maintaining a sense of calm is a significant achievement in today's busy world."
      ],
      'optimistic': [
        "Your optimistic outlook continues to serve you well. This perspective helps build resilience.",
        "Staying optimistic is a powerful way to navigate life's challenges. Well done!"
      ],
      'proud': [
        "You continue to feel a sense of pride - acknowledging your accomplishments is important!",
        "Your consistent feeling of pride reflects your commitment to your values and goals."
      ],
      'loving': [
        "Your loving attitude creates positive ripples in your relationships. Keep nurturing those connections!",
        "Maintaining a loving mindset benefits both you and those around you. Well done!"
      ],
      'relieved': [
        "You've maintained a sense of relief - this is a good time to reflect on what helped resolve previous stress.",
        "Continuing to feel relieved suggests you've found effective ways to manage challenges."
      ],
      'amused': [
        "Your continued good humor helps maintain perspective and brings joy to daily life.",
        "Finding amusement consistently is a valuable skill that enhances wellbeing!"
      ],
      'caring': [
        "Your caring nature enriches your relationships and creates meaning in your life.",
        "Maintaining a caring attitude strengthens your connections and supports your emotional health."
      ]
    };
    
    // Default messages if no specific emotion is detected
    const defaultMessages = [
      "You're maintaining positive emotions - that's something to celebrate!",
      "Your consistent positive mood is a reflection of your healthy mental habits.",
      "Keeping up a positive mindset is an achievement worth recognizing.",
      "Your emotional well-being appears strong - remember the practices that help you stay this way!"
    ];
    
    // Get messages for the dominant emotion or use defaults
    const relevantMessages = dominantEmotion && emotionMessages[dominantEmotion]
      ? emotionMessages[dominantEmotion]
      : defaultMessages;
    
    // Pick a random message from the relevant set
    return relevantMessages[Math.floor(Math.random() * relevantMessages.length)];
  };
  
  // Get a wellness tip based on emotion
  const getWellnessTip = () => {
    // Emotion-specific wellness tips
    const emotionWellnessTips = {
      'happy': [
        "Schedule time for activities that consistently bring you joy to maintain this feeling.",
        "Share your happiness with others - positive emotions are contagious!"
      ],
      'excited': [
        "Channel your excitement into creative projects to maximize this positive energy.",
        "Note what triggers your excitement so you can seek these experiences in the future."
      ],
      'grateful': [
        "Consider starting a gratitude journal to reinforce this positive perspective.",
        "Express your gratitude to others to strengthen your relationships."
      ],
      'calm': [
        "Regular meditation can help maintain your peaceful state of mind.",
        "Creating boundaries around technology use can help preserve your sense of calm."
      ],
      'optimistic': [
        "Visualizing positive outcomes can further strengthen your optimistic outlook.",
        "Sharing your positive perspective can inspire others around you."
      ],
      'proud': [
        "Reflecting on your journey can help maintain your sense of accomplishment.",
        "Setting new, achievable goals builds on your current sense of pride."
      ]
    };
    
    // General wellness tips
    const generalWellnessTips = [
      "Spending time in nature can boost your mood and energy levels.",
      "Regular physical activity helps maintain positive emotions.",
      "Quality sleep is essential for emotional regulation and well-being.",
      "Social connections are a key factor in sustained happiness.",
      "Mindfulness practice can help you appreciate positive moments more fully.",
      "Creative expression is linked to greater emotional well-being.",
      "Setting and achieving small daily goals can maintain a sense of accomplishment.",
      "Practicing gratitude regularly helps sustain positive emotions.",
      "Deep breathing exercises can help maintain a calm state of mind.",
      "Finding meaning in your daily activities strengthens positive emotions."
    ];
    
    // Select from emotion-specific tips if available, otherwise use general tips
    const tipsToUse = dominantEmotion && emotionWellnessTips[dominantEmotion]
      ? [...emotionWellnessTips[dominantEmotion], ...generalWellnessTips]
      : generalWellnessTips;
    
    return tipsToUse[Math.floor(Math.random() * tipsToUse.length)];
  };
  
  // Get streak message based on notification content
  const getStreakMessage = () => {
    // Check if notification message suggests a streak
    const messageText = notification?.message?.toLowerCase() || '';
    
    if (messageText.includes('consistently') || messageText.includes('streak') || messageText.includes('continue')) {
      return "You're on a positive streak! Research shows that maintaining positive emotions builds resilience over time.";
    }
    
    return null;
  };
  
  const streakMessage = getStreakMessage();
  
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
            {dominantEmotion ? `Maintaining ${dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)} Emotions` : 'Maintaining Positive Emotions'}
          </h3>
          <button onClick={onClose} className="text-[#B8C7E0] hover:text-white">
            <FaTimes />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-4">
            <div className="flex items-start">
              <div className="bg-green-500/20 p-2 rounded-full mr-3 mt-1">
                <FaLightbulb className="text-green-400" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Great job!</h4>
                <p className="text-[#B8C7E0]">
                  {getPositiveReinforcementMessage()}
                </p>
              </div>
            </div>
          </div>
          
          {streakMessage && (
            <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-4">
              <div className="flex items-start">
                <div className="bg-purple-500/20 p-2 rounded-full mr-3 mt-1">
                  <FaLightbulb className="text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Positive Streak!</h4>
                  <p className="text-[#B8C7E0]">{streakMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547]">
            <div className="flex items-start">
              <div className="bg-blue-500/20 p-2 rounded-full mr-3 mt-1">
                <FaLightbulb className="text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Wellness Tip</h4>
                <p className="text-[#B8C7E0]">
                  {getWellnessTip()}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-lg bg-[#3E60C1] text-white hover:bg-[#5983FC] transition-colors"
        >
          Thanks!
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PositiveReinforcement; 