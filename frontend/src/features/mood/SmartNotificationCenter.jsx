import React from 'react';
import { useSelector } from 'react-redux';
import NotificationCenter from '../notifications/NotificationCenter';
import PositiveReinforcement from '../../components/PositiveReinforcement';

const SmartNotificationCenter = () => {
  // Access Redux state
  const { notifications } = useSelector(state => state.notifications);
  const { logs } = useSelector(state => state.mood);
  
  // If there's no data yet, just render the regular NotificationCenter
  if (!notifications || !logs || logs.length === 0) {
    return <NotificationCenter />; // Just render the original component
  }

  try {
    // Get recent logs to determine current emotional state (safely)
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.date || b.created_at || 0) - new Date(a.date || a.created_at || 0)
    );
    const recentLogs = sortedLogs.slice(0, 3);
    
    // Define positive emotions
    const positiveEmotions = ['happy', 'excited', 'loving', 'optimistic', 'proud', 'grateful', 'relieved', 'amused', 'calm', 'caring'];
    
    // Check if user is in a consistently positive state
    const isConsistentlyPositive = 
      recentLogs.length >= 2 && 
      recentLogs[0]?.mood && 
      positiveEmotions.includes(recentLogs[0].mood) &&
      positiveEmotions.includes(recentLogs[1].mood);
    
    console.log("Mood status - Consistently positive:", isConsistentlyPositive);
    
    // For users in consistently positive states, create a positive notification
    if (isConsistentlyPositive) {
      console.log("User is consistently positive - showing positive reinforcement");
      
      // Create a positive notification to replace mood shift notifications
      const positiveNotification = {
        id: 'positive-reinforcement-' + Date.now(), // Unique ID
        type: 'positive_reinforcement',
        message: `Great job maintaining a positive mood! You've been feeling ${recentLogs[0].mood} recently.`,
        severity: 'success',
        timestamp: new Date().toISOString(),
        seen: false
      };
      
      // Filter out mood_shift notifications
      const moodShiftsExisted = notifications.some(notif => notif.type === 'mood_shift');
      
      // Only show positive reinforcement if there were mood shifts that we filtered out
      if (moodShiftsExisted) {
        // Extract dominant emotion from recent logs
        const dominantEmotion = recentLogs[0]?.mood || '';
        
        // Instead of filtering notifications, we'll directly render the PositiveReinforcement component
        // with the custom notification
        return (
          <>
            <PositiveReinforcement 
              notification={positiveNotification}
              dominantEmotion={dominantEmotion}
              onClose={() => {}} // Handle closure in the component
            />
            {/* Still render regular notifications for non-mood shift notifications */}
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