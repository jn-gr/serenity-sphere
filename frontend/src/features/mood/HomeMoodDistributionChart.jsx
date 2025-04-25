import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const HomeMoodDistributionChart = () => {
  const { trends, status } = useSelector(state => state.mood);
  const [chartData, setChartData] = useState(null);
  const [positivePercentage, setPositivePercentage] = useState(0);
  
  useEffect(() => {
    if (!trends || trends.length === 0 || status === 'loading') return;
    
    // Process chart data
    const { data, options, percentage } = processChartData(trends);
    setChartData({ data, options });
    setPositivePercentage(percentage);
  }, [trends, status]);
  
  const processChartData = (trendsData) => {
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

    // Category colors - updated for more professional look
    const categoryColors = {
      'Positive': 'rgba(16, 185, 129, 0.9)', // Emerald with opacity
      'Neutral': 'rgba(99, 102, 241, 0.9)', // Indigo with opacity
      'Negative': 'rgba(239, 68, 68, 0.9)'  // Red with opacity
    };
    
    // Category hover colors - slightly brighter
    const categoryHoverColors = {
      'Positive': 'rgba(16, 185, 129, 1)',
      'Neutral': 'rgba(99, 102, 241, 1)',
      'Negative': 'rgba(239, 68, 68, 1)'
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
          borderColor: 'rgba(30, 41, 59, 0.5)', // Dark border for contrast
          borderWidth: 1,
          hoverOffset: 6,
          borderRadius: 3, // Rounded segments
        },
      ],
    };

    // Configure chart options - simplified for home view
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(26, 35, 53, 0.95)',
          titleColor: '#fff',
          bodyColor: '#B8C7E0',
          borderColor: '#2A3547',
          borderWidth: 1,
          padding: 8,
          boxPadding: 4,
          cornerRadius: 6,
          displayColors: true,
          bodyFont: {
            size: 12
          },
          titleFont: {
            size: 13,
            weight: '600'
          },
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
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 800,
        easing: 'easeOutCubic'
      }
    };

    // Calculate percentages for center text
    const total = Object.values(categoryOccurrences).reduce((a, b) => a + b, 0);
    const positivePercentage = Math.round((categoryOccurrences['Positive'] / total) * 100) || 0;

    return { data, options, percentage: positivePercentage };
  };
  
  if (status === 'loading') {
    return (
      <div className="h-36 sm:h-40 md:h-44 bg-[#0F172A]/30 rounded-xl flex items-center justify-center">
        <motion.div 
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [0.98, 1, 0.98]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5 
          }}
          className="text-[#B8C7E0] text-sm"
        >
          Loading...
        </motion.div>
      </div>
    );
  }
  
  if (status === 'failed' || !trends || trends.length === 0) {
    return (
      <div className="h-36 sm:h-40 md:h-44 bg-[#0F172A]/30 rounded-xl border border-[#2A3547]/30 flex items-center justify-center flex-col">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#B8C7E0] text-sm mb-2">No mood data yet</p>
          <p className="text-[#5983FC] text-xs text-center">Start tracking your moods</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-36 sm:h-40 md:h-44 relative bg-[#0F172A]/60 rounded-xl border border-[#2A3547]/50 p-2">
      {chartData && (
        <>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-10"
          >
            <span className="text-2xl sm:text-3xl font-bold text-white">{positivePercentage}%</span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-xs sm:text-sm text-[#B8C7E0]"
            >
              Positive
            </motion.span>
          </motion.div>
          <Doughnut data={chartData.data} options={chartData.options} />
        </>
      )}
      
      {/* Category indicators */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-1"
        >
          <div className="w-2 h-2 rounded-full bg-[rgba(16,185,129,0.9)]"></div>
          <span className="text-[10px] text-[#B8C7E0]">Positive</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex items-center gap-1"
        >
          <div className="w-2 h-2 rounded-full bg-[rgba(99,102,241,0.9)]"></div>
          <span className="text-[10px] text-[#B8C7E0]">Neutral</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center gap-1"
        >
          <div className="w-2 h-2 rounded-full bg-[rgba(239,68,68,0.9)]"></div>
          <span className="text-[10px] text-[#B8C7E0]">Negative</span>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeMoodDistributionChart; 