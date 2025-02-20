import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJournalEntries, deleteJournalEntry } from './journalSlice';
import JournalForm from './JournalForm';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaHistory, FaTrash, FaBrain } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const EmotionModal = ({ emotions, isOpen, onClose }) => {
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
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Emotional Analysis</h3>
            <button
              onClick={onClose}
              className="text-[#B8C7E0] hover:text-white transition-colors"
            >
              <IoMdClose size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            {emotions.map(([emotion, score], index) => (
              <div key={index} className="bg-[#0F172A] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#B8C7E0] capitalize">{emotion}</span>
                  <span className="text-[#5983FC] font-semibold">
                    {Math.round(score * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-[#2A3547] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3E60C1] to-[#5983FC] transition-all duration-500"
                    style={{ width: `${score * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-6 bg-[#2A3547] text-[#B8C7E0] hover:bg-[#374151] py-3 rounded-xl transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const JournalList = () => {
  const dispatch = useDispatch();
  const { entries, status, error } = useSelector(state => state.journal);
  const [activeTab, setActiveTab] = useState("history");
  const [selectedEmotions, setSelectedEmotions] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (activeTab === "history" && status === 'idle') {
      dispatch(fetchJournalEntries());
    }
  }, [activeTab, status, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      dispatch(deleteJournalEntry(id));
    }
  };

  const handleAnalyzeEmotions = (emotions) => {
    setSelectedEmotions(emotions);
    setIsModalOpen(true);
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
              <span>New Entry</span>
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
            {status === 'loading' && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5983FC] mx-auto"></div>
              </div>
            )}
            
            {status === 'failed' && (
              <div className="p-4 bg-red-500/10 text-red-500 rounded-xl">
                {error}
              </div>
            )}
            
            {status === 'succeeded' && entries.length === 0 && (
              <div className="text-center py-12">
                <div className="text-[#B8C7E0] mb-4">No entries found.</div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('create')}
                  className="bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white px-6 py-3 rounded-xl"
                >
                  Create Your First Entry
                </motion.button>
              </div>
            )}

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

      <EmotionModal
        emotions={selectedEmotions || []}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default JournalList;