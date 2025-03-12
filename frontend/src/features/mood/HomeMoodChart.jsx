import React from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const HomeMoodChart = () => {
  const { trends, status } = useSelector(state => state.mood);
  
  if (status === 'loading') {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-pulse text-[#B8C7E0] text-sm">Loading...</div>
      </div>
    );
  }
  
  if (status === 'failed' || !trends || trends.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center flex-col">
        <p className="text-[#B8C7E0] text-sm mb-2">No mood data yet</p>
        <p className="text-[#5983FC] text-xs">Start tracking your moods</p>
      </div>
    );
  }
  
  // Process data for chart - simplified mood values
  const moodValues = {
    // Very positive moods (8-10)
    'happy': 9, 'excited': 9, 'loving': 9, 'optimistic': 8, 'proud': 8,
    'grateful': 8, 'relieved': 8, 'amused': 8,
    
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
  
  // Group by date and get average mood value - limit to most recent 7 days
  const moodsByDate = {};
  trends.forEach(item => {
    const date = item.date;
    if (!moodsByDate[date]) {
      moodsByDate[date] = { total: 0, count: 0 };
    }
    
    const moodValue = moodValues[item.mood] !== undefined ? moodValues[item.mood] : 5;
    const intensityModifier = 0.5 + (item.intensity / 10);
    const score = Math.min(10, Math.max(0, moodValue * intensityModifier));
    
    moodsByDate[date].total += score;
    moodsByDate[date].count += 1;
  });
  
  // Get the dates sorted by most recent
  const dates = Object.keys(moodsByDate).sort().reverse().slice(0, 7).reverse();
  
  // Calculate average mood scores for each date
  const moodScores = dates.map(date => {
    const { total, count } = moodsByDate[date];
    return total / count;
  });
  
  // Format dates for display (just show day/month)
  const formattedDates = dates.map(date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });
  
  // Determine mood trend
  const calculateTrend = () => {
    if (moodScores.length < 2) return "neutral";
    
    const firstHalf = moodScores.slice(0, Math.floor(moodScores.length / 2));
    const secondHalf = moodScores.slice(Math.floor(moodScores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 0.5) return "improving";
    if (difference < -0.5) return "declining";
    return "stable";
  };
  
  const trend = calculateTrend();
  const trendColor = trend === "improving" ? "#10B981" : trend === "declining" ? "#EF4444" : "#6366F1";
  
  // Get gradient background
  const getGradientColor = (score) => {
    if (score >= 8) return 'rgba(16, 185, 129, 0.1)'; // Emerald/Very Positive
    if (score >= 6) return 'rgba(59, 130, 246, 0.1)'; // Blue/Positive
    if (score >= 4) return 'rgba(99, 102, 241, 0.1)'; // Indigo/Neutral
    if (score >= 2) return 'rgba(249, 115, 22, 0.1)'; // Orange/Negative
    return 'rgba(239, 68, 68, 0.1)'; // Red/Very Negative
  };

  // Create the line gradient - gradient based on trend direction
  const createGradient = (ctx) => {
    if (!ctx) return trendColor + '20';
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    
    if (trend === "improving") {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    } else if (trend === "declining") {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
    }
    
    return gradient;
  };
  
  // Data for the chart
  const data = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Mood Score',
        data: moodScores,
        borderColor: trendColor,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          return createGradient(ctx);
        },
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: ctx => {
          const index = ctx.dataIndex;
          const score = moodScores[index];
          
          if (score >= 8) return '#10B981'; // Very Positive
          if (score >= 6) return '#3B82F6'; // Positive
          if (score >= 4) return '#6366F1'; // Neutral
          if (score >= 2) return '#F97316'; // Negative
          return '#EF4444'; // Very Negative
        },
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
  
  // Enhanced chart options with better axis labels
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1A2335',
        titleColor: '#fff',
        bodyColor: '#B8C7E0',
        borderColor: '#2A3547',
        borderWidth: 1,
        padding: 8,
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
            
            return `Mood: ${mood} (${score.toFixed(1)}/10)`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        display: true,
        grid: {
          color: 'rgba(42, 53, 71, 0.4)',
          drawBorder: false,
        },
        ticks: {
          color: '#B8C7E0',
          font: {
            size: 8
          },
          callback: function(value) {
            if (value === 10) return 'Very Positive';
            if (value === 5) return 'Neutral';
            if (value === 0) return 'Very Negative';
            return '';
          },
          padding: 5
        },
        title: {
          display: true,
          text: 'Mood Level',
          color: '#B8C7E0',
          font: {
            size: 9
          },
          padding: {
            bottom: 10
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(42, 53, 71, 0.4)',
          display: true,
          drawBorder: false,
        },
        ticks: {
          color: '#B8C7E0',
          font: {
            size: 9
          }
        },
        title: {
          display: true,
          text: 'Date (Month/Day)',
          color: '#B8C7E0',
          font: {
            size: 9
          },
          padding: {
            top: 10
          }
        }
      }
    }
  };
  
  // Function to get trend description
  const getTrendDescription = () => {
    if (trend === "improving") return "Your mood is improving";
    if (trend === "declining") return "Your mood is declining";
    return "Your mood is stable";
  };
  
  return (
    <div className="h-48">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${trend === "improving" ? "bg-emerald-500" : trend === "declining" ? "bg-red-500" : "bg-indigo-500"}`}></span>
          <span className="text-xs text-[#B8C7E0]">{getTrendDescription()}</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="flex items-center mr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
            <span className="text-[#B8C7E0]">High</span>
          </span>
          <span className="flex items-center mr-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span>
            <span className="text-[#B8C7E0]">Neutral</span>
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
            <span className="text-[#B8C7E0]">Low</span>
          </span>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default HomeMoodChart; 