import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchJournalEntries } from './journalSlice';
import { FaCalendarAlt, FaClock, FaSmile, FaSpinner } from 'react-icons/fa';

const JournalHistory = () => {
    const dispatch = useDispatch();
    const { entries, status, error } = useSelector(state => state.journal);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchJournalEntries());
        }
    }, [status, dispatch]);

    let content;
    if (status === 'loading') {
        content = (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <FaSpinner className="text-[#5983FC] text-3xl animate-spin" />
                <p className="text-[#B8C7E0] animate-pulse">Loading your journal entries...</p>
            </div>
        );
    } else if (status === 'succeeded') {
        if (entries.length === 0) {
            content = (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="bg-[#3E60C1]/20 p-4 rounded-full mb-4">
                        <FaSmile className="text-[#5983FC] text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Entries Yet</h3>
                    <p className="text-[#B8C7E0] max-w-md">
                        Start your journaling journey today. Your first entry awaits!
                    </p>
                </motion.div>
            );
        } else {
            content = (
                <div className="space-y-6">
                    {entries.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6 hover:border-[#3E60C1]/50 transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#3E60C1]/20 p-3 rounded-xl">
                                        <FaCalendarAlt className="text-[#5983FC]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {new Date(entry.date).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-[#B8C7E0] mt-1">
                                            <FaClock className="text-[#5983FC]" size={12} />
                                            <span>
                                                {new Date(entry.date).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0F172A] rounded-xl p-5">
                                <p className="text-[#B8C7E0] whitespace-pre-wrap leading-relaxed">
                                    {entry.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            );
        }
    } else if (status === 'failed') {
        content = (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center"
            >
                <p className="text-red-400">{error}</p>
            </motion.div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <AnimatePresence>
                {content}
            </AnimatePresence>
        </div>
    );
};

export default JournalHistory;