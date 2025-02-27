import { createSlice } from '@reduxjs/toolkit'

// Get initial state from localStorage if available
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      // Clear user data from localStorage
      localStorage.removeItem('user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

// Create a reset action that other slices can listen to
export const resetState = () => ({
  type: 'RESET_STATE'
})

export default authSlice.reducer 