import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import axios from 'axios'

export const fetchJournalEntries = createAsyncThunk(
    'journal/fetchJournalEntries',
    async () => {
        const response = await axios.get('/api/journal-entries/')
        return response.data
    }
)

export const createJournalEntry = createAsyncThunk(
    'journal/createEntry',
    async (entryData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/journal/', entryData)
            return response.data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const updateJournalEntry = createAsyncThunk(
    'journal/updateEntry',
    async ({ id, content }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/journal/${id}/`, { content })
            return response.data
        } catch (err) {
            return rejectWithValue(err.response.data)
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
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Entries
            .addCase(fetchJournalEntries.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchJournalEntries.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.entries = action.payload
            })
            .addCase(fetchJournalEntries.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // Create Entry
            .addCase(createJournalEntry.fulfilled, (state, action) => {
                state.entries.unshift(action.payload)
            })
            .addCase(createJournalEntry.rejected, (state, action) => {
                state.error = action.payload.detail || 'Failed to create journal entry.'
            })
            // Update Entry
            .addCase(updateJournalEntry.fulfilled, (state, action) => {
                const index = state.entries.findIndex(entry => entry.id === action.payload.id)
                if (index !== -1) {
                    state.entries[index] = action.payload
                }
            })
            .addCase(updateJournalEntry.rejected, (state, action) => {
                state.error = action.payload.detail || 'Failed to update journal entry.'
            })
            // Delete Entry
            .addCase(deleteJournalEntry.fulfilled, (state, action) => {
                state.entries = state.entries.filter(entry => entry.id !== action.payload)
            })
            .addCase(deleteJournalEntry.rejected, (state, action) => {
                state.error = action.payload.detail || 'Failed to delete journal entry.'
            })
    },
})

export default journalSlice.reducer 