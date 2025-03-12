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
import { FaCalendarDay, FaArrowTrendUp, FaArrowTrendDown, FaMinus, FaLightbulb } from 'react-icons/fa6';
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
  
  // Prepare chart data
  const chartData = {
    labels: getDayLabels(),
    datasets: [
      {
        label: 'Mood Forecast',
        data: [
          analysis.currentMoodScore, 
          analysis._technicalData.futureForecast[0], 
          analysis._technicalData.futureForecast[1], 
          analysis._technicalData.futureForecast[2]
        ],
        fill: {
          target: 'origin',
          above: directionInfo.bgColor,
          below: 'rgba(75, 85, 99, 0.1)'
        },
        borderColor: directionInfo.color,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: directionInfo.color
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: {
          color: 'rgba(42, 53, 71, 0.5)'
        },
        ticks: {
          color: '#B8C7E0',
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
          color: '#B8C7E0'
        }
      },
      x: {
        grid: {
          color: 'rgba(42, 53, 71, 0.5)'
        },
        ticks: {
          color: '#B8C7E0'
        },
        title: {
          display: true,
          text: 'Date',
          color: '#B8C7E0'
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
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const score = context.raw;
            return [
              `Mood: ${formatMoodScore(score)}`,
              `Score: ${(score * 100).toFixed(0)}%`
            ];
          }
        }
      }
    }
  };
  
  const accuracy = Math.round(analysis.modelAccuracy * 100);
  
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