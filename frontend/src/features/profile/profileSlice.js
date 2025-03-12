import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { setCredentials } from '../auth/authSlice';

// Async thunk for updating user profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      // Standard JSON request - no more FormData needed
      const response = await api.put('/api/user-profile/', userData);
      
      // Update the user credentials in the auth slice as well
      dispatch(setCredentials({ user: response.data, isAuthenticated: true }));
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        // Return the error message from the API
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue('Failed to update profile. Please try again later.');
      }
    }
  }
);

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  success: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        
        // Handle different types of error responses
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else if (action.payload && typeof action.payload === 'object') {
          // For field validation errors like password mismatch
          const firstError = Object.values(action.payload)[0];
          state.error = Array.isArray(firstError) ? firstError[0] : firstError;
        } else {
          state.error = action.error.message || 'Failed to update profile';
        }
        
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess } = profileSlice.actions;
export default profileSlice.reducer; 