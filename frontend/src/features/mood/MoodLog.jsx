import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchMoodLogs, fetchMoodTrends } from './moodSlice';
import { fetchNotifications, addPositiveReinforcement } from '../notifications/notificationSlice';
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
// Import icons for recommendation components
import { FaLightbulb, FaArrowTrendUp, FaArrowTrendDown, FaMinus, FaExclamation } from 'react-icons/fa6';
import { analyzeMoodTrends } from './moodAnalysisUtils';
import MoodChart from './MoodChart';

// Import the visualization components
import MoodRadarChart from './components/MoodRadarChart';
import MoodCalendarHeatmap from './components/MoodCalendarHeatmap';
import MoodDistributionChart from './components/MoodDistributionChart';

// Import the NotificationCenter component
import NotificationCenter from '../notifications/NotificationCenter';
import PositiveReinforcement from '../../components/PositiveReinforcement';
import MoodCausePrompt from '../../components/MoodCausePrompt';
import { useLocation } from 'react-router-dom';

// New component for mood recommendations
const MoodRecommendation = ({ logs, selectedPeriod }) => {
  // Skip if no logs
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#B8C7E0]">No mood data available for analysis.</p>
      </div>
    );
  }

  const analysis = analyzeMoodTrends(logs, selectedPeriod);

  if (analysis.status === 'insufficient_data') {
    return (
      <div className="bg-[#0F172A] p-5 rounded-xl border border-[#2A3547]">
        <div className="flex items-start">
          <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
            <FaLightbulb className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">Keep Tracking Your Moods</h3>
            <p className="text-[#B8C7E0]">{analysis.message || "We need more data to provide personalized recommendations."}</p>
            <p className="text-[#B8C7E0] mt-3">{analysis.recommendation}</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine icon based on trend
  let TrendIcon = FaMinus;
  let iconColor = "text-blue-400";
  let bgColor = "bg-blue-500/20";

  if (analysis.trendStrength.includes('improving')) {
    TrendIcon = FaArrowTrendUp;
    iconColor = "text-emerald-400";
    bgColor = "bg-emerald-500/20";
  } else if (analysis.trendStrength.includes('declining')) {
    TrendIcon = FaArrowTrendDown;
    iconColor = "text-red-400";
    bgColor = "bg-red-500/20";
  }

  // If sudden change, override with alert icon
  if (analysis.suddenChange) {
    TrendIcon = FaExclamation;
    iconColor = "text-amber-400";
    bgColor = "bg-amber-500/20";
  }

  return (
    <div className="bg-[#0F172A] p-5 rounded-xl border border-[#2A3547]">
      <div className="flex items-start">
        <div className={`${bgColor} p-3 rounded-lg mr-4`}>
          <TrendIcon className={iconColor} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium mb-1">Your Mood Insight</h3>
          <p className="text-[#B8C7E0] mb-4">{analysis.insight}</p>

          <div className="border-t border-[#2A3547] my-4"></div>

          <h4 className="text-[#5983FC] font-medium mb-2">Recommendation</h4>
          <p className="text-[#B8C7E0] mb-4">{analysis.recommendation}</p>

          <h4 className="text-[#5983FC] font-medium mb-2">Suggested Activities</h4>
          <ul className="space-y-2">
            {analysis.activities.map((activity, index) => (
              <li key={index} className="flex items-start">
                <FaLightbulb className="text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                <span className="text-[#B8C7E0]">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Update the analyzeMoodTrend function
const analyzeMoodTrend = (logs) => {
  if (logs.length < 3) return null;
  
  const moodCategories = {
    positive: ['happy', 'excited', 'optimistic', 'calm'],
    neutral: ['neutral'],
    negative: ['anxious', 'sad', 'angry']
  };

  const getCategory = (mood) => {
    for (const [category, moods] of Object.entries(moodCategories)) {
      if (moods.includes(mood)) return category;
    }
    return 'neutral';
  };

  const currentMood = logs[logs.length-1].mood;
  const previousMood = logs[logs.length-2]?.mood;
  const currentCategory = getCategory(currentMood);
  const previousCategory = getCategory(previousMood);

  // Only consider numerical trend if category changed
  const moodValues = { positive: 1, neutral: 0, negative: -1 };
  const trend = moodValues[currentCategory] - moodValues[previousCategory];

  return {
    trend,
    currentMood,
    previousMood,
    currentCategory,
    previousCategory
  };
};

// Add this function after analyzeMoodTrend
const detectNegativeTrend = (logs) => {
  if (!logs || logs.length < 5) return false;
  
  // Get the latest 5 mood entries (including most recent 3 negatives)
  const recentLogs = logs.slice(-5);
  
  // Define the mood values directly from your MoodChart
  const moodValues = {
    // Very positive moods (8-10)
    'happy': 9, 'excited': 9, 'loving': 9, 'optimistic': 8,
    'proud': 8, 'grateful': 8, 'relieved': 8, 'amused': 8,
    
    // Positive moods (6-7)
    'calm': 7, 'caring': 7, 'surprised': 6, 'curious': 6,
    
    // Neutral moods (4-5)
    'neutral': 5, 'confused': 4,
    
    // Negative moods (2-3)
    'anxious': 3, 'nervous': 3, 'embarrassed': 3, 'disappointed': 3,
    'annoyed': 3, 'disapproving': 2, 'sad': 2,
    
    // Very negative moods (0-1)
    'angry': 1, 'grieving': 1, 'disgusted': 1, 'remorseful': 1
  };
  
  // Check if the 3 most recent entries are negative
  const recentNegative = recentLogs.slice(-3).every(log => 
    (moodValues[log.mood] || 5) < 4
  );
  
  // Check if there were positive entries before the negative ones
  const hadPositive = recentLogs.slice(0, 2).some(log => 
    (moodValues[log.mood] || 5) >= 6
  );
  
  // Return true if we had positive entries followed by negative ones
  return recentNegative && hadPositive;
};

const MoodLog = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { logs, status, error, trends } = useSelector(state => state.mood);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [moodFilter, setMoodFilter] = useState('all');
  const [selectedView, setSelectedView] = useState('chart');
  const [selectedChart, setSelectedChart] = useState('line');
  const [activeNotification, setActiveNotification] = useState(null);

  // Debug log - this will help see if we're even getting to this component
  console.log("MoodLog rendering, status:", status, "logs:", logs?.length || 0);

  useEffect(() => {
    // Fetch mood data when component mounts
    console.log("Dispatching fetch actions");
    dispatch(fetchMoodLogs());
    dispatch(fetchMoodTrends());
    dispatch(fetchNotifications());
    
    // Reset notification cooldown to ensure notifications appear
    localStorage.removeItem('lastNegativeNotification');
    
    // Add this temporary testing code
    fetch('/api/notifications/mood/')
      .then(response => response.json())
      .then(data => {
        console.log("Notification API direct test:", data);
        console.log("Number of notifications:", data.length || 0);
      })
      .catch(err => console.error("Error fetching notifications directly:", err));
  }, [dispatch]);

  // Add a new useEffect for positive notifications on mount
  useEffect(() => {
    if (status === 'succeeded' && logs && logs.length > 0) {
      const latestPositive = isLatestMoodPositive();
      console.log("Is latest mood positive?", latestPositive);
      
      if (latestPositive) {
        const latestMood = logs[logs.length - 1].mood;
        const message = getPositiveMessage(latestMood);
        
        // Clear any existing negative notifications
        setActiveNotification(null);
        localStorage.removeItem('lastNegativeNotification');
        
        dispatch(addPositiveReinforcement({
          mood: latestMood,
          message
        }));
      }
    }
  }, [status, logs, dispatch]); // Trigger when status changes or logs are loaded

  useEffect(() => {
    if (logs?.length > 4) {
      const latestPositive = isLatestMoodPositive();
      
      // If latest mood is negative, show emotional support
      if (!latestPositive) {
        const lastNegative = parseInt(localStorage.getItem('lastNegativeNotification') || 0);
        
        // Show notification if we haven't shown one in the last 12 hours
        if (Date.now() - lastNegative > 43200000) {
          setActiveNotification({
            type: 'negative',
            currentMood: logs[logs.length-1].mood,
            previousMood: logs[logs.length-4].mood
          });
          localStorage.setItem('lastNegativeNotification', Date.now());
          
          // Add a notification to the notification center too
          dispatch(addPositiveReinforcement({
            mood: logs[logs.length-1].mood,
            message: "We've detected a shift in your mood. Would you like to tell us more?",
            type: 'mood_shift'
          }));
        }
      } else {
        // If mood is positive, clear any negative notifications
        setActiveNotification(null);
        localStorage.removeItem('lastNegativeNotification');
      }
    }
  }, [logs, dispatch]);

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

  // Replace the isLatestMoodPositive function with this corrected version
  const isLatestMoodPositive = () => {
    if (!logs || logs.length === 0) return false;
    
    // Get just the latest mood entry
    const latestLog = logs[logs.length - 1];
    const latestMood = latestLog.mood;
    
    // Get the mood values from MoodChart
    const moodValues = {
      // Very positive moods (8-10)
      'happy': 9, 'excited': 9, 'loving': 9, 'optimistic': 8,
      'proud': 8, 'grateful': 8, 'relieved': 8, 'amused': 8,
      
      // Positive moods (6-7)
      'calm': 7, 'caring': 7, 'surprised': 6, 'curious': 6,
      
      // Neutral moods (4-5)
      'neutral': 5, 'confused': 4,
      
      // Negative moods (2-3)
      'anxious': 3, 'nervous': 3, 'embarrassed': 3, 'disappointed': 3,
      'annoyed': 3, 'disapproving': 2, 'sad': 2,
      
      // Very negative moods (0-1)
      'angry': 1, 'grieving': 1, 'disgusted': 1, 'remorseful': 1
    };
    
    // Debug the mood detection
    console.log("Latest mood:", latestMood, "Value:", moodValues[latestMood] || 0);
    
    // Check if latest mood is positive (score >= 6)
    // Using strict comparison and a fallback of 0 instead of 5
    return (moodValues[latestMood] || 0) >= 6;
  };

  // Function to get personalized positive message
  const getPositiveMessage = (mood) => {
    const messages = {
      'happy': "You're feeling happy today - that's wonderful!",
      'excited': "Your excitement is energizing! Keep that positive energy flowing.",
      'loving': "Your loving mood brings warmth to your day.",
      'optimistic': "Your optimistic outlook helps you see possibilities!",
      'proud': "You're feeling proud - take a moment to celebrate yourself!",
      'grateful': "Gratitude is a powerful emotion - enjoy this positive state.",
      'default': "You're in a positive state right now - wonderful!"
    };
    
    return messages[mood] || messages.default;
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mood Analytics</h1>
          <p className="text-[#B8C7E0]">Track and visualise your emotional journey over time</p>
        </div>

        <NotificationCenter />
        
        <div className="bg-[#1A2335] p-6 rounded-xl border border-[#2A3547] mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedView('chart')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedView === 'chart'
                    ? 'bg-[#3E60C1] text-white'
                    : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'
                }`}
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
              <button
                onClick={() => setSelectedView('analysis')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${selectedView === 'analysis'
                  ? 'bg-[#3E60C1] text-white'
                  : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'}`}
              >
                <FaLightbulb className="inline mr-1" /> Analysis
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

        
        <div className="bg-[#1A2335] p-6 rounded-xl border border-[#2A3547]">
          {selectedView === 'chart' ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Mood Visualisations</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedChart('line')}
                    className={`p-2 rounded-lg transition-colors ${selectedChart === 'line'
                      ? 'bg-[#3E60C1] text-white'
                      : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'
                    }`}
                    title="Line Chart"
                  >
                    <FaChartLine />
                  </button>
                  <button
                    onClick={() => setSelectedChart('radar')}
                    className={`p-2 rounded-lg transition-colors ${selectedChart === 'radar'
                      ? 'bg-[#3E60C1] text-white'
                      : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'
                    }`}
                    title="Radar Chart"
                  >
                    <FaChartPie />
                  </button>
                  <button
                    onClick={() => setSelectedChart('distribution')}
                    className={`p-2 rounded-lg transition-colors ${selectedChart === 'distribution'
                      ? 'bg-[#3E60C1] text-white'
                      : 'bg-[#0F172A] text-[#B8C7E0] hover:bg-[#2A3547]'
                    }`}
                    title="Distribution Chart"
                  >
                    <FaChartBar />
                  </button>
                  <button
                    onClick={() => setSelectedChart('calendar')}
                    className={`p-2 rounded-lg transition-colors ${selectedChart === 'calendar'
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
          ) : selectedView === 'list' ? (
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
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#B8C7E0]">No mood data found for the selected filters.</p>
                  </div>
                )}
              </div>
            </>
          ) : selectedView === 'analysis' ? (
            // Analysis view 
            <>
              <h2 className="text-xl font-semibold text-white mb-4">Mood Analysis & Recommendations</h2>

              
              <MoodRecommendation logs={safetyLogs} selectedPeriod={selectedPeriod} />

              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Additional Insights</h3>
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
            </>
          ) : null}
        </div>
      </div>
      
      {activeNotification?.type === 'positive' && (
        <PositiveReinforcement
          notification={activeNotification}
          onClose={() => setActiveNotification(null)}
        />
      )}
      
      {activeNotification?.type === 'negative' && (
        <MoodCausePrompt
          notification={activeNotification}
          onClose={() => setActiveNotification(null)}
        />
      )}
    </div>
  );
};

export default MoodLog;