import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createJournalEntry } from './journalSlice'
import { useNavigate } from 'react-router-dom'

// Import React Icons for action
import { FaSave } from 'react-icons/fa'

const JournalForm = () => {
    const [content, setContent] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { error } = useSelector(state => state.journal)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (content.trim()) {
            dispatch(createJournalEntry({ content }))
                .unwrap()
                .then(() => {
                    navigate('/journal')
                })
                .catch((err) => {
                    console.error('Failed to create journal entry:', err)
                })
        }
    }

    return (
        <div>
            <h2>Create New Journal Entry</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your journal entry here..."
                    rows="5"
                    cols="60"
                    required
                ></textarea>
                <br />
                <button type="submit" aria-label="Save Entry">
                    <FaSave size={16} /> Save Entry
                </button>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default JournalForm 