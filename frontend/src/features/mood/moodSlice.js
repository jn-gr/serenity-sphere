import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchMoodLogs = createAsyncThunk(
  'mood/fetchMoodLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/mood/');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createMoodLog = createAsyncThunk(
  'mood/createMoodLog',
  async (moodData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/mood/', moodData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMoodAnalytics = createAsyncThunk(
  'mood/fetchMoodAnalytics',
  async (period = 'week', { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/mood-analytics/?period=${period}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMoodSummary = createAsyncThunk(
  'mood/fetchMoodSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/mood-summary/');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    logs: [],
    analytics: null,
    summary: null,
    status: 'idle',
    error: null,
    analyticsStatus: 'idle',
    summaryStatus: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch mood logs
      .addCase(fetchMoodLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMoodLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchMoodLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Create mood log
      .addCase(createMoodLog.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMoodLog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs.push(action.payload);
        // Sort logs by date (newest first)
        state.logs.sort((a, b) => new Date(b.date) - new Date(a.date));
      })
      .addCase(createMoodLog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch mood analytics
      .addCase(fetchMoodAnalytics.pending, (state) => {
        state.analyticsStatus = 'loading';
      })
      .addCase(fetchMoodAnalytics.fulfilled, (state, action) => {
        state.analyticsStatus = 'succeeded';
        state.analytics = action.payload;
      })
      .addCase(fetchMoodAnalytics.rejected, (state, action) => {
        state.analyticsStatus = 'failed';
        state.error = action.payload;
      })
      
      // Fetch mood summary
      .addCase(fetchMoodSummary.pending, (state) => {
        state.summaryStatus = 'loading';
      })
      .addCase(fetchMoodSummary.fulfilled, (state, action) => {
        state.summaryStatus = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchMoodSummary.rejected, (state, action) => {
        state.summaryStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export default moodSlice.reducer; 