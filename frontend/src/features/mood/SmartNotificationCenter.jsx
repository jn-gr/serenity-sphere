import React from 'react';
import { useSelector } from 'react-redux';
import NotificationCenter from '../notifications/NotificationCenter';
import PositiveReinforcement from '../../components/PositiveReinforcement';
import MoodCausePrompt from '../../components/MoodCausePrompt';

const SmartNotificationCenter = () => {
  // Access Redux state
  const { notifications } = useSelector(state => state.notifications);
  const { logs } = useSelector(state => state.mood);
  
  // If there's no data yet, just render the regular NotificationCenter
  if (!notifications || !logs || logs.length === 0) {
    return <NotificationCenter />;
  }

  try {
    // Get recent logs to determine current emotional state (safely)
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
    
    // Check if user is in a consistently positive state
    const isConsistentlyPositive = 
      recentLogs.length >= 2 && 
      currentMood && 
      positiveEmotions.includes(currentMood) &&
      positiveEmotions.includes(previousMood);
    
    // Check if current mood is negative
    const isCurrentNegative = currentMood && negativeEmotions.includes(currentMood);
    
    // Check if previous mood exists and is negative
    const isPreviousNegative = previousMood && negativeEmotions.includes(previousMood);
    
    // Check if previous mood exists and is positive
    const isPreviousPositive = previousMood && positiveEmotions.includes(previousMood);
    
    console.log("Mood status - Current:", currentMood, "Previous:", previousMood);
    console.log("Current negative:", isCurrentNegative, "Previous negative:", isPreviousNegative, "Previous positive:", isPreviousPositive);
    
    // For users in consistently positive states, create a positive notification
    if (isConsistentlyPositive) {
      console.log("User is consistently positive - showing positive reinforcement");
      
      const positiveNotification = {
        id: 'positive-reinforcement-' + Date.now(),
        type: 'positive_reinforcement',
        message: `Great job maintaining a positive mood! You've been feeling ${currentMood} recently.`,
        severity: 'success',
        timestamp: new Date().toISOString(),
        seen: false
      };
      
      return (
        <>
          <PositiveReinforcement 
            notification={positiveNotification}
            dominantEmotion={currentMood}
            onClose={() => {}}
          />
          <NotificationCenter 
            customNotifications={notifications.filter(notif => notif.type !== 'mood_shift')} 
          />
        </>
      );
    }
    
    // For users experiencing negative emotions
    if (isCurrentNegative) {
      console.log("User is experiencing negative emotions");
      
      // Show mood shift UI when transitioning from positive to negative
      if (isPreviousPositive) {
        console.log("Detected positive to negative transition - showing mood shift UI");
        
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
            <NotificationCenter 
              customNotifications={notifications.filter(notif => notif.type !== 'mood_shift')} 
            />
          </>
        );
      }
      
      // Show emotional support UI when:
      // 1. Only one mood entry exists and it's negative
      // 2. Last two moods are both negative
      if (!previousMood || isPreviousNegative) {
        console.log("Showing emotional support UI for negative state");
        
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
            <NotificationCenter 
              customNotifications={notifications.filter(notif => notif.type !== 'mood_shift')} 
            />
          </>
        );
      }
    }
    
  } catch (error) {
    console.error("Error in SmartNotificationCenter:", error);
  }
  
  // Default behavior - show normal notifications
  return <NotificationCenter />;
};

export default SmartNotificationCenter;