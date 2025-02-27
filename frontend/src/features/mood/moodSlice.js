import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMoodLogs = createAsyncThunk(
  'mood/fetchMoodLogs',
  async () => {
    const response = await api.get('/api/mood-trends/');
    return response.data;
  }
);

export const fetchMoodTrends = createAsyncThunk(
  'mood/fetchTrends',
  async () => {
    const response = await api.get('/api/mood-trends/');
    return response.data;
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    logs: [],
    trends: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMoodLog: (state, action) => {
      state.logs.push(action.payload);
    },
    updateMoodLog: (state, action) => {
      const index = state.logs.findIndex(log => log.id === action.payload.id);
      if (index !== -1) {
        state.logs[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMoodLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchMoodLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMoodTrends.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMoodTrends.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trends = action.payload;
      })
      .addCase(fetchMoodTrends.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addMoodLog, updateMoodLog } = moodSlice.actions;
export default moodSlice.reducer; 