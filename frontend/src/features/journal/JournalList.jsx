import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJournalEntries, deleteJournalEntry } from './journalSlice';
import JournalForm from './JournalForm';
import { motion } from 'framer-motion';

const JournalList = () => {
  const dispatch = useDispatch();
  const { entries, status, error } = useSelector(state => state.journal);
  const [activeTab, setActiveTab] = useState("history");

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

  return (
    <div className="min-h-screen p-6 bg-calm-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('create')}
            className={`px-6 py-2 rounded-full ${
              activeTab === 'create' 
                ? 'bg-primary.DEFAULT text-white' 
                : 'bg-white text-serenity-dark'
            }`}
          >
            New Entry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-full ${
              activeTab === 'history' 
                ? 'bg-primary.DEFAULT text-white' 
                : 'bg-white text-serenity-dark'
            }`}
          >
            History
          </motion.button>
        </div>

        {activeTab === 'create' ? (
          <JournalForm />
        ) : (
          <div className="space-y-6">
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {status === 'succeeded' && entries.length === 0 && (
              <div className="text-center text-calm-400">
                No entries found. Start by creating your first journal entry.
              </div>
            )}
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl bg-white shadow-lg`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">
                    {new Date(entry.date).toLocaleDateString()}
                  </h3>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-calm-400 mb-4">{entry.content}</p>
                {entry.emotions && entry.emotions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Emotional Insights</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.emotions.map(([emotion, score], index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-primary.light text-primary.DEFAULT text-sm"
                        >
                          {emotion} ({Number(score).toFixed(2)})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalList;