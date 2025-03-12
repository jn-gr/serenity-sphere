import React from 'react';
import { useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const HomeMoodDistributionChart = () => {
  const { trends, status } = useSelector(state => state.mood);
  
  if (status === 'loading') {
    return (
      <div className="h-36 flex items-center justify-center">
        <div className="animate-pulse text-[#B8C7E0] text-sm">Loading...</div>
      </div>
    );
  }
  
  if (status === 'failed' || !trends || trends.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center flex-col">
        <p className="text-[#B8C7E0] text-sm mb-2">No mood data yet</p>
        <p className="text-[#5983FC] text-xs">Start tracking your moods</p>
      </div>
    );
  }

  // Group moods into simpler categories for the home view
  const moodCategories = {
    'Positive': [
      'happy', 'excited', 'loving', 'optimistic', 'proud', 
      'grateful', 'relieved', 'amused', 'calm', 'caring'
    ],
    'Neutral': [
      'neutral', 'surprised', 'curious', 'confused'
    ],
    'Negative': [
      'anxious', 'nervous', 'embarrassed', 'disappointed', 
      'annoyed', 'disapproving', 'sad', 'angry', 'grieving', 
      'disgusted', 'remorseful'
    ]
  };

  // Category colors - simplified for home view
  const categoryColors = {
    'Positive': '#10B981', // Emerald
    'Neutral': '#6366F1',  // Indigo
    'Negative': '#EF4444'  // Red
  };

  // Count occurrences of each mood category
  const categoryOccurrences = Object.keys(moodCategories).reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {});

  // Count mood occurrences in each category
  trends.forEach(trend => {
    for (const [category, moods] of Object.entries(moodCategories)) {
      if (moods.includes(trend.mood)) {
        categoryOccurrences[category] += 1;
        break;
      }
    }
  });

  // Prepare data for donut chart
  const data = {
    labels: Object.keys(categoryOccurrences),
    datasets: [
      {
        data: Object.values(categoryOccurrences),
        backgroundColor: Object.keys(categoryOccurrences).map(category => categoryColors[category]),
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  };

  // Configure chart options - simplified for home view
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
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
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          }
        }
      }
    }
  };

  // Calculate percentages for center text
  const total = Object.values(categoryOccurrences).reduce((a, b) => a + b, 0);
  const positivePercentage = Math.round((categoryOccurrences['Positive'] / total) * 100) || 0;

  return (
    <div className="h-36 relative">
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-10">
        <span className="text-2xl font-bold text-white">{positivePercentage}%</span>
        <span className="text-xs text-[#B8C7E0]">Positive</span>
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default HomeMoodDistributionChart; 