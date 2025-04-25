import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MoodDistributionChart = ({ trends }) => {
  const [chartData, setChartData] = useState(null);
  const [positivePercentage, setPositivePercentage] = useState(0);
  
  useEffect(() => {
    if (!trends || trends.length === 0) return;
    
    // Process chart data
    const { data, options, percentage } = processChartData(trends);
    setChartData({ data, options });
    setPositivePercentage(percentage);
  }, [trends]);

  const processChartData = (trendsData) => {
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

    // Category colors - updated with more professional palette
    const categoryColors = {
      'Very Positive': 'rgba(16, 185, 129, 0.9)', // Emerald with opacity
      'Positive': 'rgba(59, 130, 246, 0.9)',      // Blue with opacity
      'Neutral': 'rgba(99, 102, 241, 0.9)',       // Indigo with opacity
      'Negative': 'rgba(249, 115, 22, 0.9)',      // Orange with opacity
      'Very Negative': 'rgba(239, 68, 68, 0.9)'   // Red with opacity
    };
    
    // Category hover colors - slightly brighter
    const categoryHoverColors = {
      'Very Positive': 'rgba(16, 185, 129, 1)', 
      'Positive': 'rgba(59, 130, 246, 1)',      
      'Neutral': 'rgba(99, 102, 241, 1)',       
      'Negative': 'rgba(249, 115, 22, 1)',      
      'Very Negative': 'rgba(239, 68, 68, 1)'   
    };

    // Count occurrences of each mood category
    const categoryOccurrences = Object.keys(moodCategories).reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});

    // Count mood occurrences in each category
    trendsData.forEach(trend => {
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
          hoverBackgroundColor: Object.keys(categoryOccurrences).map(category => categoryHoverColors[category]),
          borderColor: 'rgba(30, 41, 59, 0.8)', // Dark border for contrast
          borderWidth: 1,
          hoverOffset: 15,
          borderRadius: 4, // Rounded segments
        },
      ],
    };

    // Configure chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%', // Slightly thinner donut
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#B8C7E0',
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(26, 35, 53, 0.95)',
          titleColor: '#fff',
          bodyColor: '#B8C7E0',
          bodyFont: {
            size: 13
          },
          titleFont: {
            size: 14,
            weight: '600'
          },
          borderColor: '#2A3547',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          cornerRadius: 8,
          displayColors: true,
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
              trendsData.forEach(trend => {
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
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1000,
        easing: 'easeOutQuart'
      }
    };

    // Calculate percentages for center text
    const total = Object.values(categoryOccurrences).reduce((a, b) => a + b, 0);
    const positiveCount = (categoryOccurrences['Very Positive'] || 0) + (categoryOccurrences['Positive'] || 0);
    const positivePercentage = Math.round((positiveCount / total) * 100) || 0;

    return { data, options, percentage: positivePercentage };
  };

  if (!trends || trends.length === 0) {
    return (
      <div className="bg-[#0F172A]/50 rounded-xl border border-[#2A3547]/50 p-6 h-80 flex items-center justify-center flex-col">
        <div className="w-16 h-16 mb-4 rounded-full bg-[#1E293B] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5983FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[#B8C7E0] font-medium mb-2">No mood data available yet</p>
        <p className="text-[#5983FC] text-sm">Start journaling to track your mood patterns!</p>
      </div>
    );
  }

  return (
    <div className="h-80 md:h-96 relative bg-[#0F172A] rounded-xl border border-[#2A3547] p-4">
      {chartData && (
        <>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-10"
          >
            <span className="text-3xl md:text-4xl font-bold text-white">{positivePercentage}%</span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm md:text-base text-[#B8C7E0]"
            >
              Positive Moods
            </motion.span>
          </motion.div>
          <Doughnut data={chartData.data} options={chartData.options} />
        </>
      )}
    </div>
  );
};

export default MoodDistributionChart; 