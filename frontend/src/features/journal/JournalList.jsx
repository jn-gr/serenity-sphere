import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaPlus, FaHistory, FaTrash, FaBrain } from 'react-icons/fa';
import { fetchJournalEntries, deleteJournalEntry } from './journalSlice';
import JournalForm from './JournalForm';
import EmotionAnalysis from '../emotion/components/EmotionAnalysisModal';
import { fetchMoodLogs, fetchMoodTrends } from '../mood/moodSlice'

const JournalList = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedEmotions, setSelectedEmotions] = useState(null);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
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
    <div className="ml-64 min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Journal Entries</h1>
            <p className="text-[#B8C7E0]">Record and track your thoughts</p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                activeTab === 'create' 
                  ? 'bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white'
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                activeTab === 'history' 
                  ? 'bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white'
                  : 'bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547]'
              } transition-all duration-200`}
            >
              <FaHistory size={16} />
              <span>History</span>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'create' ? (
          <JournalForm />
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <div className="flex items-center gap-2">
                    {entry.emotions && entry.emotions.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAnalyzeEmotions(entry.emotions)}
                        className="text-[#5983FC] hover:text-[#3E60C1] transition-colors p-2"
                      >
                        <FaBrain size={16} />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(entry.id)}
                      className="text-[#B8C7E0] hover:text-red-500 transition-colors p-2"
                    >
                      <FaTrash size={16} />
                    </motion.button>
                  </div>
                </div>
                
                <p className="text-[#B8C7E0] whitespace-pre-wrap">{entry.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Emotion Analysis Modal */}
      {showEmotionModal && (
        <EmotionAnalysis 
          emotions={selectedEmotions} 
          onClose={() => setShowEmotionModal(false)} 
        />
      )}
    </div>
  );
};

export default JournalList;