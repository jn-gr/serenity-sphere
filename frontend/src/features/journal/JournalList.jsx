import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchJournalEntries, deleteJournalEntry } from './journalSlice'
import JournalItem from './JournalItem'
import { Link } from 'react-router-dom'
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
        if (window.confirm('Are you sure you want to delete this entry?')) {
            dispatch(deleteJournalEntry(id))
        }
    }

    let content

    if (status === 'loading') {
        content = <p>Loading...</p>
    } else if (status === 'succeeded') {
        if (entries.length === 0) {
            content = <p>No journal entries found. <Link to="/journal/new">Create one now!</Link></p>
        } else {
            content = entries.map(entry => (
                <JournalItem key={entry.id} entry={entry} onDelete={handleDelete} />
            ))
        }
    } else if (status === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <div>
            <h2>Your Journal Entries</h2>
            <Link to="/journal/new" className="create-entry-button">Create New Entry</Link>
            {content}
            <EmotionDetector />
        </div>
    )
}

export default JournalList 