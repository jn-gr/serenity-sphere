import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import journalReducer from '../features/journal/journalSlice'
import moodReducer from '../features/mood/moodSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    journal: journalReducer,
    mood: moodReducer,
  },
}) 