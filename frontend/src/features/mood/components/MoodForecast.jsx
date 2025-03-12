import React from 'react';
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
import { FaCalendarDay, FaArrowTrendUp, FaArrowTrendDown, FaMinus, FaLightbulb, FaExclamation } from 'react-icons/fa6';
import { analyzeMoodTrends } from '../moodAnalysisUtils';

// Register the chart.js components
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

const MoodForecast = ({ logs, selectedPeriod }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#B8C7E0]">No mood data available for forecasting.</p>
      </div>
    );
  }

  // Get analysis results from moodAnalysisUtils
  const analysis = analyzeMoodTrends(logs, selectedPeriod);
  
  if (analysis.status === 'insufficient_data') {
    return (
      <div className="bg-[#0F172A] p-5 rounded-xl border border-[#2A3547]">
        <div className="flex items-start">
          <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
            <FaLightbulb className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">More Data Needed for Forecasting</h3>
            <p className="text-[#B8C7E0]">{analysis.message || "We need more data to provide mood forecasts."}</p>
            <p className="text-[#B8C7E0] mt-3">{analysis.recommendation}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Get colors based on expected direction
  const getDirectionInfo = () => {
    if (analysis.expectedMoodDirection === 'improving') {
      return { 
        icon: <FaArrowTrendUp />, 
        color: 'rgb(52, 211, 153)', 
        bgColor: 'rgba(52, 211, 153, 0.1)',
        text: 'likely to improve'
      };
    } else if (analysis.expectedMoodDirection === 'declining') {
      return { 
        icon: <FaArrowTrendDown />, 
        color: 'rgb(239, 68, 68)', 
        bgColor: 'rgba(239, 68, 68, 0.1)',
        text: 'may decline slightly'
      };
    } else {
      return { 
        icon: <FaMinus />, 
        color: 'rgb(59, 130, 246)', 
        bgColor: 'rgba(59, 130, 246, 0.1)',
        text: 'likely to remain stable'
      };
    }
  };
  
  const directionInfo = getDirectionInfo();
  
  // Format mood score for display
  const formatMoodScore = (score) => {
    if (score > 0.6) return "Very Positive";
    if (score > 0.3) return "Positive";
    if (score > -0.3 && score < 0.3) return "Neutral";
    if (score > -0.6) return "Negative";
    return "Very Negative";
  };
  
  // Get today and next 3 days as labels
  const getDayLabels = () => {
    const today = new Date();
    const labels = ['Today'];
    
    for (let i = 1; i <= 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
    
    return labels;
  };

  // Create confidence interval data (±0.15 as an example)
  const confidenceInterval = 0.15;
  const forecastData = [
    analysis.currentMoodScore, 
    analysis._technicalData.futureForecast[0], 
    analysis._technicalData.futureForecast[1], 
    analysis._technicalData.futureForecast[2]
  ];
  
  const upperBounds = forecastData.map(value => Math.min(value + confidenceInterval, 1));
  const lowerBounds = forecastData.map(value => Math.max(value - confidenceInterval, -1));
  
  // Prepare chart data with enhanced visualization
  const chartData = {
    labels: getDayLabels(),
    datasets: [
      // Confidence interval area
      {
        label: 'Confidence Interval',
        data: upperBounds,
        borderColor: 'transparent',
        pointRadius: 0,
        fill: '+1',
        backgroundColor: `${directionInfo.bgColor.replace('0.1', '0.2')}`,
        tension: 0.4,
      },
      {
        label: 'Lower Bound',
        data: lowerBounds,
        borderColor: 'transparent',
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      },
      // Main forecast line
      {
        label: 'Mood Forecast',
        data: forecastData,
        borderColor: directionInfo.color,
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#0F172A',
        pointBorderColor: directionInfo.color,
        pointBorderWidth: 3,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: directionInfo.color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        fill: false,
        z: 10
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(42, 53, 71, 0.5)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: '#B8C7E0',
          font: {
            size: 12
          },
          padding: 10,
          callback: function(value) {
            if (value > 0.6) return "Very Positive";
            if (value > 0.3) return "Positive";
            if (value >= -0.3 && value <= 0.3) return "Neutral";
            if (value >= -0.6) return "Negative";
            return "Very Negative";
          }
        },
        min: -1,
        max: 1,
        title: {
          display: true,
          text: 'Mood State',
          color: '#B8C7E0',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: {
            bottom: 10
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(42, 53, 71, 0.5)',
          drawBorder: false,
          lineWidth: 1,
          z: 1
        },
        ticks: {
          color: '#B8C7E0',
          font: {
            size: 12
          },
          padding: 10
        },
        title: {
          display: true,
          text: 'Date',
          color: '#B8C7E0',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: {
            top: 10
          }
        }
      }
    },
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
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const score = context.raw;
            return [
              `Mood: ${formatMoodScore(score)}`,
              `Score: ${(score * 100).toFixed(0)}%`,
              `Confidence: ±${(confidenceInterval * 100).toFixed(0)}%`
            ];
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        borderJoinStyle: 'round'
      }
    }
  };
  
  const accuracy = Math.round(analysis.modelAccuracy * 100);
  
  // Enhanced visual elements - create mood indicators
  const renderMoodIndicators = () => {
    const indicators = [
      { value: 0.8, label: 'Very Positive', color: 'rgb(16, 185, 129)' },
      { value: 0.4, label: 'Positive', color: 'rgb(52, 211, 153)' },
      { value: 0, label: 'Neutral', color: 'rgb(59, 130, 246)' },
      { value: -0.4, label: 'Negative', color: 'rgb(239, 113, 113)' },
      { value: -0.8, label: 'Very Negative', color: 'rgb(239, 68, 68)' },
    ];
    
    return (
      <div className="flex justify-between px-2 mt-2 text-xs text-[#B8C7E0]">
        {indicators.map((indicator, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="w-3 h-3 rounded-full mb-1" 
              style={{ backgroundColor: indicator.color }}
            ></div>
            <span>{indicator.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] p-5 rounded-xl border border-[#2A3547]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium flex items-center">
            <FaCalendarDay className="text-[#5983FC] mr-2" />
            3-Day Mood Forecast
          </h3>
          <div className="flex items-center px-3 py-1 rounded-full" style={{ backgroundColor: directionInfo.bgColor }}>
            <span style={{ color: directionInfo.color }} className="mr-1">{directionInfo.icon}</span>
            <span className="text-sm text-[#B8C7E0]">Your mood is {directionInfo.text}</span>
          </div>
        </div>
        
        <div className="h-80 mb-4">
          <Line data={chartData} options={chartOptions} />
        </div>
        
        {/* Legend for mood indicators */}
        {renderMoodIndicators()}
        
        <div className="flex justify-between items-center text-sm text-[#64748B] mt-4">
          <span>Based on your emotional patterns using Holt's Exponential Smoothing</span>
          <span>Forecast confidence: {accuracy}%</span>
        </div>
      </div>
      
      <div className="bg-[#0F172A] p-5 rounded-xl border border-[#2A3547]">
        <h3 className="text-white font-medium mb-4">Forecast Insights</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div style={{ backgroundColor: directionInfo.bgColor }} className="p-2 rounded-lg mr-3">
              <span style={{ color: directionInfo.color }}>{directionInfo.icon}</span>
            </div>
            <div>
              <h4 className="text-[#B8C7E0] font-medium">Mood Trajectory</h4>
              <p className="text-[#B8C7E0] text-sm">
                Your emotional state appears to be {analysis.expectedMoodDirection}. 
                {analysis.isVolatile 
                  ? " Your emotions have been quite variable recently, which makes forecasting less certain."
                  : " Your emotions have been relatively consistent, which increases forecast reliability."}
              </p>
            </div>
          </div>
          
          {analysis.suddenChange && (
            <div className="flex items-start">
              <div className="bg-amber-500/20 p-2 rounded-lg mr-3">
                <FaExclamation className="text-amber-400" />
              </div>
              <div>
                <h4 className="text-[#B8C7E0] font-medium">Recent Significant Change</h4>
                <p className="text-[#B8C7E0] text-sm">
                  We've detected a substantial shift in your recent mood. This may affect the accuracy of forecasts.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <div className="bg-[#3E60C1]/20 p-2 rounded-lg mr-3">
              <FaLightbulb className="text-[#5983FC]" />
            </div>
            <div>
              <h4 className="text-[#B8C7E0] font-medium">Proactive Recommendation</h4>
              <p className="text-[#B8C7E0] text-sm">
                {analysis.moodState === 'positive' && analysis.expectedMoodDirection === 'declining'
                  ? "While your mood is currently positive, our forecast suggests a potential decline. Consider scheduling activities you know boost your mood."
                  : analysis.moodState === 'negative' && analysis.expectedMoodDirection === 'improving'
                  ? "Though you've been experiencing challenging emotions, our forecast suggests improvement ahead. Continue with supportive activities."
                  : analysis.moodState === 'negative' && analysis.expectedMoodDirection === 'declining'
                  ? "Our forecast suggests your mood may continue to be challenging. This might be a good time to reach out for additional support."
                  : "Maintain your current self-care routines, as they appear to be supporting your emotional well-being."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodForecast; 