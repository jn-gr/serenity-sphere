// frontend/src/features/home/Home.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaBook, FaCalendarDay, FaRegSmile, FaRegSadTear, FaEllipsisH, FaChartPie, FaUser } from 'react-icons/fa';
import '../../styles/layouts/_home.css';
import JournalPreview from '../journal/JournalPreview';
import { fetchJournalEntries } from '../journal/journalSlice';
import HomeMoodChart from '../mood/HomeMoodChart';
import HomeMoodDistributionChart from '../mood/HomeMoodDistributionChart';
import { fetchMoodTrends } from '../mood/moodSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const journalEntries = useSelector(state => state.journal.entries);
  const journalStatus = useSelector(state => state.journal.status);
  const { trends, status: moodStatus } = useSelector(state => state.mood);
  const [greeting, setGreeting] = useState('');
  const [avatar, setAvatar] = useState(null);
  
  const today = new Date().toISOString().split('T')[0];
  const todaysEntry = journalEntries.find(entry => 
    new Date(entry.date).toISOString().split('T')[0] === today
  );

  // Effect to set the greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Effect to fetch data and update avatar when user state changes
  useEffect(() => {
    if (isAuthenticated) {
      if (journalStatus === 'idle') {
        dispatch(fetchJournalEntries());
      }
      if (moodStatus === 'idle') {
        dispatch(fetchMoodTrends());
      }
      
      // Update avatar whenever user object changes
      updateAvatar();
    }
  }, [isAuthenticated, journalStatus, moodStatus, dispatch, user]);
  
  // Separate function to update avatar to keep the code clean
  const updateAvatar = () => {
    if (user?.username) {
      setAvatar(`https://ui-avatars.com/api/?name=${user.username}&background=5983FC&color=fff`);
    } else {
      setAvatar(null);
    }
  };

  // Get most common and least common moods
  const getMoodStats = () => {
    if (!trends || trends.length === 0) {
      return { mostCommon: 'N/A', leastCommon: 'N/A' };
    }
    
    const moodCounts = {};
    trends.forEach(item => {
      if (!moodCounts[item.mood]) {
        moodCounts[item.mood] = 0;
      }
      moodCounts[item.mood]++;
    });
    
    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
    
    const mostCommon = sortedMoods.length > 0 
      ? sortedMoods[0][0].charAt(0).toUpperCase() + sortedMoods[0][0].slice(1)
      : 'N/A';
    
    const leastCommon = sortedMoods.length > 1
      ? sortedMoods[sortedMoods.length - 1][0].charAt(0).toUpperCase() + sortedMoods[sortedMoods.length - 1][0].slice(1)
      : 'N/A';
    
    return { mostCommon, leastCommon };
  };
  
  const { mostCommon, leastCommon } = getMoodStats();

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
        {/* Welcome Header with Stats */}
        <div className="mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div className="flex items-center">
              {avatar ? (
                <div className="h-14 w-14 rounded-full border-2 border-[#2A3547] overflow-hidden mr-4 bg-[#1A2335] flex-shrink-0">
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                    key={user?.id || 'default'} // Add key to force re-render when user changes
                  />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-full bg-[#3E60C1]/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <FaUser className="text-[#5983FC]" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {greeting}, {user?.username || 'there'}
                </h1>
                <p className="text-[#B8C7E0] mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="bg-[#1A2335] rounded-xl border border-[#2A3547] p-3 flex items-center">
                <div className="bg-[#3E60C1]/20 p-2 rounded-lg mr-3">
                  <FaBook className="text-[#5983FC]" />
                </div>
                <div>
                  <p className="text-[#B8C7E0] text-xs">Journal Entries</p>
                  <p className="text-white font-semibold">{journalEntries.length}</p>
                </div>
              </div>
              
              <div className="bg-[#1A2335] rounded-xl border border-[#2A3547] p-3 flex items-center">
                <div className="bg-[#3E60C1]/20 p-2 rounded-lg mr-3">
                  <FaCalendarDay className="text-[#5983FC]" />
                </div>
                <div>
                  <p className="text-[#B8C7E0] text-xs">Streak</p>
                  <p className="text-white font-semibold">
                    {todaysEntry ? "1 day" : "0 days"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          <Link to="/journal" className="col-span-1">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`h-full flex items-center justify-center gap-3 p-4 rounded-xl ${
                todaysEntry 
                  ? "bg-[#1A2335] border border-[#2A3547] text-[#B8C7E0]" 
                  : "bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white"
              }`}
            >
              <FaBook size={18} />
              <span className="font-medium">
                {todaysEntry ? "Edit Today's Journal" : "Write Today's Journal"}
              </span>
            </motion.div>
          </Link>
          
          <Link to="/mood" className="col-span-1">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full flex items-center justify-center gap-3 p-4 rounded-xl bg-[#1A2335] border border-[#2A3547] text-[#B8C7E0]"
            >
              <FaRegSmile size={18} />
              <span className="font-medium">View your Mood Trends</span>
            </motion.div>
          </Link>

          <Link to="/profile" className="col-span-1">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full flex items-center justify-center gap-3 p-4 rounded-xl bg-[#1A2335] border border-[#2A3547] text-[#B8C7E0]"
            >
              {avatar ? (
                <div className="h-6 w-6 rounded-full overflow-hidden">
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                    key={`small-${user?.id || 'default'}`} // Add key to force re-render when user changes
                  />
                </div>
              ) : (
                <FaUser size={18} />
              )}
              <span className="font-medium">Update Profile</span>
            </motion.div>
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Journal Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#3E60C1]/20 p-2 rounded-lg">
                    <FaBook className="text-[#5983FC]" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Journal</h2>
                </div>
                <Link to="/journal">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-[#0F172A] text-[#B8C7E0] text-sm hover:bg-[#2A3547] transition-colors"
                  >
                    View All
                  </motion.button>
                </Link>
              </div>
              
              <AnimatePresence mode="wait">
                {todaysEntry ? (
                  <motion.div
                    key="todaysEntry"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-[#0F172A] rounded-xl p-4 mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[#5983FC] font-medium">Today's Entry</h3>
                        <span className="text-xs text-[#B8C7E0] bg-[#1A2335] px-2 py-1 rounded-full">
                          {new Date(todaysEntry.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-[#B8C7E0] line-clamp-3 mb-3">
                        {todaysEntry.content}
                      </p>
                      
                      {todaysEntry.emotions && todaysEntry.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {todaysEntry.emotions.slice(0, 3).map((emotion, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-[#3E60C1]/20 text-[#5983FC] px-2 py-1 rounded-full"
                            >
                              {emotion[0]}: {(emotion[1] * 100).toFixed(0)}%
                            </span>
                          ))}
                          {todaysEntry.emotions.length > 3 && (
                            <span className="text-xs bg-[#1A2335] text-[#B8C7E0] px-2 py-1 rounded-full flex items-center">
                              <FaEllipsisH size={10} className="mr-1" />
                              {todaysEntry.emotions.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      <Link to="/journal">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 mt-4 rounded-xl bg-[#2A3547] text-[#B8C7E0] hover:bg-[#3A4557] transition-colors"
                        >
                          Edit Today's Entry
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="noEntry"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#0F172A] rounded-xl p-6 mb-6 text-center"
                  >
                    <div className="inline-flex justify-center items-center w-16 h-16 bg-[#1A2335] rounded-full mb-4">
                      <FaBook size={24} className="text-[#5983FC]" />
                    </div>
                    <h3 className="text-white font-medium mb-2">No Journal Entry Today</h3>
                    <p className="text-[#B8C7E0] mb-4">
                      Take a moment to reflect on your day and record your thoughts.
                    </p>
                    <Link to="/journal">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white"
                      >
                        Write Today's Entry
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {journalEntries.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-[#5983FC] font-medium">Recent Entries</h3>
                    <div className="h-[1px] flex-grow bg-[#2A3547]"></div>
                  </div>
                  <div className="space-y-2">
                    {journalEntries.slice(0, 3).map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <JournalPreview entry={entry} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Mood Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#3E60C1]/20 p-2 rounded-lg">
                    <FaRegSmile className="text-[#5983FC]" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Mood Trends</h2>
                </div>
                <Link to="/mood">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-[#0F172A] text-[#B8C7E0] text-sm hover:bg-[#2A3547] transition-colors"
                  >
                    View All
                  </motion.button>
                </Link>
              </div>
              
              {/* Mood Chart Visualization */}
              <div className="bg-[#0F172A] rounded-xl p-4 mb-4">
                <h3 className="text-white text-sm font-medium mb-2 flex items-center">
                  <FaChartLine className="text-[#5983FC] mr-2" />
                  <span>Weekly Mood Trends</span>
                </h3>
                <HomeMoodChart />
              </div>
              
              {/* Mood Distribution Chart */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="col-span-1 bg-[#0F172A] rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FaChartPie className="text-[#5983FC] mr-2" />
                    <h3 className="text-white text-sm font-medium">Mood Distribution</h3>
                  </div>
                  <HomeMoodDistributionChart />
                </div>
                
                <div className="col-span-1 bg-[#0F172A] rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FaRegSmile className="text-[#5983FC] mr-2" />
                    <h3 className="text-white text-sm font-medium">Mood Stats</h3>
                  </div>
                  <div className="grid grid-rows-2 gap-3 h-36">
                    <div className="bg-[#1A2335] rounded-lg p-3 flex items-center">
                      <div className="text-[#5983FC] mr-3">
                        <FaRegSmile size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-[#B8C7E0]">Most Common</p>
                        <p className="text-white text-sm font-medium">{mostCommon}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#1A2335] rounded-lg p-3 flex items-center">
                      <div className="text-[#5983FC] mr-3">
                        <FaRegSadTear size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-[#B8C7E0]">Least Common</p>
                        <p className="text-white text-sm font-medium">{leastCommon}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;