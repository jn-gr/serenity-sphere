import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MoodCalendarHeatmap = ({ trends }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  if (!trends || trends.length === 0) {
    return (
      <div className="h-full flex items-center justify-center flex-col">
        <p className="text-[#B8C7E0] mb-4">No mood data available yet.</p>
        <p className="text-[#5983FC] text-sm">Start journaling to track your mood!</p>
      </div>
    );
  }

  // Process trends to map date -> average mood score
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

  // Create a map of date -> mood data
  const moodsByDate = trends.reduce((acc, trend) => {
    const date = trend.date;
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0, moods: [] };
    }
    
    // Calculate mood score
    const moodValue = moodValues[trend.mood] !== undefined ? moodValues[trend.mood] : 5;
    const intensityModifier = 0.5 + (trend.intensity / 10);
    const score = Math.min(10, Math.max(0, moodValue * intensityModifier));
    
    acc[date].total += score;
    acc[date].count += 1;
    acc[date].moods.push({
      mood: trend.mood,
      intensity: trend.intensity,
      score
    });
    
    return acc;
  }, {});

  // Handle month navigation
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar data
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Get mood color based on score
  const getMoodColor = (score) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 6) return 'bg-emerald-400';
    if (score >= 5) return 'bg-blue-400';
    if (score >= 4) return 'bg-blue-300';
    if (score >= 3) return 'bg-orange-300';
    if (score >= 2) return 'bg-orange-400';
    return 'bg-red-400';
  };

  // Get text for mood score
  const getMoodText = (score) => {
    if (score >= 8) return 'Very Positive';
    if (score >= 6) return 'Positive';
    if (score >= 4) return 'Neutral';
    if (score >= 2) return 'Negative';
    return 'Very Negative';
  };

  // Build calendar UI
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let days = [];

  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-14 bg-[#1A2335] rounded-lg opacity-25"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = moodsByDate[date];
    
    let moodDisplay;
    if (dayData) {
      const averageScore = dayData.total / dayData.count;
      const moodColor = getMoodColor(averageScore);
      const dominantMoods = dayData.moods.map(m => m.mood).join(', ');
      
      moodDisplay = (
        <div 
          className={`h-full flex flex-col items-center justify-center rounded-lg ${moodColor} cursor-pointer transition-transform hover:scale-105`}
          title={`Average Mood: ${getMoodText(averageScore)} (${averageScore.toFixed(1)}/10)\nMoods: ${dominantMoods}`}
        >
          <span className="text-white font-bold">{day}</span>
          <span className="text-white/80 text-xs">{averageScore.toFixed(1)}</span>
        </div>
      );
    } else {
      moodDisplay = (
        <div className="h-full flex items-center justify-center bg-[#1A2335] rounded-lg">
          <span className="text-[#B8C7E0]">{day}</span>
        </div>
      );
    }

    days.push(
      <div key={day} className="h-14">
        {moodDisplay}
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A] rounded-xl p-6 border border-[#2A3547]">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPrevMonth}
          className="p-2 rounded-lg bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547]"
        >
          <FaChevronLeft />
        </button>
        <h3 className="text-white font-semibold">
          {monthName} {currentYear}
        </h3>
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-lg bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547]"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center">
            <span className="text-[#B8C7E0] text-sm font-medium">{day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#B8C7E0]">Mood Scale:</span>
          <div className="w-4 h-4 rounded-sm bg-red-400"></div>
          <div className="w-4 h-4 rounded-sm bg-orange-400"></div>
          <div className="w-4 h-4 rounded-sm bg-blue-300"></div>
          <div className="w-4 h-4 rounded-sm bg-blue-400"></div>
          <div className="w-4 h-4 rounded-sm bg-emerald-400"></div>
          <div className="w-4 h-4 rounded-sm bg-emerald-500"></div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs text-red-400">Very Negative</span>
          <span className="text-xs text-orange-400">Negative</span>
          <span className="text-xs text-blue-300">Neutral</span>
          <span className="text-xs text-emerald-400">Positive</span>
          <span className="text-xs text-emerald-500">Very Positive</span>
        </div>
      </div>
    </div>
  );
};

export default MoodCalendarHeatmap; 