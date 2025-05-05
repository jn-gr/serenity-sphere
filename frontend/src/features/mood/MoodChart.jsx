import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMoodTrends } from './moodSlice';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MoodChart = () => {
  const dispatch = useDispatch();
  const { trends, status } = useSelector(state => state.mood);
  const [showLegend, setShowLegend] = useState(false);
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [groupByDay, setGroupByDay] = useState(true);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMoodTrends());
    }
  }, [dispatch, status]);
  
  if (status === 'loading') {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-pulse text-[#B8C7E0]">Loading mood data...</div>
      </div>
    );
  }
  
  if (status === 'failed' || !trends || trends.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center flex-col">
        <p className="text-[#B8C7E0] mb-4">No mood data available yet.</p>
        <p className="text-[#5983FC] text-sm">Start journaling to track your mood!</p>
      </div>
    );
  }
  
  // Process data for chart - expanded mood values
  const moodValues = {
    // Very positive moods (8-10)
    'happy': 9,
    'excited': 9,
    'loving': 9,
    'optimistic': 8,
    'proud': 8,
    'grateful': 8,
    'relieved': 8,
    'amused': 8,
    
    // Positive moods (6-7)
    'calm': 7,
    'caring': 7,
    'surprised': 6,
    'curious': 6,
    
    // Neutral moods (4-5)
    'neutral': 5,
    'confused': 4,
    
    // Negative moods (2-3)
    'anxious': 3,
    'nervous': 3,
    'embarrassed': 3,
    'disappointed': 3,
    'annoyed': 3,
    'disapproving': 2,
    'sad': 2,
    
    // Very negative moods (0-1)
    'angry': 1,
    'grieving': 1,
    'disgusted': 1,
    'remorseful': 1
  };
  
  // Group by date and get average mood value
  const groupedByDate = trends.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0, moods: [] };
    }
    
    // If mood is not in our mapping, default to neutral (5)
    const moodValue = moodValues[item.mood] !== undefined ? moodValues[item.mood] : 5;
    
    // Apply intensity as a modifier (0.5 to 1.5 range)
    const intensityModifier = 0.5 + (item.intensity / 10);
    
    // Calculate final score (capped between 0-10)
    const score = Math.min(10, Math.max(0, moodValue * intensityModifier));
    
    acc[date].total += score;
    acc[date].count += 1;
    acc[date].moods.push({
      mood: item.mood,
      intensity: item.intensity,
      score: score
    });
    return acc;
  }, {});
  
  const dates = Object.keys(groupedByDate).sort();
  const moodScores = dates.map(date => {
    const { total, count } = groupedByDate[date];
    return total / count;
  });
  
  // Calculate mood variability - standard deviation of mood scores
  const average = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
  const variance = moodScores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / moodScores.length;
  const stdDev = Math.sqrt(variance);
  
  // Calculate mood ranges - the difference between highest and lowest mood
  const moodRange = moodScores.length > 0 ? 
    Math.max(...moodScores) - Math.min(...moodScores) : 0;
  
  // Format dates for display
  const formattedDates = dates.map(date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });
  
  // Get gradient color based on mood score
  const getBarColor = (score) => {
    if (score >= 8) return 'rgba(16, 185, 129, 0.9)'; // Emerald/Very Positive
    if (score >= 6) return 'rgba(59, 130, 246, 0.9)'; // Blue/Positive
    if (score >= 4) return 'rgba(99, 102, 241, 0.9)'; // Indigo/Neutral
    if (score >= 2) return 'rgba(249, 115, 22, 0.9)'; // Orange/Negative
    return 'rgba(239, 68, 68, 0.9)'; // Red/Very Negative
  };

  // Get border colors for bars
  const getBorderColor = (score) => {
    if (score >= 8) return 'rgb(16, 185, 129)'; // Emerald/Very Positive
    if (score >= 6) return 'rgb(59, 130, 246)'; // Blue/Positive
    if (score >= 4) return 'rgb(99, 102, 241)'; // Indigo/Neutral
    if (score >= 2) return 'rgb(249, 115, 22)'; // Orange/Negative
    return 'rgb(239, 68, 68)'; // Red/Very Negative
  };
  
  // Get bar colors for each mood score
  const barColors = moodScores.map(score => getBarColor(score));
  const borderColors = moodScores.map(score => getBorderColor(score));
  
  const data = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Mood Score',
        data: moodScores,
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 24, // Adjust this value to control bar width
        hoverBackgroundColor: (ctx) => {
          const index = ctx.dataIndex;
          const score = moodScores[index];
          // Make hover color slightly darker
          return getBorderColor(score);
        }
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: {
          color: 'rgba(42, 53, 71, 0.5)',
        },
        ticks: {
          color: '#B8C7E0',
          callback: function(value) {
            const moodLabels = {
              0: 'Very Negative',
              2: 'Negative',
              5: 'Neutral',
              7: 'Positive',
              10: 'Very Positive'
            };
            return moodLabels[value] || '';
          }
        },
        title: {
          display: true,
          text: 'Mood Score',
          color: '#B8C7E0',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(42, 53, 71, 0.5)',
        },
        ticks: {
          color: '#B8C7E0',
        },
        title: {
          display: true,
          text: 'Date',
          color: '#B8C7E0',
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        labels: {
          color: '#B8C7E0'
        }
      },
      tooltip: {
        backgroundColor: '#1A2335',
        titleColor: '#fff',
        bodyColor: '#B8C7E0',
        borderColor: '#2A3547',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(tooltipItems) {
            return `Date: ${dates[tooltipItems[0].dataIndex]}`;
          },
          label: function(context) {
            const score = context.parsed.y;
            let mood = 'Neutral';
            
            if (score >= 8) mood = 'Very Positive';
            else if (score >= 6) mood = 'Positive';
            else if (score >= 4) mood = 'Neutral';
            else if (score >= 2) mood = 'Negative';
            else mood = 'Very Negative';
            
            const date = dates[context.dataIndex];
            const moodsForDate = trends.filter(trend => trend.date === date);
            const moodsList = moodsForDate.map(m => m.mood).join(', ');
            
            return [
              `Overall: ${mood} (${score.toFixed(1)}/10)`,
              `Moods: ${moodsList}`
            ];
          },
          afterLabel: function(context) {
            const date = dates[context.dataIndex];
            const moods = groupedByDate[date].moods;
            
            if (moods.length > 1) {
              return [
                '',
                'Mood Breakdown:',
                ...moods.map(m => `• ${m.mood.charAt(0).toUpperCase() + m.mood.slice(1)}: ${m.intensity}/10`)
              ];
            }
            return null;
          }
        }
      }
    }
  };
  
  // Get stability assessment
  const getStabilityAssessment = () => {
    if (stdDev < 1) return "very stable";
    if (stdDev < 1.5) return "relatively stable";
    if (stdDev < 2.5) return "somewhat variable";
    if (stdDev < 3.5) return "highly variable";
    return "extremely variable";
  };
  
  // Get trend description
  const getTrendDescription = () => {
    if (moodScores.length <= 2) return "Track more moods to see trends over time.";
    
    const firstHalf = moodScores.slice(0, Math.floor(moodScores.length / 2));
    const secondHalf = moodScores.slice(Math.floor(moodScores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (Math.abs(difference) < 0.5) return "Your mood has been relatively stable over this period.";
    if (difference > 0) return "Your mood shows an improving trend over this period.";
    return "Your mood shows a declining trend over this period.";
  };
  
  return (
    <div className="h-[500px]">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#1A2335] p-3 rounded-lg border border-[#2A3547]">
            <p className="text-[#B8C7E0] text-sm mb-1">Mood Stability</p>
            <p className="text-white">{getStabilityAssessment()} <span className="text-sm text-[#B8C7E0]">({stdDev.toFixed(1)})</span></p>
          </div>
          <div className="bg-[#1A2335] p-3 rounded-lg border border-[#2A3547]">
            <p className="text-[#B8C7E0] text-sm mb-1">Mood Range</p>
            <p className="text-white">{moodRange.toFixed(1)} <span className="text-sm text-[#B8C7E0]">points</span></p>
          </div>
          <div className="bg-[#1A2335] p-3 rounded-lg border border-[#2A3547]">
            <p className="text-[#B8C7E0] text-sm mb-1">Average Mood</p>
            <p className="text-white">{average.toFixed(1)} <span className="text-sm text-[#B8C7E0]">/10</span></p>
          </div>
        </div>
        <p className="text-[#B8C7E0] text-sm">{getTrendDescription()}</p>
      </div>
      
      <div className="flex justify-end space-x-3 mb-4">
        <button 
          onClick={() => setShowDataLabels(!showDataLabels)}
          className={`px-3 py-1 text-xs rounded ${showDataLabels ? 'bg-[#3E60C1] text-white' : 'bg-[#1A2335] text-[#B8C7E0]'}`}
        >
          Show Labels
        </button>
        <button 
          onClick={() => setGroupByDay(!groupByDay)}
          className={`px-3 py-1 text-xs rounded ${groupByDay ? 'bg-[#3E60C1] text-white' : 'bg-[#1A2335] text-[#B8C7E0]'}`}
        >
          Group By Day
        </button>
        <button 
          onClick={() => setShowLegend(!showLegend)}
          className={`px-3 py-1 text-xs rounded ${showLegend ? 'bg-[#3E60C1] text-white' : 'bg-[#1A2335] text-[#B8C7E0]'}`}
        >
          Show Legend
        </button>
      </div>
      
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MoodChart; 