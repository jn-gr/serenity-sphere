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
                    console.error('Failed to create Journal Entry:', err)
                })
        }
    }

    return (
        <div className="journal-container">
            <h2>Write your daily journal entry</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="journal-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your journal entry here..."
                    rows="5"
                    cols="60"
                    required
                ></textarea>
                <br />
                <button type="submit" aria-label="Save Entry" className="journal-actions-button">
                    <FaSave size={16} />
                </button>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default JournalForm 