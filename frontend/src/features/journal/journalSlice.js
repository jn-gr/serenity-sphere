import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import axios from 'axios'

export const fetchJournalEntries = createAsyncThunk(
    'journal/fetchEntries',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/journal/')
            return response.data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const createJournalEntry = createAsyncThunk(
    'journal/createEntry',
    async (entryData, { rejectWithValue, getState }) => {
        try {
            // Check if there's an entry for today
            const state = getState();
            const today = new Date().toISOString().split('T')[0];
            const todaysEntry = state.journal.entries.find(entry => 
                new Date(entry.date).toISOString().split('T')[0] === today
            );
            
            let response;
            
            // If entry exists, update it
            if (todaysEntry) {
                response = await api.put(`/api/journal/${todaysEntry.id}/`, {
                    ...todaysEntry,
                    content: entryData.content
                });
            } else {
                // Otherwise create a new entry
                response = await api.post('/api/journal/', entryData);
            }
            
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

export const deleteJournalEntry = createAsyncThunk(
    'journal/deleteEntry',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/journal/${id}/`)
            return id
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

const journalSlice = createSlice({
    name: 'journal',
    initialState: {
        entries: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch entries
            .addCase(fetchJournalEntries.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchJournalEntries.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.entries = action.payload
            })
            .addCase(fetchJournalEntries.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            
            // Create entry
            .addCase(createJournalEntry.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(createJournalEntry.fulfilled, (state, action) => {
                state.status = 'succeeded'
                
                // Check if this is an update to an existing entry
                const index = state.entries.findIndex(entry => entry.id === action.payload.id);
                
                if (index !== -1) {
                    // Update existing entry
                    state.entries[index] = action.payload;
                } else {
                    // Add new entry
                    state.entries.push(action.payload);
                }
                
                // Sort entries by date (newest first)
                state.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
            })
            .addCase(createJournalEntry.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            
            // Delete entry
            .addCase(deleteJournalEntry.fulfilled, (state, action) => {
                state.entries = state.entries.filter(entry => entry.id !== action.payload)
            })
    }
})

export default journalSlice.reducer