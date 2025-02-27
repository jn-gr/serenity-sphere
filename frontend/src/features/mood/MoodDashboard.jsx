import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FaChartPie, FaChartLine, FaCalendarAlt, FaPlus, 
  FaRegSmile, FaRegSadTear, FaRegMeh, FaChartBar
} from 'react-icons/fa';
import { fetchMoodLogs, fetchMoodAnalytics, fetchMoodSummary } from './moodSlice';
import MoodChart from './components/MoodChart';
import MoodTimeline from './components/MoodTimeline';
import MoodDistribution from './components/MoodDistribution';
import MoodForm from './components/MoodForm';
import MoodCalendar from './components/MoodCalendar';
import MoodIntensity from './components/MoodIntensity';

const MoodDashboard = () => {
  const dispatch = useDispatch();
  const { logs, analytics, summary, status, analyticsStatus, summaryStatus } = useSelector(state => state.mood);
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('week');
  const [showMoodForm, setShowMoodForm] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMoodLogs());
    }
    if (analyticsStatus === 'idle') {
      dispatch(fetchMoodAnalytics(period));
    }
    if (summaryStatus === 'idle') {
      dispatch(fetchMoodSummary());
    }
  }, [status, analyticsStatus, summaryStatus, dispatch]);

  useEffect(() => {
    dispatch(fetchMoodAnalytics(period));
  }, [period, dispatch]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const getMoodIcon = (mood) => {
    switch(mood) {
      case 'happy':
      case 'excited':
      case 'amused':
      case 'loving':
      case 'optimistic':
      case 'caring':
      case 'proud':
      case 'grateful':
      case 'relieved':
      case 'calm':
        return <FaRegSmile className="text-green-500" />;
      case 'sad':
      case 'anxious':
      case 'angry':
      case 'nervous':
      case 'remorseful':
      case 'embarrassed':
      case 'disappointed':
      case 'grieving':
      case 'disgusted':
      case 'annoyed':
      case 'disapproving':
        return <FaRegSadTear className="text-red-500" />;
      default:
        return <FaRegMeh className="text-gray-500" />;
    }
  };

  const getMoodColor = (mood) => {
    const positiveColors = ['happy', 'excited', 'amused', 'loving', 'optimistic', 'caring', 'proud', 'grateful', 'relieved', 'calm'];
    const negativeColors = ['sad', 'anxious', 'angry', 'nervous', 'remorseful', 'embarrassed', 'disappointed', 'grieving', 'disgusted', 'annoyed', 'disapproving'];
    
    if (positiveColors.includes(mood)) return 'bg-green-100 text-green-800';
    if (negativeColors.includes(mood)) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="ml-64 min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mood Tracking</h1>
            <p className="text-[#B8C7E0]">Monitor and analyze your emotional well-being</p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white'
                  : 'bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547]'
              } transition-all duration-200`}
            >
              <FaChartPie size={16} />
              <span>Overview</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                activeTab === 'timeline' 
                  ? 'bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white'
                  : 'bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547]'
              } transition-all duration-200`}
            >
              <FaChartLine size={16} />
              <span>Timeline</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                activeTab === 'calendar' 
                  ? 'bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white'
                  : 'bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547]'
              } transition-all duration-200`}
            >
              <FaCalendarAlt size={16} />
              <span>Calendar</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMoodForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5983FC] text-white hover:bg-[#3E60C1] transition-all duration-200"
            >
              <FaPlus size={16} />
              <span>Log Mood</span>
            </motion.button>
          </div>
        </div>
        
        {/* Period selector */}
        {activeTab !== 'calendar' && (
          <div className="flex justify-end mb-8">
            <div className="bg-[#1A2335] rounded-xl p-1 flex">
              <button
                onClick={() => handlePeriodChange('week')}
                className={`px-4 py-2 rounded-lg ${
                  period === 'week' 
                    ? 'bg-[#2A3547] text-white' 
                    : 'text-[#B8C7E0] hover:text-white'
                } transition-colors`}
              >
                Week
              </button>
              <button
                onClick={() => handlePeriodChange('month')}
                className={`px-4 py-2 rounded-lg ${
                  period === 'month' 
                    ? 'bg-[#2A3547] text-white' 
                    : 'text-[#B8C7E0] hover:text-white'
                } transition-colors`}
              >
                Month
              </button>
              <button
                onClick={() => handlePeriodChange('year')}
                className={`px-4 py-2 rounded-lg ${
                  period === 'year' 
                    ? 'bg-[#2A3547] text-white' 
                    : 'text-[#B8C7E0] hover:text-white'
                } transition-colors`}
              >
                Year
              </button>
            </div>
          </div>
        )}
        
        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mood Distribution */}
            <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Mood Distribution</h2>
              {analytics && <MoodDistribution data={analytics.mood_counts} />}
            </div>
            
            {/* Mood Balance */}
            <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Mood Balance</h2>
              {analytics && (
                <div className="flex flex-col items-center">
                  <MoodChart data={analytics.mood_balance} />
                  <div className="grid grid-cols-3 gap-4 w-full mt-6">
                    <div className="flex flex-col items-center">
                      <div className="text-green-500 mb-2">
                        <FaRegSmile size={24} />
                      </div>
                      <p className="text-[#B8C7E0] text-sm">Positive</p>
                      <p className="text-white font-semibold">
                        {analytics.mood_balance.positive 
                          ? `${(analytics.mood_balance.positive * 100).toFixed(0)}%` 
                          : '0%'}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-red-500 mb-2">
                        <FaRegSadTear size={24} />
                      </div>
                      <p className="text-[#B8C7E0] text-sm">Negative</p>
                      <p className="text-white font-semibold">
                        {analytics.mood_balance.negative 
                          ? `${(analytics.mood_balance.negative * 100).toFixed(0)}%` 
                          : '0%'}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-gray-500 mb-2">
                        <FaRegMeh size={24} />
                      </div>
                      <p className="text-[#B8C7E0] text-sm">Neutral</p>
                      <p className="text-white font-semibold">
                        {analytics.mood_balance.neutral 
                          ? `${(analytics.mood_balance.neutral * 100).toFixed(0)}%` 
                          : '0%'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mood Intensity */}
            <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Mood Intensity</h2>
              {analytics && <MoodIntensity data={analytics.avg_intensity} />}
            </div>
            
            {/* Recent Moods */}
            <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Moods</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {logs && logs.slice(0, 5).map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-center justify-between bg-[#0F172A] p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getMoodIcon(log.mood)}
                      </div>
                      <div>
                        <p className="text-white capitalize">{log.mood}</p>
                        <p className="text-[#B8C7E0] text-sm">
                          {new Date(log.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs ${getMoodColor(log.mood)}`}>
                        Intensity: {log.intensity}
                      </span>
                    </div>
                  </div>
                ))}
                {(!logs || logs.length === 0) && (
                  <p className="text-[#B8C7E0] text-center py-4">No mood logs yet</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Mood Timeline</h2>
            {analytics && <MoodTimeline data={analytics.mood_timeline} />}
          </div>
        )}
        
        {activeTab === 'calendar' && (
          <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Mood Calendar</h2>
            {logs && <MoodCalendar logs={logs} />}
          </div>
        )}
        
        {/* Mood Form Modal */}
        {showMoodForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Log Your Mood</h2>
                <button 
                  onClick={() => setShowMoodForm(false)}
                  className="text-[#B8C7E0] hover:text-white"
                >
                  &times;
                </button>
              </div>
              <MoodForm onClose={() => setShowMoodForm(false)} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodDashboard;