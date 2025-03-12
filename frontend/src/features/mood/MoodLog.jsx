import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchMoodLogs, fetchMoodTrends } from './moodSlice';
import { 
  FaCalendarAlt, 
  FaChartLine, 
  FaThermometerHalf, 
  FaStickyNote, 
  FaRegSmile, 
  FaRegSadTear, 
  FaRegMeh,
  FaChartBar,
  FaTable,
  FaChartPie,
  FaChartArea
} from 'react-icons/fa';
import MoodChart from './MoodChart';

// Import the visualization components
import MoodRadarChart from './components/MoodRadarChart';
import MoodCalendarHeatmap from './components/MoodCalendarHeatmap';
import MoodDistributionChart from './components/MoodDistributionChart';

// Temporarily comment out the imported components that might be causing issues
// import MoodRadarChart from './components/MoodRadarChart';
// import MoodCalendarHeatmap from './components/MoodCalendarHeatmap';
// import MoodDistributionChart from './components/MoodDistributionChart';

const MoodLog = () => {
  const dispatch = useDispatch();
  const { logs, status, error, trends } = useSelector(state => state.mood);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [moodFilter, setMoodFilter] = useState('all');
  const [selectedView, setSelectedView] = useState('line');
  const [selectedChart, setSelectedChart] = useState('line');
  
  // Debug log - this will help see if we're even getting to this component
  console.log("MoodLog rendering, status:", status, "logs:", logs?.length || 0);
  
  useEffect(() => {
    // Fetch mood data when component mounts
    console.log("Dispatching fetch actions");
    dispatch(fetchMoodLogs());
    dispatch(fetchMoodTrends());
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

  // Safety check for logs
  const safetyLogs = logs || [];
  const safetyTrends = trends || [];
  
  // Group trends by date
  const trendsByDate = safetyLogs.reduce((acc, log) => {
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
  const uniqueMoods = [...new Set(safetyLogs.map(log => log.mood))];

  // Get most common mood
  const getMostCommonMood = () => {
    if (uniqueMoods.length === 0) return "N/A";
    
    const moodCounts = {};
    safetyLogs.forEach(log => {
      if (!moodCounts[log.mood]) {
        moodCounts[log.mood] = 0;
      }
      moodCounts[log.mood]++;
    });
    
    const sortedMoods = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedMoods.length > 0) {
      const topMood = sortedMoods[0][0];
      return topMood.charAt(0).toUpperCase() + topMood.slice(1);
    }
    
    return "N/A";
  };

  // Calculate average intensity
  const getAverageIntensity = () => {
    if (filteredLogs.length === 0) return "N/A";
    
    const sum = filteredLogs.reduce((acc, log) => acc + log.intensity, 0);
    return (sum / filteredLogs.length).toFixed(1);
  };
  
  // Handle loading state with clear message
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0F172A] ml-64 flex items-center justify-center">
        <div className="animate-pulse text-[#B8C7E0] text-xl">
          Loading mood data...
        </div>
      </div>
    );
  }

  // Handle error state
  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-[#0F172A] ml-64 flex items-center justify-center">
        <div className="text-red-400 text-xl">
          Error loading mood data: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0F172A] ml-64">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Mood Analytics</h1>
          <p className="text-[#B8C7E0]">
            Track and visualize your emotional journey over time
          </p>
        </div>
        
        {/* Controls */}
        <div className="bg-[#1A2335] p-6 rounded-xl border border-[#2A3547] mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setSelectedView('chart')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${selectedView === 'chart' 
                  ? 'bg-[#3E60C1] text-white' 
                  : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'}`}
              >
                <FaChartLine className="inline mr-1" /> Charts
              </button>
              <button 
                onClick={() => setSelectedView('list')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${selectedView === 'list' 
                  ? 'bg-[#3E60C1] text-white' 
                  : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'}`}
              >
                <FaTable className="inline mr-1" /> List View
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
                  <p className="text-white font-semibold">{getMostCommonMood()}</p>
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
                  <p className="text-white font-semibold">{getAverageIntensity()}</p>
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
        </div>
        
        {/* Main content area */}
        <div className="bg-[#1A2335] p-6 rounded-xl border border-[#2A3547]">
          {selectedView === 'chart' ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Mood Visualizations</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedChart('line')}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedChart === 'line' 
                        ? 'bg-[#3E60C1] text-white' 
                        : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'
                    }`}
                    title="Line Chart"
                  >
                    <FaChartLine />
                  </button>
                  <button
                    onClick={() => setSelectedChart('radar')}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedChart === 'radar' 
                        ? 'bg-[#3E60C1] text-white' 
                        : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'
                    }`}
                    title="Radar Chart"
                  >
                    <FaChartPie />
                  </button>
                  <button
                    onClick={() => setSelectedChart('distribution')}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedChart === 'distribution' 
                        ? 'bg-[#3E60C1] text-white' 
                        : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'
                    }`}
                    title="Distribution Chart"
                  >
                    <FaChartBar />
                  </button>
                  <button
                    onClick={() => setSelectedChart('calendar')}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedChart === 'calendar' 
                        ? 'bg-[#3E60C1] text-white' 
                        : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'
                    }`}
                    title="Calendar Heatmap"
                  >
                    <FaCalendarAlt />
                  </button>
                </div>
              </div>
              
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#2A3547]">
                {selectedChart === 'line' && <MoodChart />}
                {selectedChart === 'radar' && <MoodRadarChart trends={trends} />}
                {selectedChart === 'distribution' && <MoodDistributionChart trends={trends} />}
                {selectedChart === 'calendar' && <MoodCalendarHeatmap trends={trends} />}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-4">Mood Entries List</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredDates.length > 0 ? (
                  filteredDates.map(date => (
                    <div 
                      key={date}
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
                      {trendsByDate[date][0]?.notes && (
                        <p className="mt-2 text-sm text-[#B8C7E0] italic">
                          "{trendsByDate[date][0].notes}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#B8C7E0]">No mood data found for the selected filters.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Insights section */}
        <div className="mt-8 bg-[#1A2335] p-6 rounded-xl border border-[#2A3547]">
          <h2 className="text-xl font-semibold text-white mb-4">Mood Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0F172A] p-5 rounded-xl border border-[#2A3547]">
              <h3 className="text-[#5983FC] font-medium mb-3">Your Mood Pattern</h3>
              <p className="text-[#B8C7E0]">
                {filteredLogs.length > 5 ? (
                  <>
                    Based on your {filteredLogs.length} mood entries, you tend to experience 
                    <span className="text-white font-medium"> {getMostCommonMood()} </span> 
                    moods most frequently. Your average mood intensity is 
                    <span className="text-white font-medium"> {getAverageIntensity()}/10</span>.
                  </>
                ) : (
                  <>
                    Add more mood entries to see insights about your mood patterns.
                  </>
                )}
              </p>
            </div>
            
            <div className="bg-[#0F172A] p-5 rounded-xl border border-[#2A3547]">
              <h3 className="text-[#5983FC] font-medium mb-3">Mood Variability</h3>
              <p className="text-[#B8C7E0]">
                {filteredLogs.length > 5 ? (
                  <>
                    Your mood shows {uniqueMoods.length <= 2 ? 'low' : uniqueMoods.length <= 5 ? 'moderate' : 'high'} variability 
                    with {uniqueMoods.length} different moods recorded in this period. 
                    {uniqueMoods.length > 3 && (
                      <span> You experience a diverse range of emotions.</span>
                    )}
                  </>
                ) : (
                  <>
                    Track more moods to see insights about your emotional variability.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodLog;