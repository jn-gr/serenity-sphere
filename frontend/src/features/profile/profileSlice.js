import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  success: false
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    },
    updateSuccess: (state) => {
      state.isLoading = false;
      state.success = true;
    },
    updateFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  }
});

export const { updateStart, updateSuccess, updateFailure, clearError, clearSuccess } = profileSlice.actions;
export default profileSlice.reducer; 