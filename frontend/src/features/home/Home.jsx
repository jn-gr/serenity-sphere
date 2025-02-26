// frontend/src/features/home/Home.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/layouts/_home.css';
import JournalPreview from '../journal/JournalPreview';
import { fetchJournalEntries } from '../journal/journalSlice';
import MoodChart from '../mood/MoodChart';

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const journalEntries = useSelector(state => state.journal.entries);
  const journalStatus = useSelector(state => state.journal.status);
  
  const today = new Date().toISOString().split('T')[0];
  const todaysEntry = journalEntries.find(entry => 
    new Date(entry.date).toISOString().split('T')[0] === today
  );

  useEffect(() => {
    if (isAuthenticated && journalStatus === 'idle') {
      dispatch(fetchJournalEntries());
    }
  }, [isAuthenticated, journalStatus, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A]">
        {/* Add margin-top to account for the navbar */}
        <div className="pt-20">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold text-white leading-tight"
                >
                  Transform Your Mental Health with
                  <span className="block bg-gradient-to-r from-[#3E60C1] to-[#5983FC] bg-clip-text text-transparent mt-3">
                    AI-Powered Insights
                  </span>
                </motion.h1>
                <p className="text-lg text-[#B8C7E0] leading-relaxed">
                  Track your emotions, analyse patterns, and find balance through intelligent journaling.
                </p>
                <div className="flex gap-4">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-[#5983FC]/30 transition-all"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative bg-gradient-to-br from-[#3E60C1] to-[#5983FC] p-[1px] rounded-2xl shadow-2xl">
                  <div className="bg-[#1A2335] rounded-2xl p-6 backdrop-blur-xl">
                    <div className="space-y-6">
                      <div className="h-64 bg-gradient-to-r from-[#3E60C1]/20 to-[#5983FC]/20 rounded-xl animate-pulse" />
                      <div className="space-y-4">
                        <div className="h-4 bg-[#3E60C1]/20 rounded-full w-3/4" />
                        <div className="h-4 bg-[#3E60C1]/20 rounded-full w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-[#1A2335] py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Features that Empower You
                </h2>
                <p className="text-[#B8C7E0] max-w-2xl mx-auto">
                  Experience a new way of understanding your mental health journey
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-[#0F172A] p-8 rounded-2xl border border-[#2A3547] hover:border-[#3E60C1] transition-all duration-300"
                >
                  <div className="text-[#5983FC] text-4xl mb-4">🧠</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Emotional AI Analysis
                  </h3>
                  <p className="text-[#B8C7E0]">
                    Deep learning models detect subtle emotional patterns
                  </p>
                </motion.div>
                {/* Add more feature cards here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard with animations
  return (
    <div className="ml-64 min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-[#B8C7E0]">Here's your mental health overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#5983FC]">{new Date().toLocaleDateString()}</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-[#1A2335] p-6 rounded-2xl border border-[#2A3547] hover:border-[#3E60C1] transition-colors"
          >
            <div className="text-[#B8C7E0] mb-2">Weekly Entries</div>
            <div className="text-3xl font-bold text-[#5983FC]">
              {journalEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return entryDate >= weekAgo;
              }).length}
            </div>
            <div className="h-1 bg-gradient-to-r from-[#5983FC] to-[#3E60C1] mt-4 rounded-full" />
          </motion.div>

          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-[#1A2335] p-6 rounded-2xl border border-[#2A3547] hover:border-[#3E60C1] transition-colors"
          >
            <div className="text-[#B8C7E0] mb-2">Monthly Progress</div>
            <div className="text-3xl font-bold text-[#5983FC]">
              {journalEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return entryDate >= monthAgo;
              }).length}
            </div>
            <div className="h-1 bg-gradient-to-r from-[#5983FC] to-[#3E60C1] mt-4 rounded-full" />
          </motion.div>

          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-[#1A2335] p-6 rounded-2xl border border-[#2A3547] hover:border-[#3E60C1] transition-colors"
          >
            <div className="text-[#B8C7E0] mb-2">Total Entries</div>
            <div className="text-3xl font-bold text-[#5983FC]">{journalEntries.length}</div>
            <div className="h-1 bg-gradient-to-r from-[#5983FC] to-[#3E60C1] mt-4 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1A2335] p-8 rounded-2xl border border-[#2A3547] hover:border-[#3E60C1] transition-colors"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Mood Trends</h3>
            <MoodChart />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1A2335] p-8 rounded-2xl border border-[#2A3547] hover:border-[#3E60C1] transition-colors"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Entries</h3>
              <Link 
                to="/journal" 
                className="text-[#5983FC] hover:text-[#3E60C1] transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {journalEntries.slice(0, 4).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <JournalPreview entry={entry} />
                </motion.div>
              ))}
              {journalEntries.length === 0 && (
                <p className="text-[#B8C7E0] text-center py-4">No entries yet</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;