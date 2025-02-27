import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchMoodLogs, fetchMoodTrends } from './moodSlice';
import MoodChart from './MoodChart';
import { FaCalendarAlt, FaChartLine, FaThermometerHalf, FaStickyNote, FaRegSmile, FaRegSadTear, FaRegMeh } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

const MoodLog = () => {
  const dispatch = useDispatch();
  const { logs, status, error, trends } = useSelector(state => state.mood);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [moodFilter, setMoodFilter] = useState('all');
  const [isCalendarView, setIsCalendarView] = useState(false);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMoodLogs());
      dispatch(fetchMoodTrends());
    }
  }, [status, dispatch]);
  
  // Refresh mood logs when journal entries are updated
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      dispatch(fetchMoodLogs());
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(refreshInterval);
  }, [dispatch]);
  
  const getMoodIcon = (mood) => {
    const positiveMoods = ['happy', 'excited', 'loving', 'optimistic', 'proud', 'grateful', 'relieved', 'amused', 'calm', 'caring'];
    const neutralMoods = ['neutral', 'surprised', 'curious', 'confused'];
    
    if (positiveMoods.includes(mood)) {
      return <FaRegSmile className="text-emerald-400" />;
    } else if (neutralMoods.includes(mood)) {
      return <FaRegMeh className="text-blue-400" />;
    } else {
      return <FaRegSadTear className="text-red-400" />;
    }
  };
  
  const getMoodColor = (mood) => {
    const positiveMoods = ['happy', 'excited', 'loving', 'optimistic', 'proud', 'grateful', 'relieved', 'amused', 'calm', 'caring'];
    const neutralMoods = ['neutral', 'surprised', 'curious', 'confused'];
    
    if (positiveMoods.includes(mood)) {
      return 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400';
    } else if (neutralMoods.includes(mood)) {
      return 'bg-blue-400/10 border-blue-400/20 text-blue-400';
    } else {
      return 'bg-red-400/10 border-red-400/20 text-red-400';
    }
  };
  
  const getIntensityColor = (intensity) => {
    if (intensity >= 8) return 'bg-emerald-400/20';
    if (intensity >= 6) return 'bg-blue-400/20';
    if (intensity >= 4) return 'bg-yellow-400/20';
    if (intensity >= 2) return 'bg-orange-400/20';
    return 'bg-red-400/20';
  };
  
  // Group trends by date
  const trendsByDate = logs.reduce((acc, log) => {
    const date = log.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {});
  
  // Filter and sort dates based on selected period
  const filterByPeriod = () => {
    const now = new Date();
    let filteredDates = Object.keys(trendsByDate).sort((a, b) => new Date(b) - new Date(a));
    
    if (selectedPeriod === 'week') {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      filteredDates = filteredDates.filter(date => new Date(date) >= oneWeekAgo);
    } else if (selectedPeriod === 'month') {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filteredDates = filteredDates.filter(date => new Date(date) >= oneMonthAgo);
    } else if (selectedPeriod === 'year') {
      const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      filteredDates = filteredDates.filter(date => new Date(date) >= oneYearAgo);
    }
    
    return filteredDates;
  };
  
  const filteredDates = filterByPeriod();
  
  // Further filter by mood if a specific mood is selected
  const filteredLogs = filteredDates.flatMap(date => {
    if (moodFilter === 'all') {
      return trendsByDate[date];
    } else {
      return trendsByDate[date].filter(log => log.mood === moodFilter);
    }
  });
  
  // Get unique moods for filter dropdown
  const uniqueMoods = [...new Set(logs.map(log => log.mood))];
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0F172A] ml-64">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse text-[#B8C7E0]">Loading mood data...</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-[#0F172A] ml-64">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="h-96 flex items-center justify-center flex-col">
            <p className="text-[#B8C7E0] mb-4">Error: {error}</p>
            <p className="text-[#5983FC] text-sm">Start journaling to track your mood!</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Process the data for the chart
  const moodData = trends.reduce((acc, log) => {
    const date = new Date(log.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      mood: log.mood,
      intensity: log.intensity
    });
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(moodData),
    datasets: [{
      label: 'Mood Intensity',
      data: Object.values(moodData).map(logs => {
        // Average intensity if multiple moods per day
        return logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length;
      }),
      borderColor: '#5983FC',
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0F172A] ml-64">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Mood Log</h1>
          <p className="text-[#B8C7E0]">
            Track and visualize your emotional journey over time
          </p>
        </motion.div>
        
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1A2335] p-6 rounded-xl border border-[#2A3547] mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsCalendarView(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${!isCalendarView 
                  ? 'bg-[#3E60C1] text-white' 
                  : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'}`}
              >
                <FaChartLine className="inline mr-2" /> Chart View
              </button>
              <button 
                onClick={() => setIsCalendarView(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${isCalendarView 
                  ? 'bg-[#3E60C1] text-white' 
                  : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'}`}
              >
                <FaCalendarAlt className="inline mr-2" /> List View
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-[#0F172A] border border-[#2A3547] text-[#B8C7E0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#5983FC]"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
              
              <select 
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="bg-[#0F172A] border border-[#2A3547] text-[#B8C7E0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#5983FC]"
              >
                <option value="all">All Moods</option>
                {uniqueMoods.map(mood => (
                  <option key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0F172A] rounded-xl p-4 border border-[#2A3547]">
              <div className="flex items-center">
                <div className="bg-[#3E60C1]/20 p-2 rounded-lg mr-3">
                  <FaCalendarAlt className="text-[#5983FC]" />
                </div>
                <div>
                  <p className="text-[#B8C7E0] text-sm">Entries</p>
                  <p className="text-white font-semibold">{filteredDates.length} days</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0F172A] rounded-xl p-4 border border-[#2A3547]">
              <div className="flex items-center">
                <div className="bg-[#3E60C1]/20 p-2 rounded-lg mr-3">
                  <FaRegSmile className="text-[#5983FC]" />
                </div>
                <div>
                  <p className="text-[#B8C7E0] text-sm">Most Common</p>
                  <p className="text-white font-semibold">
                    {uniqueMoods.length > 0 
                      ? uniqueMoods[0].charAt(0).toUpperCase() + uniqueMoods[0].slice(1) 
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0F172A] rounded-xl p-4 border border-[#2A3547]">
              <div className="flex items-center">
                <div className="bg-[#3E60C1]/20 p-2 rounded-lg mr-3">
                  <FaThermometerHalf className="text-[#5983FC]" />
                </div>
                <div>
                  <p className="text-[#B8C7E0] text-sm">Avg. Intensity</p>
                  <p className="text-white font-semibold">
                    {logs.length > 0 
                      ? (logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length).toFixed(1) 
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0F172A] rounded-xl p-4 border border-[#2A3547]">
              <div className="flex items-center">
                <div className="bg-[#3E60C1]/20 p-2 rounded-lg mr-3">
                  <FaStickyNote className="text-[#5983FC]" />
                </div>
                <div>
                  <p className="text-[#B8C7E0] text-sm">Total Moods</p>
                  <p className="text-white font-semibold">{filteredLogs.length}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Chart or List View */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A2335] p-6 rounded-xl border border-[#2A3547]"
        >
          {!isCalendarView ? (
            <div className="h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDates.map(date => (
                <motion.div 
                  key={date}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0F172A] p-4 rounded-xl border border-[#2A3547]"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-medium">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {trendsByDate[date]
                      .filter(log => moodFilter === 'all' || log.mood === moodFilter)
                      .map((log, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getMoodColor(log.mood)}`}
                        >
                          <span>{getMoodIcon(log.mood)}</span>
                          <span className="capitalize">{log.mood}</span>
                          <div className={`ml-2 px-2 py-1 rounded-full text-xs ${getIntensityColor(log.intensity)}`}>
                            {log.intensity}/10
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              ))}
              
              {filteredDates.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[#B8C7E0]">No mood data found for the selected filters.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MoodLog; 