import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NotificationCenter from '../notifications/NotificationCenter';
import PositiveReinforcement from '../../components/PositiveReinforcement';
import MoodCausePrompt from '../../components/MoodCausePrompt';
import { addPositiveReinforcement } from '../notifications/notificationSlice';

const SmartNotificationCenter = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.notifications);
  const { logs } = useSelector(state => state.mood);
  
  useEffect(() => {
    if (logs && logs.length > 0) {
      const sortedLogs = [...logs].sort((a, b) => 
        new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0)
      );
      const latestMood = sortedLogs[0]?.mood;
      
      // Define positive emotions
      const positiveEmotions = ['happy', 'excited', 'loving', 'optimistic', 'proud', 'grateful', 'relieved', 'amused', 'calm', 'caring'];
      
      // If latest mood is positive, always dispatch positive reinforcement
      if (latestMood && positiveEmotions.includes(latestMood)) {
        // Create a unique ID for each visit
        const notificationId = `positive-${Date.now()}`;
        dispatch(addPositiveReinforcement({ 
          mood: latestMood,
          id: notificationId,
          message: `Great to see you're feeling ${latestMood}! Keep up the positive energy!`
        }));
      }
    }
  }, [logs, dispatch]);

  // If there's no data yet, just render the regular NotificationCenter
  if (!notifications || !logs || logs.length === 0) {
    return <NotificationCenter />;
  }

  try {
    // Get recent logs to determine current emotional state
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0)
    );
    const recentLogs = sortedLogs.slice(0, 3);
    
    // Define emotion categories
    const positiveEmotions = ['happy', 'excited', 'loving', 'optimistic', 'proud', 'grateful', 'relieved', 'amused', 'calm', 'caring'];
    const negativeEmotions = ['anxious', 'nervous', 'embarrassed', 'disappointed', 'annoyed', 'disapproving', 'sad', 'angry', 'grieving', 'disgusted', 'remorseful'];
    
    // Check current emotional state
    const currentMood = recentLogs[0]?.mood;
    const previousMood = recentLogs[1]?.mood;
    
    // Check if current mood is negative
    const isCurrentNegative = currentMood && negativeEmotions.includes(currentMood);
    
    // For users experiencing negative emotions
    if (isCurrentNegative) {
      // Show mood shift UI when transitioning from positive to negative
      if (previousMood && positiveEmotions.includes(previousMood)) {
        const moodShiftNotification = {
          id: 'mood-shift-' + Date.now(),
          type: 'mood_shift',
          message: `I notice your mood has shifted from ${previousMood} to ${currentMood}. Would you like to explore what might have contributed to this change?`,
          severity: 'info',
          timestamp: new Date().toISOString(),
          seen: false,
          currentMood: currentMood,
          previousMood: previousMood,
          isNegativeShift: true
        };
        
        return (
          <>
            <MoodCausePrompt 
              notification={moodShiftNotification}
              onClose={() => {}}
            />
            <NotificationCenter />
          </>
        );
      }
      
      // Show emotional support UI for negative states
      const supportNotification = {
        id: 'emotional-support-' + Date.now(),
        type: 'emotional_support',
        message: `I notice you're feeling ${currentMood}. Would you like some support?`,
        severity: 'info',
        timestamp: new Date().toISOString(),
        seen: false,
        currentMood: currentMood,
        previousMood: previousMood,
        isNegativeShift: false
      };
      
      return (
        <>
          <MoodCausePrompt 
            notification={supportNotification}
            onClose={() => {}}
          />
          <NotificationCenter />
        </>
      );
    }
    
  } catch (error) {
    console.error("Error in SmartNotificationCenter:", error);
  }
  
  // Default behavior - show normal notifications
  return <NotificationCenter />;
};

export default SmartNotificationCenter;