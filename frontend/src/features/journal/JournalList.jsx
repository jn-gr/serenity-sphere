import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchJournalEntries, deleteJournalEntry } from './journalSlice'
import JournalItem from './JournalItem'
import { Link } from 'react-router-dom'
import '../../styles/components/_journal.css'
import EmotionDetector from '../emotion/EmotionDetector'

const JournalList = () => {
    const dispatch = useDispatch()
    const { entries, status, error } = useSelector(state => state.journal)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchJournalEntries())
        }
    }, [status, dispatch])

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this journal entry?')) {
            dispatch(deleteJournalEntry(id))
        }
    }

    let content

    if (status === 'loading') {
        content = <p>Loading...</p>
    } else if (status === 'succeeded') {
        if (entries.length === 0) {
            content = <p>No Journal Entries found. <Link to="/journal/new">Create one now!</Link></p>
        } else {
            content = entries.map(entry => (
                <JournalItem className="journal-item" key={entry.id} entry={entry} onDelete={handleDelete} />
            ))
        }
    } else if (status === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <div className="journal-container">
            <h2>Your Daily Journal</h2>
            <Link to="/journal/new" className="create-entry-button">Enter your daily journal entry (TESTING)</Link>
            {content}
            <br></br>
            <EmotionDetector />
        </div>
    )
}

export default JournalList 