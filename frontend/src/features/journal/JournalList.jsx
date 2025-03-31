import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaHistory, FaTrash, FaBrain, FaCalendarDay, FaBook, FaClock } from 'react-icons/fa';
import { fetchJournalEntries, deleteJournalEntry } from './journalSlice';
import JournalForm from './JournalForm';
import { fetchMoodLogs, fetchMoodTrends } from '../mood/moodSlice'

const JournalList = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [hasEntryToday, setHasEntryToday] = useState(false);
  
  const dispatch = useDispatch();
  const { entries, status } = useSelector(state => state.journal);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchJournalEntries());
    }
    
    // Check if user already has an entry for today
    if (entries.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const entryToday = entries.find(entry => 
        new Date(entry.date).toISOString().split('T')[0] === today
      );
      
      setHasEntryToday(!!entryToday);
    }
  }, [entries, status, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      dispatch(deleteJournalEntry(id));
    }
  };

  const handleAnalyzeEmotions = (emotions) => {
    setSelectedEmotions(emotions);
    setShowEmotionModal(true);
  };

  const handleSubmit = async (content) => {
    try {
      await dispatch(createJournalEntry(content));
      // Fetch updated mood trends after creating journal entry
      dispatch(fetchMoodTrends());
    } catch (error) {
      console.error('Failed to create journal entry:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Journal Entries</h1>
              <p className="text-[#B8C7E0]">Record and track your thoughts</p>
            </div>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="bg-[#1A2335] rounded-xl border border-[#2A3547] p-3 flex items-center">
                <div className="bg-[#3E60C1]/20 p-2 rounded-lg mr-3">
                  <FaBook className="text-[#5983FC]" />
                </div>
                <div>
                  <p className="text-[#B8C7E0] text-xs">Total Entries</p>
                  <p className="text-white font-semibold">{entries.length}</p>
                </div>
              </div>
              
              <div className="bg-[#1A2335] rounded-xl border border-[#2A3547] p-3 flex items-center">
                <div className="bg-[#3E60C1]/20 p-2 rounded-lg mr-3">
                  <FaCalendarDay className="text-[#5983FC]" />
                </div>
                <div>
                  <p className="text-[#B8C7E0] text-xs">Today's Status</p>
                  <p className="text-white font-semibold">
                    {hasEntryToday ? "Entry Made" : "No Entry"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('create')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium shadow-lg ${
                activeTab === 'create' 
                  ? 'bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white shadow-[#5983FC]/20'
                  : 'bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547]'
              } transition-all duration-200`}
            >
              <FaPlus size={16} />
              <span>{hasEntryToday ? "Today's Entry" : "New Entry"}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('history')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium shadow-lg ${
                activeTab === 'history' 
                  ? 'bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white shadow-[#5983FC]/20'
                  : 'bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547]'
              } transition-all duration-200`}
            >
              <FaHistory size={16} />
              <span>History</span>
            </motion.button>
          </div>
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <JournalForm />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6 hover:border-[#3E60C1]/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#3E60C1]/20 p-3 rounded-xl">
                        <FaClock className="text-[#5983FC]" />
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
                        <p className="text-sm text-[#B8C7E0]">
                          {new Date(entry.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(entry.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      >
                        <FaTrash size={16} />
                        <span className="text-sm">Delete</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="bg-[#0F172A] rounded-xl p-4 mt-4">
                    <p className="text-[#B8C7E0] whitespace-pre-wrap leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JournalList;