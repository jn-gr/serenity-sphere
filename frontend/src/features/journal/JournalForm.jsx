import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createJournalEntry } from './journalSlice'
import { useNavigate } from 'react-router-dom'
import { FaSave, FaTimes } from 'react-icons/fa'
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
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { error } = useSelector(state => state.journal)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (content.trim()) {
            try {
                await dispatch(createJournalEntry({ content })).unwrap()
                setShowSuccess(true)
                setContent('') // Clear the content
            } catch (err) {
                console.error('Failed to create Journal Entry:', err)
            }
        }
    }

    const handleSuccessClose = () => {
        setShowSuccess(false)
        navigate('/journal')
    }

    return (
        <>
            <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your thoughts here..."
                        className="w-full p-4 rounded-xl bg-[#0F172A] border-2 border-[#2A3547] focus:border-[#5983FC] focus:ring-0 text-[#B8C7E0] placeholder-[#4A5568] resize-none min-h-[300px]"
                    ></textarea>
                    
                    <div className="flex justify-end items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => navigate('/journal')}
                            className="px-6 py-3 rounded-xl bg-[#2A3547] text-[#B8C7E0] hover:bg-[#374151] transition-all flex items-center gap-2"
                        >
                            <FaTimes size={16} />
                            <span>Cancel</span>
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white px-6 py-3 rounded-xl flex items-center gap-2"
                        >
                            <FaSave size={16} />
                            <span>Save Entry</span>
                        </motion.button>
                    </div>
                    
                    {error && (
                        <div className="p-4 bg-red-500/10 text-red-500 rounded-xl">
                            {error}
                        </div>
                    )}
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