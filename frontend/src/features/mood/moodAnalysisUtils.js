/**
 * Analyzes mood trends and provides personalized recommendations
 * @param {Array} logs - Array of mood log entries
 * @param {String} period - Selected period ('week', 'month', 'year', 'all')
 * @returns {Object} Analysis results with recommendations
 */
export const analyzeMoodTrends = (logs, period = 'week') => {
  if (!logs || logs.length === 0) {
    return {
      status: "insufficient_data",
      message: "Need more mood entries for trend analysis",
      recommendation: "Continue logging your moods daily to get personalized insights."
    };
  }

  // Map moods to numerical values (-1 to 1 scale)
  const moodScores = {
    // Positive emotions
    'admiration': 0.7,
    'amusement': 0.6,
    'approval': 0.5,
    'caring': 0.5,
    'excitement': 0.8,
    'gratitude': 0.6,
    'joy': 0.9,
    'love': 0.8,
    'optimism': 0.7,
    'pride': 0.6,
    'relief': 0.5,
    
    // Neutral emotions
    'neutral': 0.0,
    'surprise': 0.1,
    'curiosity': 0.2,
    'realization': 0.2,
    'desire': 0.3,
    'confusion': -0.1,
    'nervousness': -0.2,
    
    // Negative emotions
    'anger': -0.8,
    'annoyance': -0.5,
    'disappointment': -0.6,
    'disapproval': -0.5,
    'disgust': -0.7,
    'embarrassment': -0.4,
    'fear': -0.7,
    'grief': -0.9,
    'remorse': -0.6,
    'sadness': -0.8
  };

  // Sort logs by date (oldest to newest)
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Create weighted scores, incorporating intensity
  const moodData = sortedLogs.map(log => ({
    date: new Date(log.date),
    score: (moodScores[log.mood] || 0) * (log.intensity / 10),
    mood: log.mood,
    intensity: log.intensity
  }));

  // Filter by period if needed
  let filteredMoodData = moodData;
  if (period !== 'all') {
    const now = new Date();
    let cutoffDate;
    
    if (period === 'week') {
      cutoffDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === 'month') {
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (period === 'year') {
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    filteredMoodData = moodData.filter(item => item.date >= cutoffDate);
  }

  if (filteredMoodData.length < 3) {
    return {
      status: "insufficient_data",
      message: `Need more mood entries in the selected ${period} for trend analysis`,
      recommendation: "Try selecting a longer time period or continue logging your moods regularly."
    };
  }

  // =====================================
  // NEW: Holt-Winters Exponential Smoothing
  // =====================================
  
  // Extract scores for time series analysis
  const scores = filteredMoodData.map(item => item.score);
  
  // Hyperparameters for the exponential smoothing
  // Alpha: weight for level (0-1) - higher means more weight to recent observations
  // Beta: weight for trend (0-1) - higher means trend changes faster
  const alpha = 0.3; // Level smoothing factor
  const beta = 0.1;  // Trend smoothing factor
  
  // Initialize arrays to store the components
  const smoothedLevel = new Array(scores.length);
  const trend = new Array(scores.length);
  const forecast = new Array(scores.length);
  
  // Initialize the first values
  smoothedLevel[0] = scores[0];
  trend[0] = scores.length > 1 ? scores[1] - scores[0] : 0;
  forecast[0] = smoothedLevel[0];
  
  // Apply Holt's Exponential Smoothing
  for (let t = 1; t < scores.length; t++) {
    // Update level component
    smoothedLevel[t] = alpha * scores[t] + (1 - alpha) * (smoothedLevel[t-1] + trend[t-1]);
    
    // Update trend component
    trend[t] = beta * (smoothedLevel[t] - smoothedLevel[t-1]) + (1 - beta) * trend[t-1];
    
    // Forecast for current period (needed for later analysis)
    forecast[t] = smoothedLevel[t-1] + trend[t-1];
  }
  
  // Calculate forecast for future periods (next 3 days)
  const futureForecast = [];
  let lastLevel = smoothedLevel[smoothedLevel.length - 1];
  let lastTrend = trend[trend.length - 1];
  
  for (let i = 1; i <= 3; i++) {
    const nextValue = lastLevel + (i * lastTrend);
    futureForecast.push(nextValue);
  }
  
  // Calculate Mean Absolute Error (MAE) for model validation
  let totalError = 0;
  for (let t = 1; t < scores.length; t++) {
    totalError += Math.abs(scores[t] - forecast[t]);
  }
  const mae = totalError / (scores.length - 1);
  
  // For comparison: Calculate forecast without trend (Simple Exponential Smoothing)
  const simpleSmoothed = new Array(scores.length);
  simpleSmoothed[0] = scores[0];
  for (let t = 1; t < scores.length; t++) {
    simpleSmoothed[t] = alpha * scores[t] + (1 - alpha) * simpleSmoothed[t-1];
  }
  
  // Calculate Mean Absolute Error for simple model
  let simpleError = 0;
  for (let t = 1; t < scores.length; t++) {
    simpleError += Math.abs(scores[t] - simpleSmoothed[t-1]);
  }
  const simpleMae = simpleError / (scores.length - 1);
  
  // Determine if trend model is better (lower MAE)
  const useTrendModel = mae < simpleMae;
  
  // Calculate trend direction and strength using exponential smoothing results
  const lastForecast = forecast[forecast.length - 1];
  const currentValue = scores[scores.length - 1];
  
  // Use the trend component directly from Holt's method
  const trendValue = trend[trend.length - 1];
  
  // Check for sudden changes - compare last actual to last forecast
  const recentForecastError = Math.abs(currentValue - lastForecast);
  const suddenChange = recentForecastError > 0.6;
  
  // Determine trend strength based on the trend component
  let trendStrength = 'stable';
  if (Math.abs(trendValue) > 0.2) {
    trendStrength = trendValue > 0 ? 'strongly_improving' : 'strongly_declining';
  } else if (Math.abs(trendValue) > 0.05) {
    trendStrength = trendValue > 0 ? 'slightly_improving' : 'slightly_declining';
  }
  
  // Get current mood state from the most recent smoothed level
  let moodState = 'neutral';
  const currentSmoothedLevel = smoothedLevel[smoothedLevel.length - 1];
  if (currentSmoothedLevel > 0.3) {
    moodState = 'positive';
  } else if (currentSmoothedLevel < -0.3) {
    moodState = 'negative';
  }
  
  // Get 3-day mood forecast
  const threeDayForecast = futureForecast[2]; // 3rd day forecast
  const expectedMoodDirection = threeDayForecast > currentSmoothedLevel ? 'improving' : 
                               (threeDayForecast < currentSmoothedLevel ? 'declining' : 'stable');
  
  // Calculate mood volatility - standard deviation of errors
  let sumSquaredErrors = 0;
  for (let t = 1; t < scores.length; t++) {
    sumSquaredErrors += Math.pow(scores[t] - forecast[t], 2);
  }
  const volatility = Math.sqrt(sumSquaredErrors / (scores.length - 1));
  const isVolatile = volatility > 0.4;
  
  // Generate insights and recommendations
  const analysis = {
    status: "analyzed",
    currentMoodScore: currentSmoothedLevel,
    trendDirection: trendValue,
    trendStrength,
    moodState,
    suddenChange,
    isVolatile,
    forecastedMood: threeDayForecast,
    expectedMoodDirection,
    percentPositive: (filteredMoodData.filter(m => m.score > 0.2).length / filteredMoodData.length) * 100,
    percentNegative: (filteredMoodData.filter(m => m.score < -0.2).length / filteredMoodData.length) * 100,
    modelAccuracy: 1 - (mae / 2), // Normalized to 0-1 scale (since mood scores are -1 to 1)
    // Technical data for debugging or advanced displays
    _technicalData: {
      forecastHorizon: 3,
      alpha,
      beta,
      mae,
      simpleMae,
      volatility,
      useTrendModel,
      futureForecast
    },
    ...getRecommendations(moodState, trendStrength, suddenChange, expectedMoodDirection, isVolatile)
  };
  
  return analysis;
};

/**
 * Generates personalized recommendations based on mood analysis
 * Enhanced to use additional insights from the exponential smoothing model
 */
function getRecommendations(moodState, trendStrength, suddenChange, expectedDirection, isVolatile) {
  // Handle volatility as a special case
  if (isVolatile) {
    return {
      insight: "Your emotions have been quite variable recently.",
      recommendation: "Emotional variability can be challenging. Establishing routines and practicing mindfulness may help stabilize your mood.",
      activities: [
        "Establish consistent sleep and meal schedules",
        "Practice daily mindfulness meditation (even just 5 minutes)",
        "Create a mood journal to identify triggers for mood changes",
        "Focus on activities that bring a sense of calm and stability",
        "Consider talking with a professional about emotional regulation strategies"
      ]
    };
  }

  // Handle sudden changes first
  if (suddenChange) {
    if (moodState === 'positive') {
      return {
        insight: "I notice a significant positive shift in your mood!",
        recommendation: "Take a moment to reflect on what contributed to this positive change. Understanding what helps your mood can be valuable for your future well-being.",
        activities: [
          "Journal about what triggered this positive emotional shift",
          "Share your joy or excitement with someone you trust",
          "Practice gratitude by listing 3 things you're thankful for"
        ]
      };
    } else if (moodState === 'negative') {
      return {
        insight: "I notice a significant drop in your mood recently.",
        recommendation: "Sudden emotional changes can be challenging. Consider some immediate self-care strategies to help process these feelings.",
        activities: [
          "Try a 5-minute mindfulness or deep breathing exercise",
          "Get some fresh air with a short walk outside",
          "Connect with a supportive friend or family member",
          "Engage in a simple, enjoyable activity that might provide relief"
        ]
      };
    }
  }

  // Enhanced recommendations based on mood state, trend, and forecasted direction
  switch (moodState) {
    case 'positive':
      if (trendStrength.includes('improving') && expectedDirection === 'improving') {
        return {
          insight: "Your emotions have been increasingly positive and may continue improving.",
          recommendation: "You're in a great emotional place with positive momentum. This is an ideal time to build resilience and set new goals.",
          activities: [
            "Reflect on what's contributing to your joy, love, or optimism",
            "Challenge yourself with a new goal or learning opportunity",
            "Express gratitude to someone who has positively impacted you",
            "Create a list of activities that boost your mood for future reference"
          ]
        };
      } else if (expectedDirection === 'declining') {
        return {
          insight: "Your mood has been positive, but our analysis suggests it may decrease slightly in the coming days.",
          recommendation: "Being proactive about self-care can help maintain your emotional well-being through potential challenges ahead.",
          activities: [
            "Schedule an activity that reliably brings you joy or excitement",
            "Check in on your basic needs - sleep, hydration, nutrition",
            "Take some time for a hobby or activity you truly enjoy",
            "Practice a brief gratitude exercise to reinforce positive emotions"
          ]
        };
      } else {
        return {
          insight: "Your emotions have been consistently positive lately.",
          recommendation: "You're doing well! This is a great time to understand what's working and build healthy habits.",
          activities: [
            "Maintain your current self-care routines",
            "Consider journaling about what's contributing to your positive emotions",
            "Share your positive energy through connection with others",
            "Try something new that brings you joy or excitement"
          ]
        };
      }
      
    case 'negative':
      if (trendStrength.includes('improving') && expectedDirection === 'improving') {
        return {
          insight: "Although you've experienced difficult emotions, they're improving and likely to continue getting better.",
          recommendation: "You're on a positive trajectory. Continue with the changes that seem to be helping.",
          activities: [
            "Acknowledge and celebrate small improvements in how you feel",
            "Continue with activities that seem to be helping reduce difficult emotions",
            "Get some physical movement - even a short walk can help lift your mood",
            "Practice self-compassion by speaking kindly to yourself"
          ]
        };
      } else if (trendStrength.includes('declining') || expectedDirection === 'declining') {
        return {
          insight: "I notice your emotions have been challenging and this pattern may continue in the near future.",
          recommendation: "When experiencing persistent difficult feelings, additional support can be very helpful.",
          activities: [
            "Reach out to a trusted friend, family member, or professional",
            "Focus on basic self-care like adequate sleep and nutrition",
            "Try a 10-minute mindfulness exercise to help process emotions",
            "Limit exposure to negative media or stressful situations",
            "Remember that seeking professional support is a sign of strength"
          ]
        };
      } else {
        return {
          insight: "You've been experiencing challenging emotions for a while.",
          recommendation: "Persistent feelings of sadness, anger, or fear may benefit from additional support strategies.",
          activities: [
            "Consider speaking with a mental health professional",
            "Try to establish a routine with regular sleep and meal times",
            "Incorporate some daily physical activity to help process emotions",
            "Practice small acts of self-care throughout your day",
            "Connect with supportive people in your life"
          ]
        };
      }
      
    default: // neutral
      if (expectedDirection === 'improving') {
        return {
          insight: "Your emotional state has been balanced and our analysis suggests it may improve soon.",
          recommendation: "You're on a promising path. Consider activities that will continue this positive momentum.",
          activities: [
            "Engage in activities that have recently brought you positive feelings",
            "Practice mindfulness to better understand your emotional patterns",
            "Connect with friends or family who uplift you",
            "Try something new that interests or excites you"
          ]
        };
      } else if (expectedDirection === 'declining') {
        return {
          insight: "Your mood has been balanced but may face some challenges in the coming days.",
          recommendation: "Taking proactive steps now may help prevent difficult emotions from developing.",
          activities: [
            "Check in with yourself about potential upcoming stressors",
            "Prioritize rest and relaxation activities",
            "Consider a digital detox if media consumption is affecting your emotions",
            "Spend time in nature if possible"
          ]
        };
      } else {
        return {
          insight: "Your emotional state has been relatively stable lately and is likely to remain so.",
          recommendation: "This is a good time to build emotional resilience for the future.",
          activities: [
            "Experiment with new self-care activities to see what works for you",
            "Practice mindfulness or meditation to build emotional awareness",
            "Focus on strengthening your social connections",
            "Consider learning a new coping skill or stress management technique"
          ]
        };
      }
  }
} 