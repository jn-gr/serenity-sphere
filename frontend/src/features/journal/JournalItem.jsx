import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateJournalEntry } from './journalSlice'

// Import React Icons for actions
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'

const JournalItem = ({ entry, onDelete }) => {
    const dispatch = useDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(entry.content)

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        if (content.trim()) {
            dispatch(updateJournalEntry({ id: entry.id, content }))
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        setContent(entry.content)
        setIsEditing(false)
    }

    return (
        <div className="journal-item">
            <h3>{new Date(entry.date).toLocaleDateString()}</h3>
            {isEditing ? (
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    cols="50"
                ></textarea>
            ) : (
                <p>{entry.content}</p>
            )}
            <div className="journal-actions">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} aria-label="Save">
                            <FaSave size={16} />
                        </button>
                        <button onClick={handleCancel} aria-label="Cancel">
                            <FaTimes size={16} />
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={handleEdit} aria-label="Edit">
                            <FaEdit size={16} />
                        </button>
                        <button onClick={() => onDelete(entry.id)} aria-label="Delete">
                            <FaTrash size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default JournalItem 