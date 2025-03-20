import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaTimes, FaLightbulb, FaExternalLinkAlt } from 'react-icons/fa';
import ExerciseModal from './ExerciseModal';

const MoodCausePrompt = ({ notification, onClose }) => {
  const [selectedCause, setSelectedCause] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dominantEmotion, setDominantEmotion] = useState('');
  const [activeExercise, setActiveExercise] = useState(null);
  const [isFalsePositive, setIsFalsePositive] = useState(false);
  // Add state for positive reinforcement mode
  const [showPositiveReinforcement, setShowPositiveReinforcement] = useState(false);
  
  // Enhanced emotion categorization based on your mood chart values
  const emotionCategories = {
    veryPositive: ['happy', 'excited', 'loving', 'optimistic', 'proud', 'grateful', 'relieved', 'amused'],
    positive: ['calm', 'caring', 'surprised', 'curious'],
    neutral: ['neutral', 'confused'],
    negative: ['anxious', 'nervous', 'embarrassed', 'disappointed', 'annoyed', 'disapproving', 'sad'],
    veryNegative: ['angry', 'grieving', 'disgusted', 'remorseful']
  };
  
  // Map emotions to recommended categories
  const emotionToCategoryMap = {
    // Very positive emotions
    'happy': ['joy', 'gratitude'],
    'excited': ['joy', 'creative'],
    'loving': ['relationship', 'gratitude'],
    'optimistic': ['optimism', 'achievement'],
    'proud': ['achievement', 'optimism'],
    'grateful': ['gratitude', 'joy'],
    'relieved': ['stress', 'health'],
    'amused': ['joy'],
    
    // Positive emotions
    'calm': ['stress', 'health'],
    'caring': ['relationship', 'gratitude'],
    'surprised': ['transition'],
    'curious': ['creative', 'confusion'],
    
    // Neutral emotions
    'neutral': ['transition', 'confusion'],
    'confused': ['confusion', 'transition'],
    
    // Negative emotions
    'anxious': ['anxiety', 'stress'],
    'nervous': ['anxiety', 'stress'],
    'embarrassed': ['disappointment'],
    'disappointed': ['disappointment', 'transition'],
    'annoyed': ['anger', 'stress'],
    'disapproving': ['relationship', 'anger'],
    'sad': ['grief', 'disappointment'],
    
    // Very negative emotions
    'angry': ['anger', 'stress'],
    'grieving': ['grief', 'loss'],
    'disgusted': ['anger'],
    'remorseful': ['grief', 'disappointment']
  };
  
  // Map causes to categories for recommendations
  const causeToCategoryMap = {
    // Positive causes
    'achievement': 'achievement',
    'connection': 'relationship',
    'self_care': 'health',
    'health': 'health',
    'gratitude': 'gratitude',
    'new_opportunity': 'transition',
    'creative': 'creative',
    'other_positive': 'joy',
    
    // Growth-related causes
    'growth': 'achievement',
    'recognition': 'achievement',
    'appreciation': 'gratitude',
    'support': 'relationship',
    'opportunity': 'transition',
    'belonging': 'relationship',
    'intimacy': 'relationship',
    'anticipation': 'optimism',
    'new_experience': 'creative',
    'breakthrough': 'achievement',
    
    // Neutral causes
    'perspective': 'transition',
    'realization': 'confusion',
    'mixed_feelings': 'confusion',
    'transition': 'transition',
    'other_neutral': 'transition',
    
    // Negative causes
    'loss': 'grief',
    'stress': 'stress',
    'relationship': 'relationship',
    'work': 'work',
    'health_anxiety': 'health',
    'loneliness': 'loneliness',
    'financial': 'financial',
    'other_negative': 'stress',
    
    // Specific negative causes
    'uncertainty': 'anxiety',
    'performance': 'anxiety',
    'injustice': 'anger',
    'boundary': 'anger',
    'frustration': 'anger',
    'end': 'grief',
    'change': 'transition',
    'expectation': 'disappointment',
    'letdown': 'disappointment',
    'failure': 'disappointment'
  };
  
  // Extract emotion from notification message and track mood history
  useEffect(() => {
    if (notification?.message) {
      console.log("Processing notification message:", notification.message);
      
      // Try to extract specific emotion from message
      const allEmotions = [
        ...emotionCategories.veryPositive,
        ...emotionCategories.positive,
        ...emotionCategories.neutral,
        ...emotionCategories.negative,
        ...emotionCategories.veryNegative
      ];
      
      // Find which emotion is mentioned in the notification
      const mentionedEmotion = allEmotions.find(emotion => 
        notification.message.toLowerCase().includes(emotion)
      );
      
      if (mentionedEmotion) {
        setDominantEmotion(mentionedEmotion);
        console.log("Detected dominant emotion:", mentionedEmotion);
      }
      
      // Look for mood transition language in the message
      const transitionKeywords = ['change', 'shift', 'transition', 'moved', 'went', 'from', 'to', 'declined', 'improved'];
      const hasTransitionLanguage = transitionKeywords.some(keyword => 
        notification.message.toLowerCase().includes(keyword)
      );
      
      if (hasTransitionLanguage) {
        console.log("Notification contains transition language");
      }
    }
  }, [notification]);
  
  // Modify the determineEmotionalChange function for better detection
  const determineEmotionalChange = () => {
    // Check if notification message exists
    if (!notification?.message) {
      return { isNeutral: true };
    }
    
    const messageText = notification.message.toLowerCase();
    console.log("Analyzing message for emotional change:", messageText);
    
    // Check for explicit transitions in the message
    const isTransitionMessage = messageText.includes('change') || 
                                messageText.includes('shift') || 
                                messageText.includes('transition') ||
                                messageText.includes('moved from') ||
                                (messageText.includes('from') && messageText.includes('to')) ||
                                messageText.includes('declined') ||
                                messageText.includes('improved');
    
    // Check if message explicitly mentions current sadness
    const isSadNow = messageText.includes('now sad') || 
                     messageText.includes('feeling sad') || 
                     messageText.includes('become sad') ||
                     messageText.includes('turned sad');
                     
    // Check if message explicitly mentions past happiness
    const wasHappyBefore = messageText.includes('was happy') || 
                           messageText.includes('were happy') ||
                           messageText.includes('previously happy');
    
    // Check for specific mentions of sustained sadness
    if (messageText.includes('sad for') || 
        messageText.includes('been sad') || 
        messageText.includes('extended sadness') ||
        messageText.includes('continued sadness')) {
      console.log("Detected sustained sadness");
      return { isPositive: false, isSustained: true };
    }
    
    // Detect happy → sad transition
    if ((isTransitionMessage && messageText.includes('sad')) || 
        (isSadNow && wasHappyBefore) ||
        (notification.type === 'mood_shift' && messageText.includes('sad'))) {
      console.log("Detected transition to sadness");
      return { isPositive: false, isTransition: true, fromPositive: true };
    }
    
    // Process standard mood shift patterns with "from" and "to"
    if (messageText.includes('from') && messageText.includes('to')) {
      let fromEmotion = '';
      let toEmotion = '';
      
      // Try to extract the specific emotions
      const allEmotions = [
        ...emotionCategories.veryPositive,
        ...emotionCategories.positive,
        ...emotionCategories.neutral,
        ...emotionCategories.negative,
        ...emotionCategories.veryNegative
      ];
      
      for (const emotion of allEmotions) {
        // Check for patterns like "from [emotion]" or "to [emotion]"
        const fromPattern = new RegExp(`from\\s+${emotion}`);
        const toPattern = new RegExp(`to\\s+${emotion}`);
        
        if (fromPattern.test(messageText)) fromEmotion = emotion;
        if (toPattern.test(messageText)) toEmotion = emotion;
      }
      
      if (fromEmotion && toEmotion) {
        // Determine which categories these emotions belong to
        const getCategory = (emotion) => {
          for (const [category, emotions] of Object.entries(emotionCategories)) {
            if (emotions.includes(emotion)) return category;
          }
          return 'neutral';
        };
        
        const fromCategory = getCategory(fromEmotion);
        const toCategory = getCategory(toEmotion);
        
        // Categorize the change
        const categoryRanking = ['veryNegative', 'negative', 'neutral', 'positive', 'veryPositive'];
        const fromRank = categoryRanking.indexOf(fromCategory);
        const toRank = categoryRanking.indexOf(toCategory);
          
        console.log(`Detected mood change from ${fromEmotion} (${fromCategory}) to ${toEmotion} (${toCategory})`);
        
        if (toRank > fromRank) return { isPositive: true, fromEmotion, toEmotion };
        if (toRank < fromRank) return { isPositive: false, fromEmotion, toEmotion };
        return { isNeutral: true, fromEmotion, toEmotion };
      }
    }
    
    // Simpler checks for emotional content
    const containsNegativeEmotion = emotionCategories.negative.some(emotion => 
      messageText.includes(emotion)
    ) || emotionCategories.veryNegative.some(emotion => 
      messageText.includes(emotion)
    );
    
    const containsPositiveEmotion = emotionCategories.positive.some(emotion => 
      messageText.includes(emotion)
    ) || emotionCategories.veryPositive.some(emotion => 
      messageText.includes(emotion)
    );
    
    // IMPORTANT: For type="mood_shift" notifications that mention sad/negative emotions,
    // assume it's a transition to negative if not explicitly stated otherwise
    if (notification.type === 'mood_shift' && containsNegativeEmotion) {
      console.log("Mood shift notification with negative emotion - assuming transition to negative");
      return { isPositive: false, isTransition: true, fromPositive: true };
    }
    
    // Basic negative/positive detection
    if (messageText.includes('sad') || containsNegativeEmotion) {
      console.log("Detected negative emotional state");
      return { isPositive: false };
    }
    
    if (messageText.includes('happy') || containsPositiveEmotion) {
      console.log("Detected positive emotional state");
      return { isPositive: true };
    }
    
    // Check notification type as a fallback
    if (notification.type === 'mood_shift') {
      console.log("Generic mood shift notification - defaulting to negative transition");
      return { isPositive: false, isTransition: true };
    }
    
    console.log("Defaulting to neutral emotional change");
    return { isNeutral: true };
  };
  
  const emotionalChange = determineEmotionalChange();
  
  // Determine if this is a consistently positive state that doesn't need intervention
  useEffect(() => {
    if (notification?.message) {
      const messageText = notification.message.toLowerCase();
      console.log("Checking for positive consistency in:", messageText);
      
      // Check if this is a positive consistency notification rather than a change
      const isConsistentlyPositive = 
        (messageText.includes('consistently') || messageText.includes('continue') || 
         messageText.includes('maintained') || messageText.includes('still')) &&
        (messageText.includes('happy') || messageText.includes('positive') || 
         messageText.includes('good mood') || messageText.includes('well-being'));
      
      // Or if it's just reporting continued positive state without mentioning change
      const hasPositiveEmotions = emotionCategories.veryPositive.some(emotion => 
        messageText.includes(emotion)
      ) || emotionCategories.positive.some(emotion => 
        messageText.includes(emotion)
      );
      
      const mentionsChange = messageText.includes('change') || 
                            messageText.includes('shift') || 
                            messageText.includes('different') ||
                            (messageText.includes('from') && messageText.includes('to'));
      
      // Force positive reinforcement for positive emotions regardless of change mention
      // This overrides the default behavior to catch more cases
      if (emotionalChange.isPositive) {
        console.log("Detected positive emotional state - showing reinforcement message");
        setShowPositiveReinforcement(true);
      }
      
      // If positive emotions mentioned but no change mentioned, it's likely just reporting good mood
      if (hasPositiveEmotions && !mentionsChange) {
        console.log("Detected consistently positive state");
        setShowPositiveReinforcement(true);
      }
      
      // Explicit consistent positive message
      if (isConsistentlyPositive) {
        console.log("Detected explicit positive consistency message");
        setShowPositiveReinforcement(true);
      }
      
      // If the notification type is 'mood_shift' but the emotion is positive,
      // override to show positive reinforcement
      if (notification.type === 'mood_shift' && hasPositiveEmotions) {
        console.log("Overriding mood shift notification with positive emotions");
        setShowPositiveReinforcement(true);
      }
      
      // Extract dominant emotion from notification
      const allEmotions = [
        ...emotionCategories.veryPositive,
        ...emotionCategories.positive,
        ...emotionCategories.neutral,
        ...emotionCategories.negative,
        ...emotionCategories.veryNegative
      ];
      
      const mentionedEmotion = allEmotions.find(emotion => 
        messageText.includes(emotion)
      );
      
      if (mentionedEmotion) {
        setDominantEmotion(mentionedEmotion);
        console.log("Detected dominant emotion:", mentionedEmotion);
      }
    }
  }, [notification, emotionalChange]);
  
  // Add positive reinforcement messages based on dominant emotion
  const getPositiveReinforcementMessage = () => {
    // Base messages for different positive emotions
    const emotionMessages = {
      'happy': [
        "You're maintaining a happy mood - that's wonderful! Keep engaging in activities that bring you joy.",
        "Your consistent happiness is something to celebrate. What positive habits have been working for you?"
      ],
      'excited': [
        "Your excitement continues to shine through! Channeling that energy into meaningful activities can be rewarding.",
        "Maintaining your excitement is wonderful. What are you looking forward to?"
      ],
      'grateful': [
        "Your grateful mindset is serving you well. Continuing to practice gratitude strengthens positive emotions.",
        "You've been feeling grateful consistently - this attitude is linked to greater well-being!"
      ],
      'calm': [
        "Your calm state of mind is valuable. Continue nurturing this peaceful mindset.",
        "Maintaining a sense of calm is a significant achievement in today's busy world."
      ],
      'optimistic': [
        "Your optimistic outlook continues to serve you well. This perspective helps build resilience.",
        "Staying optimistic is a powerful way to navigate life's challenges. Well done!"
      ],
      'proud': [
        "You continue to feel a sense of pride - acknowledging your accomplishments is important!",
        "Your consistent feeling of pride reflects your commitment to your values and goals."
      ]
    };
    
    // Default messages if no specific emotion is detected
    const defaultMessages = [
      "You're maintaining positive emotions - that's something to celebrate!",
      "Your consistent positive mood is a reflection of your healthy mental habits.",
      "Keeping up a positive mindset is an achievement worth recognizing.",
      "Your emotional well-being appears strong - remember the practices that help you stay this way!"
    ];
    
    // Get messages for the dominant emotion or use defaults
    const relevantMessages = dominantEmotion && emotionMessages[dominantEmotion]
      ? emotionMessages[dominantEmotion]
      : defaultMessages;
    
    // Pick a random message from the relevant set
    return relevantMessages[Math.floor(Math.random() * relevantMessages.length)];
  };
  
  // Generate random wellness tip
  const getWellnessTip = () => {
    const wellnessTips = [
      "Spending time in nature can boost your mood and energy levels.",
      "Regular physical activity helps maintain positive emotions.",
      "Quality sleep is essential for emotional regulation and well-being.",
      "Social connections are a key factor in sustained happiness.",
      "Mindfulness practice can help you appreciate positive moments more fully.",
      "Creative expression is linked to greater emotional well-being.",
      "Setting and achieving small daily goals can maintain a sense of accomplishment.",
      "Practicing gratitude regularly helps sustain positive emotions.",
      "Deep breathing exercises can help maintain a calm state of mind.",
      "Finding meaning in your daily activities strengthens positive emotions."
    ];
    
    return wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
  };
  
  // Close the positive reinforcement message and log it
  const handlePositiveAcknowledgment = () => {
    console.log("User acknowledged positive reinforcement message");
    // You could add analytics tracking here
    onClose();
  };
  
  // Define cause options based on notification type and direction
  const getCauseOptions = () => {
    console.log("Getting cause options for emotional change:", emotionalChange);
    
    // Special case for transitions from positive to negative
    if (emotionalChange.isTransition && emotionalChange.fromPositive && !emotionalChange.isPositive) {
      console.log("Showing causes for positive → negative transition");
      return [
        { id: 'disappointment', label: 'Disappointment or letdown' },
        { id: 'stress', label: 'New stress or pressure' },
        { id: 'loss', label: 'Recent loss or setback' },
        { id: 'relationship', label: 'Change in relationship' },
        { id: 'health', label: 'Health concern or physical discomfort' },
        { id: 'expectation', label: 'Unmet expectations' },
        { id: 'uncertainty', label: 'New uncertainty or worry' },
        { id: 'other_negative', label: 'Something else' }
      ];
    }
    
    if (emotionalChange.isPositive) {
      // Personalize positive causes based on the specific emotion if available
      const specificCauses = {
        'proud': [
          { id: 'achievement', label: 'Personal achievement or success' },
          { id: 'growth', label: 'Personal growth or development' },
          { id: 'recognition', label: 'Recognition from others' }
        ],
        'grateful': [
          { id: 'appreciation', label: 'Appreciation for what you have' },
          { id: 'support', label: 'Support from others' },
          { id: 'opportunity', label: 'New opportunity or chance' }
        ],
        'loving': [
          { id: 'connection', label: 'Quality time with loved ones' },
          { id: 'intimacy', label: 'Intimate connection with someone' },
          { id: 'belonging', label: 'Sense of belonging or community' }
        ],
        'excited': [
          { id: 'anticipation', label: 'Anticipation of something good' },
          { id: 'new_experience', label: 'New experience or adventure' },
          { id: 'breakthrough', label: 'Breakthrough or discovery' }
        ]
      };
      
      // If we have specific causes for the dominant emotion, include them
      const emotionSpecificCauses = (dominantEmotion && specificCauses[dominantEmotion]) 
        ? specificCauses[dominantEmotion] 
        : [];
      
      // Default positive causes
      const defaultPositiveCauses = [
        { id: 'achievement', label: 'Personal achievement or success' },
        { id: 'connection', label: 'Quality time with loved ones' },
        { id: 'self_care', label: 'Self-care activities' },
        { id: 'health', label: 'Health improvement' },
        { id: 'gratitude', label: 'Practicing gratitude' },
        { id: 'new_opportunity', label: 'New opportunity or change' },
        { id: 'creative', label: 'Creative expression' },
        { id: 'other_positive', label: 'Something else positive' }
      ];
      
      // Combine emotion-specific causes with default causes, avoiding duplicates
      const combinedCauses = [...emotionSpecificCauses];
      defaultPositiveCauses.forEach(cause => {
        if (!combinedCauses.some(c => c.id === cause.id)) {
          combinedCauses.push(cause);
        }
      });
      
      return combinedCauses;
    } else if (emotionalChange.isNeutral) {
      return [
        { id: 'perspective', label: 'Change in perspective' },
        { id: 'realization', label: 'New realization or insight' },
        { id: 'mixed_feelings', label: 'Mixed or complex feelings' },
        { id: 'transition', label: 'Life transition or change' },
        { id: 'other_neutral', label: 'Something else' }
      ];
    } else {
      // For negative changes, especially sustained sadness
      
      // If it's sustained sadness, prioritize these causes
      if (emotionalChange.isSustained) {
        return [
          { id: 'health', label: 'Health concerns or physical wellbeing' },
          { id: 'stress', label: 'Ongoing stress or pressure' },
          { id: 'loss', label: 'Loss or grief' },
          { id: 'loneliness', label: 'Feeling lonely or isolated' },
          { id: 'work', label: 'Work or academic challenges' },
          { id: 'financial', label: 'Financial difficulties' },
          { id: 'relationship', label: 'Relationship challenges' },
          { id: 'other_negative', label: 'Something else' }
        ];
      }
      
      // Personalize negative causes based on the specific emotion if available
      const specificCauses = {
        'anxious': [
          { id: 'uncertainty', label: 'Uncertainty about the future' },
          { id: 'performance', label: 'Performance pressure' },
          { id: 'health_anxiety', label: 'Health concerns or anxiety' }
        ],
        'angry': [
          { id: 'injustice', label: 'Perceived injustice or unfairness' },
          { id: 'boundary', label: 'Boundary violation' },
          { id: 'frustration', label: 'Frustration with circumstances' }
        ],
        'grieving': [
          { id: 'loss', label: 'Loss of a loved one' },
          { id: 'end', label: 'End of a relationship or opportunity' },
          { id: 'change', label: 'Major life change or transition' }
        ],
        'disappointed': [
          { id: 'expectation', label: 'Unmet expectations' },
          { id: 'letdown', label: 'Being let down by someone' },
          { id: 'failure', label: 'Perceived failure or setback' }
        ],
        'sad': [
          { id: 'loss', label: 'Loss of something important' },
          { id: 'disappointment', label: 'Disappointment or setback' },
          { id: 'loneliness', label: 'Feeling lonely or isolated' },
          { id: 'health', label: 'Health concerns or low energy' }
        ]
      };
      
      // If we have specific causes for the dominant emotion, include them
      const emotionSpecificCauses = (dominantEmotion && specificCauses[dominantEmotion]) 
        ? specificCauses[dominantEmotion] 
        : [];
      
      // Default negative causes
      const defaultNegativeCauses = [
        { id: 'loss', label: 'Loss of a loved one' },
        { id: 'stress', label: 'Stress or feeling overwhelmed' },
        { id: 'relationship', label: 'Relationship difficulties' },
        { id: 'work', label: 'Work or academic challenges' },
        { id: 'health', label: 'Health concerns' },
        { id: 'loneliness', label: 'Feeling lonely or isolated' },
        { id: 'financial', label: 'Financial difficulties' },
        { id: 'other_negative', label: 'Something else challenging' }
      ];
      
      // Combine emotion-specific causes with default causes, avoiding duplicates
      const combinedCauses = [...emotionSpecificCauses];
      defaultNegativeCauses.forEach(cause => {
        if (!combinedCauses.some(c => c.id === cause.id)) {
          combinedCauses.push(cause);
        }
      });
      
      return combinedCauses;
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedCause) return;
    
    setIsLoading(true);
    try {
      console.log("Submitting cause:", selectedCause);
      console.log("Dominant emotion:", dominantEmotion);
      console.log("Emotional change type:", 
        emotionalChange.isPositive ? "positive" : 
        emotionalChange.isNeutral ? "neutral" : 
        emotionalChange.isTransition ? "transition to negative" :
        emotionalChange.isSustained ? "sustained negative" : "negative");
      
      // Determine recommended categories
      const recommendedCategories = [];
      
      // Special handling for transitions from positive to negative
      if (emotionalChange.isTransition && emotionalChange.fromPositive) {
        recommendedCategories.push('transition', 'disappointment');
        
        // Add more targeted categories based on the selected cause
        if (selectedCause === 'loss') {
          recommendedCategories.push('grief');
        } else if (selectedCause === 'stress') {
          recommendedCategories.push('stress', 'anxiety');
        } else if (selectedCause === 'disappointment') {
          recommendedCategories.push('disappointment');
        } else if (selectedCause === 'relationship') {
          recommendedCategories.push('relationship');
        } else if (selectedCause === 'health') {
          recommendedCategories.push('health');
        }
      }
      
      // Add emotion-based categories
      if (dominantEmotion && emotionToCategoryMap[dominantEmotion]) {
        recommendedCategories.push(...emotionToCategoryMap[dominantEmotion]);
      } else if (!dominantEmotion && !emotionalChange.isPositive) {
        // If no dominant emotion detected but we know it's negative
        recommendedCategories.push('grief', 'disappointment');
      }
      
      // Add cause-based category
      if (causeToCategoryMap[selectedCause]) {
        recommendedCategories.push(causeToCategoryMap[selectedCause]);
      }
      
      // Remove duplicates
      const uniqueCategories = [...new Set(recommendedCategories)];
      
      console.log("Recommended categories:", uniqueCategories);
      
      // Enhanced API call with transition information
      const response = await axios.post('/api/mood/cause/', {
        notificationId: notification.id,
        cause: selectedCause,
        notificationType: notification.type,
        emotionalDirection: emotionalChange.isPositive ? 'positive' : 
                           emotionalChange.isNeutral ? 'neutral' : 
                           emotionalChange.isTransition ? 'transition_to_negative' : 'negative',
        dominantEmotion: dominantEmotion || undefined,
        isTransition: emotionalChange.isTransition || false,
        fromPositive: emotionalChange.fromPositive || false,
        recommendedCategories: uniqueCategories
      });
      
      console.log("Recommendations response:", response.data);
      
      // Get recommendations from response
      setRecommendations(response.data.recommendations || []);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      
      // Provide personalized fallback recommendations
      let fallbackRecommendations = [];
      
      // Determine recommended category based on emotion and cause
      const targetCategory = causeToCategoryMap[selectedCause] || 
                          (dominantEmotion && emotionToCategoryMap[dominantEmotion]?.[0]) || 
                          (emotionalChange.isPositive ? 'joy' : 
                           emotionalChange.isNeutral ? 'transition' : 'stress');
      
      console.log("Fallback category:", targetCategory);
      
      // Create fallback recommendations based on the determined category
      switch(targetCategory) {
        case 'grief':
          fallbackRecommendations = [
            {
              title: "Grief Journaling Exercise",
              description: "Spend 10 minutes writing about a memory with your loved one. Focus on the emotions this memory brings up.",
              link: "/exercises/grief-journal"
            },
            {
              title: "Breathing Technique: 4-7-8",
              description: "Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.",
              link: "/exercises/breathing"
            }
          ];
          break;
          
        case 'stress':
          fallbackRecommendations = [
            {
              title: "Progressive Muscle Relaxation",
              description: "Tense and then release each muscle group to release physical tension.",
              link: "/exercises/muscle-relaxation"
            },
            {
              title: "5-Minute Mindfulness Practice",
              description: "Take 5 minutes to focus on your breath and notice physical sensations without judgment.",
              link: "/exercises/mindfulness"
            }
          ];
          break;
          
        case 'anxiety':
          fallbackRecommendations = [
            {
              title: "5-4-3-2-1 Grounding Exercise",
              description: "Focus on 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
              link: "/exercises/grounding"
            },
            {
              title: "Worry Time Technique",
              description: "Schedule a dedicated 15-minute 'worry time' each day to contain anxiety to a specific period.",
              link: "/exercises/mindfulness"
            }
          ];
          break;
          
        case 'anger':
          fallbackRecommendations = [
            {
              title: "Anger Cooling Technique",
              description: "When anger arises, count to 10 while taking deep breaths before responding.",
              link: "/exercises/breathing"
            },
            {
              title: "Physical Release",
              description: "Channel anger physically through exercise, like a brisk walk or punching a pillow.",
              link: "/exercises/default"
            }
          ];
          break;
          
        case 'gratitude':
          fallbackRecommendations = [
            {
              title: "Three Good Things Practice",
              description: "Write down three things you're grateful for each day, including why they happened and how they made you feel.",
              link: "/exercises/three-good-things"
            },
            {
              title: "Gratitude Letter",
              description: "Write a letter expressing thanks to someone who has positively impacted your life.",
              link: "/exercises/gratitude"
            }
          ];
          break;
          
        case 'joy':
          fallbackRecommendations = [
            {
              title: "Joy Collection",
              description: "Create a physical or digital collection of things that bring you joy to revisit when needed.",
              link: "/exercises/gratitude"
            },
            {
              title: "Flow Activity",
              description: "Engage in an activity that fully absorbs you and brings a sense of timelessness.",
              link: "/exercises/mindfulness"
            }
          ];
          break;
          
        case 'achievement':
          fallbackRecommendations = [
            {
              title: "Achievement Journal",
              description: "Document your accomplishments, big and small, to build confidence and motivation.",
              link: "/exercises/gratitude"
            },
            {
              title: "Celebration Ritual",
              description: "Create a personal ritual to mark achievements and reinforce positive emotions.",
              link: "/exercises/mindfulness"
            }
          ];
          break;
          
        case 'relationship':
          fallbackRecommendations = [
            {
              title: "Active Listening Exercise",
              description: "Practice listening without interrupting, then summarize what you heard before responding.",
              link: "/exercises/mindfulness"
            },
            {
              title: "Appreciation Practice",
              description: "Share one specific thing you appreciate about someone in your life.",
              link: "/exercises/gratitude"
            }
          ];
          break;
          
        case 'confusion':
          fallbackRecommendations = [
            {
              title: "Mind Map Clarity Exercise",
              description: "Create a mind map of your thoughts to organize them visually and find connections.",
              link: "/exercises/mindfulness"
            },
            {
              title: "Question Refinement",
              description: "Transform vague confusion into specific questions to make challenges more approachable.",
              link: "/exercises/default"
            }
          ];
          break;
          
        case 'transition':
          fallbackRecommendations = [
            {
              title: "Transition Bridge Visualization",
              description: "Visualize yourself walking across a bridge from your past to your future, acknowledging both what you're leaving behind and what lies ahead.",
              link: "/exercises/mindfulness"
            },
            {
              title: "One Small Step",
              description: "Identify one small, manageable action you can take today to move forward in your transition.",
              link: "/exercises/default"
            }
          ];
          break;
          
        default:
          fallbackRecommendations = [
            {
              title: "Self-Care Activity",
              description: "Take some time for yourself today with a simple self-care activity.",
              link: "/exercises/default"
            },
            {
              title: "Basic Mindfulness Practice",
              description: "Find a quiet place to sit and focus on your breath for a few minutes.",
              link: "/exercises/mindfulness"
            }
          ];
      }
      
      // Update fallback recommendations for transitions
      if (emotionalChange.isTransition && emotionalChange.fromPositive) {
        fallbackRecommendations = [
          {
            title: "Coping with Mood Shifts",
            description: "Remember that emotions naturally fluctuate. Try accepting your current feelings without judgment.",
            link: "/exercises/mindfulness"
          },
          {
            title: "Emotional Weather Journal",
            description: "Record how your emotions change throughout the day, noting triggers and patterns.",
            link: "/exercises/default"
          }
        ];
      }
      
      setRecommendations(fallbackRecommendations);
      setShowRecommendations(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle recommendation click
  const handleRecommendationClick = (recommendation) => {
    setActiveExercise(recommendation);
  };
  
  // Add a function to let the user indicate this is a false positive
  const handleFalsePositive = async () => {
    console.log("User reported false positive mood shift notification");
    try {
      // You could add an API call here to report the false positive to your backend
      await axios.post('/api/mood/report-false-positive/', {
        notificationId: notification.id
      }).catch(err => {
        // Silent catch - don't break if endpoint doesn't exist yet
        console.log("Note: False positive reporting endpoint not implemented yet");
      });
    } catch (error) {
      console.error("Error reporting false positive:", error);
    }
    setIsFalsePositive(true);
    onClose(); // Close the prompt
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#1A2335] border border-[#3E60C1] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto mx-4"
        >
          {/* Show positive reinforcement UI when appropriate */}
          {showPositiveReinforcement ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Maintaining Positive Emotions
                </h3>
                <button onClick={onClose} className="text-[#B8C7E0] hover:text-white">
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-4">
                  <div className="flex items-start">
                    <div className="bg-green-500/20 p-2 rounded-full mr-3 mt-1">
                      <FaLightbulb className="text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Great job!</h4>
                      <p className="text-[#B8C7E0]">
                        {getPositiveReinforcementMessage()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547]">
                  <div className="flex items-start">
                    <div className="bg-blue-500/20 p-2 rounded-full mr-3 mt-1">
                      <FaLightbulb className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Wellness Tip</h4>
                      <p className="text-[#B8C7E0]">
                        {getWellnessTip()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePositiveAcknowledgment}
                className="w-full px-4 py-2 rounded-lg bg-[#3E60C1] text-white hover:bg-[#5983FC] transition-colors"
              >
                Thanks!
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {showRecommendations ? 'Recommendations' : 'What might be causing this?'}
                </h3>
                <button onClick={onClose} className="text-[#B8C7E0] hover:text-white">
                  <FaTimes />
                </button>
              </div>
              
              {!showRecommendations ? (
                <>
                  <p className="text-[#B8C7E0] mb-4">
                    {emotionalChange.isPositive
                      ? `That's wonderful! Understanding what improves your ${dominantEmotion || 'mood'} can help maintain positive emotions.`
                      : emotionalChange.isNeutral
                      ? "Understanding these emotional shifts can provide valuable insights."
                      : `Understanding what affects your ${dominantEmotion || 'mood'} can help us provide better support.`}
                  </p>
                  
                  {/* Add a notice about false notifications */}
                  <div className="bg-[#0F172A] p-3 rounded-lg border border-[#2A3547] mb-4">
                    <p className="text-[#B8C7E0] text-sm">
                      Did your mood actually change recently? If you haven't experienced a mood shift, you can indicate there was no change.
                    </p>
                    <button
                      onClick={handleFalsePositive}
                      className="text-[#5983FC] hover:text-[#3E60C1] text-sm mt-2 flex items-center"
                    >
                      No, my mood hasn't changed
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {getCauseOptions().map(option => (
                      <div 
                        key={option.id}
                        onClick={() => setSelectedCause(option.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedCause === option.id
                            ? 'bg-[#3E60C1]/20 border-[#5983FC] text-white'
                            : 'bg-[#0F172A] border-[#2A3547] text-[#B8C7E0] hover:border-[#3E60C1]'
                        }`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg text-[#B8C7E0] hover:text-white transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedCause || isLoading}
                      className={`px-4 py-2 rounded-lg ${
                        selectedCause && !isLoading
                          ? 'bg-[#3E60C1] text-white hover:bg-[#5983FC]'
                          : 'bg-[#2A3547] text-[#B8C7E0] cursor-not-allowed'
                      } transition-colors`}
                    >
                      {isLoading ? 'Loading...' : 'Submit'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[#B8C7E0] mb-4">
                    {emotionalChange.isPositive
                      ? `Here are some ideas to help maintain your positive ${dominantEmotion || 'mood'}:`
                      : emotionalChange.isNeutral
                      ? "Based on your input, here are some considerations:"
                      : `Based on your input, here are some suggestions that might help with your ${dominantEmotion || 'feelings'}:`}
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    {recommendations.length > 0 ? (
                      recommendations.map((rec, index) => (
                        <div key={index} className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547]">
                          <div className="flex items-start">
                            <FaLightbulb className="text-yellow-400 mt-1.5 mr-3 flex-shrink-0" />
                            <div>
                              <h4 className="text-white font-medium mb-2">{rec.title}</h4>
                              <p className="text-[#B8C7E0] text-sm">{rec.description}</p>
                              {rec.link && (
                                <button 
                                  onClick={() => handleRecommendationClick(rec)}
                                  className="flex items-center text-[#5983FC] hover:text-[#3E60C1] text-sm mt-2"
                                >
                                  Try this exercise <FaExternalLinkAlt className="ml-1 text-xs" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-[#B8C7E0]">No specific recommendations found. Try a different category.</p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2 rounded-lg bg-[#3E60C1] text-white hover:bg-[#5983FC] transition-colors"
                  >
                    Close
                  </button>
                </>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
      
      {/* Render the ExerciseModal when an exercise is active */}
      {activeExercise && (
        <ExerciseModal 
          exercise={activeExercise} 
          onClose={() => setActiveExercise(null)} 
        />
      )}
    </>
  );
};

export default MoodCausePrompt; 