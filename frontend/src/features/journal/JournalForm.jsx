import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createJournalEntry } from './journalSlice'
import { useNavigate, Link } from 'react-router-dom'
import { FaSave } from 'react-icons/fa'
import { motion } from 'framer-motion'

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
        <div className="p-6 rounded-2xl bg-white shadow-lg">
            <h2 className="text-2xl font-bold mb-6">New Journal Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="w-full p-4 rounded-xl border-2 border-calm-200 focus:border-primary.DEFAULT focus:outline-none resize-none min-h-[200px]"
                ></textarea>
                
                <div className="flex justify-between items-center">
                    <Link 
                        to="/journal" 
                        className="text-calm-400 hover:text-primary.DEFAULT transition-colors"
                    >
                        ← Back to Journal
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-primary.DEFAULT hover:bg-primary.dark text-white px-6 py-2 rounded-full flex items-center gap-2"
                    >
                        <FaSave />
                        Save Entry
                    </motion.button>
                </div>
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
            </form>
        </div>
    )
}

export default JournalForm 