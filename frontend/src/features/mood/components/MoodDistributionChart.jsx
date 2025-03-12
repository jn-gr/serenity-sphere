import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MoodDistributionChart = ({ trends }) => {
  if (!trends || trends.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center flex-col">
        <p className="text-[#B8C7E0] mb-4">No mood data available yet.</p>
        <p className="text-[#5983FC] text-sm">Start journaling to track your mood!</p>
      </div>
    );
  }

  // Group moods into categories
  const moodCategories = {
    'Very Positive': [
      'happy', 'excited', 'loving', 'optimistic', 'proud', 
      'grateful', 'relieved', 'amused'
    ],
    'Positive': [
      'calm', 'caring'
    ],
    'Neutral': [
      'neutral', 'surprised', 'curious', 'confused'
    ],
    'Negative': [
      'anxious', 'nervous', 'embarrassed', 'disappointed', 
      'annoyed', 'disapproving', 'sad'
    ],
    'Very Negative': [
      'angry', 'grieving', 'disgusted', 'remorseful'
    ]
  };

  // Category colors
  const categoryColors = {
    'Very Positive': '#10B981', // Emerald
    'Positive': '#3B82F6',      // Blue
    'Neutral': '#6366F1',       // Indigo
    'Negative': '#F97316',      // Orange
    'Very Negative': '#EF4444'  // Red
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
        borderColor: Object.keys(categoryOccurrences).map(category => categoryColors[category].replace(')', ', 0.8)')),
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  };

  // Configure chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#B8C7E0',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1A2335',
        titleColor: '#fff',
        bodyColor: '#B8C7E0',
        borderColor: '#2A3547',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
          afterLabel: function(context) {
            const category = context.label;
            const moodsInCategory = moodCategories[category];
            
            // Count occurrences of each mood in this category
            const moodCounts = {};
            trends.forEach(trend => {
              if (moodsInCategory.includes(trend.mood)) {
                if (!moodCounts[trend.mood]) {
                  moodCounts[trend.mood] = 0;
                }
                moodCounts[trend.mood] += 1;
              }
            });
            
            // Get top 3 moods in this category
            const topMoods = Object.entries(moodCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3);
            
            if (topMoods.length === 0) return null;
            
            return [
              '',
              'Top moods:',
              ...topMoods.map(([mood, count]) => 
                `• ${mood.charAt(0).toUpperCase() + mood.slice(1)}: ${count}`)
            ];
          }
        }
      }
    }
  };

  // Calculate percentages for center text
  const total = Object.values(categoryOccurrences).reduce((a, b) => a + b, 0);
  const positiveCount = (categoryOccurrences['Very Positive'] || 0) + (categoryOccurrences['Positive'] || 0);
  const positivePercentage = Math.round((positiveCount / total) * 100) || 0;

  return (
    <div className="h-80 relative">
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-10">
        <span className="text-3xl font-bold text-white">{positivePercentage}%</span>
        <span className="text-sm text-[#B8C7E0]">Positive Moods</span>
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default MoodDistributionChart; 