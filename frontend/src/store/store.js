import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import journalReducer from '../features/journal/journalSlice'
import moodReducer from '../features/mood/moodSlice'

const rootReducer = (state, action) => {
  // Clear all data when RESET_STATE action is dispatched
  if (action.type === 'RESET_STATE') {
    state = undefined;
  }
  
  return {
    auth: authReducer(state?.auth, action),
    journal: journalReducer(state?.journal, action),
    mood: moodReducer(state?.mood, action),
  }
}

export const store = configureStore({
  reducer: rootReducer
}) 