import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMoodTrends = createAsyncThunk(
  'mood/fetchTrends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/mood-trends/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch mood trends');
    }
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    trends: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodTrends.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMoodTrends.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trends = action.payload;
        state.error = null;
      })
      .addCase(fetchMoodTrends.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default moodSlice.reducer; 