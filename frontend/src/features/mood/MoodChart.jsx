import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMoodTrends } from './moodSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MoodChart = () => {
  const dispatch = useDispatch();
  const { trends, status } = useSelector(state => state.mood);
  
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
  
  if (status === 'failed' || trends.length === 0) {
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
  
  console.log("Mood trends data:", trends);
  
  // Group by date and get average mood value
  const groupedByDate = trends.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0 };
    }
    
    // If mood is not in our mapping, default to neutral (5)
    const moodValue = moodValues[item.mood] !== undefined ? moodValues[item.mood] : 5;
    
    // Apply intensity as a modifier (0.5 to 1.5 range)
    const intensityModifier = 0.5 + (item.intensity / 10);
    
    // Calculate final score (capped between 0-10)
    const score = Math.min(10, Math.max(0, moodValue * intensityModifier));
    
    acc[date].total += score;
    acc[date].count += 1;
    return acc;
  }, {});
  
  const dates = Object.keys(groupedByDate).sort();
  const moodScores = dates.map(date => {
    const { total, count } = groupedByDate[date];
    return total / count;
  });
  
  // Format dates for display
  const formattedDates = dates.map(date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });
  
  const data = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Mood Score',
        data: moodScores,
        borderColor: '#5983FC',
        backgroundColor: 'rgba(89, 131, 252, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3E60C1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        }
      },
      x: {
        grid: {
          color: 'rgba(42, 53, 71, 0.5)',
        },
        ticks: {
          color: '#B8C7E0',
        }
      }
    },
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
            
            // Find the original moods for this date
            const date = dates[context.dataIndex];
            const moodsForDate = trends.filter(trend => trend.date === date);
            const moodsList = moodsForDate.map(m => m.mood).join(', ');
            
            return [
              `Overall: ${mood} (${score.toFixed(1)}/10)`,
              `Moods: ${moodsList}`
            ];
          }
        }
      }
    }
  };
  
  return (
    <div className="h-96">
      <Line data={data} options={options} />
    </div>
  );
};

export default MoodChart; 