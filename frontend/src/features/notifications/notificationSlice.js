import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching notifications...');
      const response = await axios.get('/api/notifications/mood/');
      console.log('Notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch notifications');
    }
  }
);


export const addPositiveReinforcement = createAsyncThunk(
  'notifications/addPositiveReinforcement',
  async (payload, { dispatch }) => {

    const moodValues = {
      // Very positive moods (8-10)
      'happy': 9, 'excited': 9, 'loving': 9, 'optimistic': 8,
      'proud': 8, 'grateful': 8, 'relieved': 8, 'amused': 8,
      
      // Positive moods (6-7)
      'calm': 7, 'caring': 7, 'surprised': 6, 'curious': 6,
      
      // Neutral moods (4-5)
      'neutral': 5, 'confused': 4,
      
      // Negative moods (2-3)
      'anxious': 3, 'nervous': 3, 'embarrassed': 3, 'disappointed': 3,
      'annoyed': 3, 'disapproving': 2, 'sad': 2,
      
      // Very negative moods (0-1)
      'angry': 1, 'grieving': 1, 'disgusted': 1, 'remorseful': 1
    };
    
    const mood = payload.mood || 'neutral';
    const moodValue = moodValues[mood] || 0;
    

    if (moodValue >= 6) {
      return {
        id: payload.id || Date.now(),
        type: 'positive_reinforcement',
        message: payload.message || `Great to see you're feeling ${mood}! Keep up the positive energy!`,
        mood: mood,
        created_at: new Date().toISOString(),
        read: false
      };
    }
    
    return null;
  }
);

const analyzeNotificationTrend = (notification) => {
  if (!notification || !notification.mood) return false;
  

  const moodValues = {
    // Very positive moods (8-10)
    'happy': 9, 'excited': 9, 'loving': 9, 'optimistic': 8,
    'proud': 8, 'grateful': 8, 'relieved': 8, 'amused': 8,
    
    // Positive moods (6-7)
    'calm': 7, 'caring': 7, 'surprised': 6, 'curious': 6,
    
    // Neutral moods (4-5)
    'neutral': 5, 'confused': 4,
    
    // Negative moods (2-3)
    'anxious': 3, 'nervous': 3, 'embarrassed': 3, 'disappointed': 3,
    'annoyed': 3, 'disapproving': 2, 'sad': 2,
    

    'angry': 1, 'grieving': 1, 'disgusted': 1, 'remorseful': 1
  };

  return (moodValues[notification.mood] || 5) < 4;
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {
    dismissNotification: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.reduce((acc, notification) => {
          if (notification.type === 'mood_shift') {
            const isNegativeShift = analyzeNotificationTrend(notification);
            
            if (!isNegativeShift) return acc;
            
            return [...acc, {
              ...notification,
              isNegativeShift: true
            }];
          }
          return [...acc, notification];
        }, []);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addPositiveReinforcement.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }
      });
  }
});

export const { dismissNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 