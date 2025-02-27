import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createJournalEntry, fetchJournalEntries } from './journalSlice'
import { useNavigate } from 'react-router-dom'
import { FaPaperPlane, FaCheck } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMdCheckmarkCircle } from 'react-icons/io'


const SuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-8 max-w-md w-full mx-4"
                >
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <IoMdCheckmarkCircle className="text-green-500 text-6xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Entry Added Successfully!
                        </h3>
                        <p className="text-[#B8C7E0] mb-6">
                            Your journal entry has been saved.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white px-6 py-3 rounded-xl"
                        >
                            Continue
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const JournalForm = () => {
    const [content, setContent] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [hasEntryToday, setHasEntryToday] = useState(false)
    const [todaysEntry, setTodaysEntry] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { entries, status } = useSelector(state => state.journal)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchJournalEntries())
        }
        
        if (entries.length > 0) {
            const today = new Date().toISOString().split('T')[0]
            const entryToday = entries.find(entry => 
                new Date(entry.date).toISOString().split('T')[0] === today
            )
            
            if (entryToday) {
                setHasEntryToday(true)
                setTodaysEntry(entryToday)
                setContent(entryToday.content)
            } else {
                setHasEntryToday(false)
                setTodaysEntry(null)
            }
        }
    }, [entries, status, dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (content.trim()) {
            try {
                await dispatch(createJournalEntry({ content })).unwrap()
                setShowSuccess(true)
                
                setTimeout(() => {
                    setShowSuccess(false)
                }, 3000)
            } catch (err) {
                console.error('Failed to save journal entry:', err)
            }
        }
    }

    const handleSuccessClose = () => {
        setShowSuccess(false)
        navigate('/journal')
    }

    return (
        <>
            <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6 w-full">
                <h2 className="text-xl font-semibold text-white mb-4">
                    {hasEntryToday ? "Edit Today's Journal Entry" : "Create Today's Journal Entry"}
                </h2>
                
                {hasEntryToday && (
                    <div className="mb-4 p-3 bg-[#2A3547] rounded-lg text-[#B8C7E0]">
                        <p className="text-sm">
                            You've already written an entry today. You can edit it below.
                        </p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="How are you feeling today? What's on your mind?"
                        className="w-full p-4 rounded-xl bg-[#0F172A] border border-[#2A3547] text-[#B8C7E0] min-h-[200px] focus:outline-none focus:border-[#3E60C1] transition-colors"
                        required
                    ></textarea>
                    
                    <div className="flex justify-end mt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white"
                        >
                            {showSuccess ? (
                                <>
                                    <FaCheck size={16} />
                                    <span>Saved!</span>
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane size={16} />
                                    <span>{hasEntryToday ? "Update Entry" : "Save Entry"}</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>

            <SuccessModal 
                isOpen={showSuccess} 
                onClose={handleSuccessClose}
            />
        </>
    )
}

export default JournalForm 