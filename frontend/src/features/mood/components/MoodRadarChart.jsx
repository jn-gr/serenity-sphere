import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const MoodRadarChart = ({ trends }) => {
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
    'Positive': [
      'happy', 'excited', 'loving', 'optimistic', 'proud', 
      'grateful', 'relieved', 'amused', 'calm', 'caring'
    ],
    'Neutral': [
      'neutral', 'surprised', 'curious', 'confused'
    ],
    'Anxiety': [
      'anxious', 'nervous'
    ],
    'Sadness': [
      'sad', 'disappointed', 'grieving'
    ],
    'Anger': [
      'angry', 'annoyed', 'disapproving', 'disgusted'
    ],
    'Shame': [
      'embarrassed', 'remorseful'
    ]
  };

  // Count occurrences of each mood category
  const categoryOccurrences = Object.keys(moodCategories).reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {});

  // Count mood occurrences
  const moodOccurrences = trends.reduce((acc, trend) => {
    if (!acc[trend.mood]) {
      acc[trend.mood] = 0;
    }
    acc[trend.mood] += 1;
    return acc;
  }, {});

  // Calculate category occurrences
  Object.entries(moodOccurrences).forEach(([mood, count]) => {
    for (const [category, moods] of Object.entries(moodCategories)) {
      if (moods.includes(mood)) {
        categoryOccurrences[category] += count;
        break;
      }
    }
  });

  // Calculate intensity-weighted mood categories
  const categoryIntensity = Object.keys(moodCategories).reduce((acc, category) => {
    acc[category] = { total: 0, count: 0 };
    return acc;
  }, {});

  trends.forEach(trend => {
    for (const [category, moods] of Object.entries(moodCategories)) {
      if (moods.includes(trend.mood)) {
        categoryIntensity[category].total += trend.intensity;
        categoryIntensity[category].count += 1;
        break;
      }
    }
  });

  // Calculate average intensity for each category
  const averageIntensity = Object.keys(categoryIntensity).map(category => {
    if (categoryIntensity[category].count === 0) return 0;
    return categoryIntensity[category].total / categoryIntensity[category].count;
  });

  // Prepare data for radar chart
  const data = {
    labels: Object.keys(categoryOccurrences),
    datasets: [
      {
        label: 'Mood Frequency',
        data: Object.values(categoryOccurrences),
        backgroundColor: 'rgba(89, 131, 252, 0.2)',
        borderColor: 'rgba(89, 131, 252, 1)',
        borderWidth: 2,
        pointBackgroundColor: '#3E60C1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3E60C1',
        pointRadius: 4,
      },
      {
        label: 'Average Intensity',
        data: averageIntensity,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10B981',
        pointRadius: 4,
      }
    ],
  };

  // Configure chart options
  const options = {
    scales: {
      r: {
        min: 0,
        ticks: {
          backdropColor: 'transparent',
          color: '#B8C7E0',
        },
        grid: {
          color: 'rgba(42, 53, 71, 0.5)',
        },
        angleLines: {
          color: 'rgba(42, 53, 71, 0.5)',
        },
        pointLabels: {
          color: '#B8C7E0',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#B8C7E0',
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10,
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
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
          afterLabel: function(context) {
            const categoryName = Object.keys(categoryOccurrences)[context.dataIndex];
            const moods = moodCategories[categoryName];
            
            // Get mood counts for this category
            const categoryMoodCounts = {};
            moods.forEach(mood => {
              if (moodOccurrences[mood]) {
                categoryMoodCounts[mood] = moodOccurrences[mood];
              }
            });
            
            // Sort by occurrence count (descending)
            const sortedMoods = Object.entries(categoryMoodCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3); // Top 3
            
            if (sortedMoods.length === 0) return null;
            
            return [
              '',
              'Top moods in this category:',
              ...sortedMoods.map(([mood, count]) => 
                `• ${mood.charAt(0).toUpperCase() + mood.slice(1)}: ${count} time${count !== 1 ? 's' : ''}`)
            ];
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-96">
      <Radar data={data} options={options} />
    </div>
  );
};

export default MoodRadarChart; 