import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaTimes, FaLightbulb, FaExternalLinkAlt, FaRegSmileBeam, FaRegSadTear, FaRegMeh, FaHeartbeat, FaStar, FaChevronRight, FaChevronLeft, FaClock, FaCheck, FaRegLightbulb } from 'react-icons/fa';
import { FaBriefcase, FaBrain, FaUserFriends, FaRegCompass, FaUserCircle, FaQuestion } from 'react-icons/fa';
import ExerciseModal from './ExerciseModal';

const MoodCausePrompt = ({ notification, onClose }) => {
  const [selectedCause, setSelectedCause] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dominantEmotion, setDominantEmotion] = useState('');
  const [activeExercise, setActiveExercise] = useState(null);
  
  // Add these new states
  const [showIssuePrompt, setShowIssuePrompt] = useState(false);
  const [userIssue, setUserIssue] = useState('');
  const [issueType, setIssueType] = useState('');
  
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
  
  // Replace the exerciseCatalog with this enhanced version
  const exerciseCatalog = {
    'grief': [
      {
        title: "Grief Journaling Exercise",
        description: "Express your feelings about your loss through structured writing.",
        steps: [
          "Find a quiet space free from distractions",
          "Write continuously for 15 minutes about your feelings",
          "Focus on both difficult emotions and positive memories",
          "Conclude by noting one thing you appreciate despite the loss"
        ],
        duration: "15-20 minutes",
        benefits: "Helps process emotions, create meaning, and find closure",
        type: "journaling",
        reflectionPrompts: [
          "What is most difficult for me about this loss?",
          "What do I wish I could say to what I've lost?",
          "What positive memories or aspects can I hold onto?"
        ],
        resources: [
          {
            type: "article",
            title: "The Healing Power of Journaling",
            description: "Harvard Health Publishing",
            url: "https://www.health.harvard.edu/healthbeat/writing-about-emotions-may-ease-stress-and-trauma"
          },
          {
            type: "video",
            title: "How to Journal Through Grief",
            description: "Mayo Clinic",
            url: "https://www.youtube.com/watch?v=FSWKGRYrTO4"
          }
        ]
      },
      {
        title: "Memory Honor Ritual",
        description: "Create a small ritual to honor what you've lost while acknowledging the need to move forward.",
        steps: [
          "Select a meaningful object or photo connected to your loss",
          "Create a dedicated space for reflection",
          "Light a candle and set an intention for your ritual",
          "Speak or write words of acknowledgment and gratitude",
          "Close the ritual with a gesture of moving forward"
        ],
        duration: "10-15 minutes",
        benefits: "Provides closure, honors connections, facilitates transition",
        type: "ritual",
        resources: [
          {
            type: "article",
            title: "Creating Grief Rituals",
            description: "American Counseling Association",
            url: "https://www.counseling.org/docs/default-source/Private/loss-grief-bereavement/grief-rituals.pdf"
          },
          {
            type: "website",
            title: "Rituals for Healing Grief",
            description: "Center for Loss & Life Transition",
            url: "https://www.centerforloss.com/grief/rituals-for-grief/"
          }
        ]
      },
      {
        title: "Letter of Release",
        description: "Write a letter expressing unresolved feelings toward what you've lost.",
        steps: [
          "Begin with 'Dear...' addressing what you've lost",
          "Express everything you wish you could say",
          "Include what you'll miss and what you're grateful for",
          "End with words of farewell and release",
          "Decide whether to keep, bury, or burn the letter as a symbolic act"
        ],
        duration: "20-30 minutes",
        benefits: "Provides emotional release and fosters acceptance"
      }
    ],
    
    'anxiety': [
      {
        title: "5-4-3-2-1 Grounding Exercise",
        description: "Use your senses to anchor yourself in the present moment and reduce anxiety.",
        steps: [
          "Acknowledge 5 things you can SEE around you",
          "Notice 4 things you can TOUCH or FEEL",
          "Listen for 3 things you can HEAR right now",
          "Identify 2 things you can SMELL (or like the smell of)",
          "Note 1 thing you can TASTE (or like the taste of)",
          "Take a deep breath and notice how you feel"
        ],
        duration: "3-5 minutes",
        benefits: "Interrupts anxiety cycle, brings awareness to present moment",
        type: "grounding",
        resources: [
          {
            type: "video",
            title: "5-4-3-2-1 Grounding Technique",
            description: "Guided exercise by a licensed therapist",
            url: "https://www.youtube.com/watch?v=30VMIEmA114"
          },
          {
            type: "article",
            title: "Grounding Techniques for Anxiety",
            description: "Psychology Today",
            url: "https://www.psychologytoday.com/us/blog/mindful-anger/201708/grounding-techniques-managing-intense-emotions"
          }
        ]
      },
      {
        title: "Breathing Exercise for Anxiety",
        description: "Slow, deep breathing to activate your parasympathetic nervous system.",
        steps: [
          "Find a comfortable seated position",
          "Place one hand on your chest and one on your belly",
          "Breathe in slowly through your nose for 4 counts",
          "Hold for 2 counts",
          "Exhale slowly through your mouth for 6 counts",
          "Repeat for 5-10 cycles"
        ],
        duration: "5 minutes",
        benefits: "Reduces physiological symptoms of anxiety, slows heart rate",
        type: "breathing",
        audioUrl: "/exercises/breathing-guide.mp3", // You would need to add these audio files
        resources: [
          {
            type: "video",
            title: "Diaphragmatic Breathing Technique",
            description: "University of Michigan Health",
            url: "https://www.youtube.com/watch?v=8VbOPUWpFZs"
          },
          {
            type: "article",
            title: "Breathing Exercises for Anxiety",
            description: "NHS - Every Mind Matters",
            url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/"
          }
        ]
      },
      {
        title: "Anxious Thought Reframing",
        description: "Challenge and restructure anxious thinking patterns.",
        steps: [
          "Identify a specific anxious thought",
          "Rate your belief in this thought (0-100%)",
          "List evidence that supports and contradicts this thought",
          "Create a more balanced alternative thought",
          "Rate how much you believe the new perspective"
        ],
        duration: "10-15 minutes",
        benefits: "Develops cognitive flexibility and reduces catastrophic thinking"
      }
    ],
    
    'stress': [
            {
              title: "Progressive Muscle Relaxation",
        description: "Systematically tense and release muscle groups to reduce physical tension.",
        steps: [
          "Find a comfortable seated or lying position",
          "Begin with your feet: tense the muscles for 5 seconds",
          "Release and notice the sensation of relaxation for 10 seconds",
          "Move upward through your body (calves, thighs, abdomen, etc.)",
          "Focus on the contrast between tension and relaxation",
          "End with a few deep breaths, enjoying the state of relaxation"
        ],
        duration: "10-15 minutes",
        benefits: "Relieves physical stress, improves body awareness, promotes relaxation"
      },
      {
        title: "3-Minute Breathing Space",
        description: "A micro-meditation to center yourself during stressful moments.",
        steps: [
          "Minute 1: AWARENESS - Notice thoughts, feelings, and sensations",
          "Minute 2: GATHERING - Gently focus attention on your breath",
          "Minute 3: EXPANDING - Broaden awareness to include your whole body",
          "Return to your activities with refreshed awareness"
        ],
        duration: "3 minutes",
        benefits: "Creates mental space, breaks stress cycle, accessible in busy moments"
      },
      {
        title: "Stress Inventory & Action Plan",
        description: "Identify stress sources and develop specific responses.",
        steps: [
          "List all current sources of stress in your life",
          "Categorize each as: Controllable, Partially Controllable, or Uncontrollable",
          "For Controllable stressors: list one action step to reduce each",
          "For Partially Controllable: identify what aspect you can influence",
          "For Uncontrollable: develop a coping strategy to manage your response",
          "Choose one action step to implement today"
        ],
        duration: "15-20 minutes",
        benefits: "Increases sense of control, promotes proactive stress management"
      }
    ],
    
    'anger': [
      {
        title: "STOP Technique for Anger",
        description: "A quick method to interrupt anger before it escalates.",
        steps: [
          "S - STOP what you're doing when you notice anger rising",
          "T - TAKE a step back physically or mentally",
          "O - OBSERVE what's happening in your body and mind",
          "P - PROCEED mindfully, choosing your response",
          "Take 3 deep breaths before responding to the situation"
        ],
        duration: "1-2 minutes",
        benefits: "Creates space between trigger and response, prevents regrettable reactions"
      },
      {
        title: "Anger Letter Exercise",
        description: "Write an uncensored letter expressing your anger (that you won't send).",
        steps: [
          "Write without filtering or censoring your thoughts",
          "Express exactly how you feel and why",
          "Detail the impact of the situation on you",
          "Include what you wish would happen",
          "After writing, destroy or delete the letter as a symbolic release"
        ],
        duration: "15-20 minutes",
        benefits: "Provides emotional catharsis without damaging relationships"
      },
      {
        title: "Root Cause Anger Analysis",
        description: "Identify the deeper needs and values behind your anger.",
        steps: [
          "Describe the situation that triggered your anger",
          "Note your immediate thoughts about the situation",
          "Ask: 'What was threatened or violated?' (values, needs, expectations)",
          "Ask: 'What am I really afraid of in this situation?'",
          "Identify what you truly need in this situation"
        ],
        duration: "10-15 minutes",
        benefits: "Transforms reactive anger into constructive understanding"
      }
    ],
    
    'relationship': [
      {
        title: "Perspective-Taking Practice",
        description: "Strengthen empathy by consciously considering another viewpoint.",
        steps: [
          "Identify a specific relationship challenge",
          "Write down your perspective and feelings about it",
          "Imagine being the other person - their thoughts and feelings",
          "Consider their background, values, and current stressors",
          "Note any new insights or understanding that emerges",
          "Identify one way to incorporate this understanding"
        ],
        duration: "15 minutes",
        benefits: "Builds empathy, reduces judgment, improves communication"
      },
      {
        title: "Values Clarification",
        description: "Identify what matters most to you in relationships to guide your responses.",
        steps: [
          "List 5-7 values important to you in relationships (e.g., honesty, respect)",
          "Rank them in order of importance to you",
          "For each value, note one specific way you can express it",
          "Identify which values might be compromised in current challenges",
          "Create a plan to realign your actions with your top values"
        ],
        duration: "20 minutes",
        benefits: "Clarifies priorities, promotes value-aligned behavior"
      },
      {
        title: "Appreciation Expression",
        description: "Strengthen connection through deliberate appreciation.",
        steps: [
          "Think of someone significant in your life",
          "List 3 specific things you appreciate about them",
          "For each item, note why it matters to you personally",
          "Choose one appreciation to express to them",
          "Practice expressing it clearly and specifically",
          "Share your appreciation verbally or in writing"
        ],
        duration: "10 minutes + expression time",
        benefits: "Cultivates gratitude, strengthens bonds, shifts focus to positives"
      }
    ],
    
    'work': [
      {
        title: "Work Boundaries Exercise",
        description: "Establish healthy boundaries to manage work-related stress.",
        steps: [
          "List your current work hours and when work actually happens",
          "Identify 2-3 specific boundary issues (e.g., after-hours emails)",
          "For each issue, write an ideal boundary statement",
          "Identify potential obstacles to maintaining these boundaries",
          "Create implementation steps for each boundary",
          "Select one boundary to implement this week"
        ],
        duration: "20 minutes",
        benefits: "Reduces burnout, improves work/life balance"
      },
      {
        title: "Task Prioritization Method",
        description: "Organize tasks using the Eisenhower Matrix to reduce overwhelm and increase productivity.",
        steps: [
          "List all current tasks and commitments",
          "Categorize each as: Urgent & Important, Important but Not Urgent, Urgent but Not Important, or Neither",
          "Schedule Important tasks first, then address Urgent items",
          "Identify at least one task that can be delegated or eliminated",
          "Create a focused plan for your top 3 priorities"
        ],
        duration: "15-20 minutes",
        benefits: "Reduces overwhelm, improves focus, aligns efforts with priorities"
      },
      {
        title: "Values Based Work Reflection",
        description: "Reconnect your daily work with deeper meaning and purpose.",
        steps: [
          "List 3-5 core values that matter to you in your work",
          "Rate how well your current role aligns with each value (1-10)",
          "For each value, identify one aspect of your work that honors it",
          "Note one way you could bring more meaning to daily tasks",
          "Create a personal mission statement for your work"
        ],
        duration: "20-30 minutes",
        benefits: "Increases engagement and satisfaction, clarifies purpose"
      }
    ],
    
    'health': [
      {
        title: "Body Appreciation Practice",
        description: "A guided practice to cultivate gratitude for your body's abilities and wisdom.",
        steps: [
          "Find a comfortable position and center yourself",
          "Connect with your breath and body",
          "Explore areas of gratitude",
          "Set intentions for self-care",
          "Complete your reflection"
        ],
        duration: "10-15 minutes",
        benefits: "Builds positive body image, reduces health anxiety, increases self-compassion",
      },
      {
        title: "Health Worry Examination",
        description: "Reduce health anxiety through structured reflection.",
        steps: [
          "Write down your specific health concern in detail",
          "Rate your worry level from 1-10",
          "List evidence supporting this worry",
          "List evidence that contradicts or moderates this worry",
          "Note what percentage of this worry is in your control",
          "Create one reasonable action step for the controllable aspect"
        ],
        duration: "15 minutes",
        benefits: "Reduces catastrophizing, promotes balanced perspective"
      },
      {
        title: "Mindful Body Scan",
        description: "Connect with your body through systematic awareness.",
        steps: [
          "Lie down in a comfortable position",
          "Bring attention to your breath for several cycles",
          "Slowly move your awareness from toes to head",
          "Notice sensations without judgment (tension, relaxation, etc.)",
          "When your mind wanders, gently return focus to your body",
          "Conclude with gratitude for your body's continuous work"
        ],
        duration: "15-20 minutes",
        benefits: "Increases body awareness, reduces physical tension"
      }
    ],
    
    'loss': [
      {
        title: "Loss Processing Exercise",
        description: "Honor what's been lost while finding ways to move forward.",
        steps: [
          "Create a list of what specifically you've lost",
          "Acknowledge both tangible and intangible losses",
          "Write about what you miss most and why",
          "Identify what remains despite this loss",
          "Note any positive aspects that could emerge from this loss",
          "Set one small step toward adaptation"
        ],
        duration: "20 minutes",
        benefits: "Facilitates grief process, supports meaning-making"
      },
      {
        title: "Meaning-Making Practice",
        description: "Find meaning and growth potential in difficult experiences.",
        steps: [
          "Describe how this loss has changed your perspective",
          "Note any values or priorities that have shifted",
          "Identify any new strengths or capabilities you've developed",
          "Consider how this experience connects you to others",
          "Reflect on how this might inform your future choices",
          "Write a brief statement of meaning about this experience"
        ],
        duration: "20-30 minutes",
        benefits: "Supports post-traumatic growth, creates narrative coherence"
      },
      {
        title: "Continuing Bonds Reflection",
        description: "Maintain a healthy connection with what's been lost.",
        steps: [
          "Choose a quiet moment to reflect on your loss",
          "Consider positive qualities or aspects of what's been lost",
          "Identify ways these qualities continue in your life",
          "Create a small ritual to honor this continuing connection",
          "Consider how you might incorporate aspects into your identity",
          "Write a brief message expressing your ongoing relationship"
        ],
        duration: "15-20 minutes",
        benefits: "Provides comfort, maintains connection while allowing adaptation"
      }
    ],
    
    'self-esteem': [
      {
        title: "Self-Compassion Break",
        description: "Respond to self-criticism with kindness and common humanity.",
        steps: [
          "Notice when you're being self-critical or feeling inadequate",
          "Place a hand on your heart or another soothing gesture",
          "Say to yourself: 'This is a moment of suffering'",
          "Say: 'Suffering is part of being human'",
          "Say: 'May I be kind to myself in this moment'",
          "Offer yourself specific words of kindness you need to hear"
        ],
        duration: "3-5 minutes",
        benefits: "Counters harsh self-judgment, provides emotional support"
      },
      {
        title: "Strengths Inventory",
        description: "Reconnect with your authentic strengths and positive qualities.",
        steps: [
          "List at least 7 strengths or positive qualities you possess",
          "For each strength, write a specific example of when you've used it",
          "Note how each strength has helped you or others",
          "Choose 3 key strengths that feel most authentic to you",
          "Plan how to intentionally use one strength tomorrow",
          "Create a 'strengths mantra' to remind yourself of these qualities"
        ],
        duration: "20 minutes",
        benefits: "Builds confidence, counters negative self-perception"
      },
      {
        title: "Inner Critic Dialogue",
        description: "Transform self-criticism into constructive inner dialogue.",
        steps: [
          "Identify a common self-critical thought",
          "Write down exactly what your inner critic says",
          "Note how this criticism affects your feelings and behaviors",
          "Imagine what a compassionate mentor might say instead",
          "Create a balanced response that acknowledges challenges while being supportive",
          "Practice responding to your critic with this new voice"
        ],
        duration: "15-20 minutes",
        benefits: "Improves self-talk, reduces shame, builds resilience"
      }
    ],
    
    'uncertainty': [
      {
        title: "Future Possibilities Visualization",
        description: "Reduce uncertainty anxiety by exploring and visualizing different potential outcomes.",
        steps: [
          "Choose a situation with an uncertain outcome",
          "Visualize three different possible scenarios (positive, neutral, challenging)",
          "For each scenario, imagine how you would cope effectively",
          "Note resources and strengths available to help you navigate each outcome",
          "Recognize your capacity to handle different possibilities",
          "Bring awareness back to the present moment"
        ],
        duration: "15 minutes",
        benefits: "Builds confidence in coping abilities, reduces fear of unknown",
        type: "future-possibilities",
        link: 'future-possibilities'
      },
      {
        title: "Uncertainty Tolerance Practice",
        description: "Build comfort with not knowing through mindful awareness.",
        steps: [
          "Identify a current situation involving uncertainty",
          "Notice physical sensations that arise when thinking about it",
          "Observe your thoughts without judging them as good or bad",
          "Remind yourself: 'Uncertainty is a natural part of life'",
          "Consider: 'What is still within my control right now?'",
          "Set one small action step within your control"
        ],
        duration: "10 minutes",
        benefits: "Reduces anxiety about unknowns, builds tolerance for ambiguity"
      },
      {
        title: "Anchoring in the Present",
        description: "Ground yourself in the present when uncertain futures create anxiety.",
        steps: [
          "Notice when worry about uncertainties arises",
          "Take three slow, deep breaths",
          "Name 5 things you know to be true right now",
          "Identify what you can do today that matters",
          "Choose one small meaningful action to take now",
          "Remind yourself: 'I can only live in this moment'"
        ],
        duration: "5-10 minutes",
        benefits: "Shifts focus from future worries to present agency"
      }
    ],
    
    'financial': [
      {
        title: "Financial Worry Containment",
        description: "Manage financial anxiety through structured reflection.",
        steps: [
          "List specific financial concerns currently on your mind",
          "Categorize each as: Immediate Action Needed, Future Planning, or Outside Your Control",
          "For Immediate concerns: note one specific action step",
          "For Future concerns: schedule a specific time to address planning",
          "For Outside Control: practice acceptance and focus elsewhere",
          "Commit to one action step today"
        ],
        duration: "15 minutes",
        benefits: "Reduces overwhelm, promotes practical problem-solving"
      },
      {
        title: "Values-Based Resource Reflection",
        description: "Reconnect with non-financial resources and values.",
        steps: [
          "List 5-7 non-financial resources you possess (skills, relationships, etc.)",
          "Identify ways these resources support your wellbeing",
          "Reflect on times these resources helped you through challenges",
          "Consider how these resources align with your core values",
          "Note one way to leverage these resources in current circumstances"
        ],
        duration: "10-15 minutes",
        benefits: "Expands sense of security beyond financial measures"
      },
      {
        title: "Financial Mindfulness Practice",
        description: "Bring awareness to money relationships and patterns.",
        steps: [
          "Reflect on messages about money from your childhood",
          "Note how these messages influence your current relationship with money",
          "Consider your authentic values around material resources",
          "Identify one pattern that doesn't serve your wellbeing",
          "Create a new intention aligned with your values",
          "Practice mindful awareness during one financial transaction today"
        ],
        duration: "20 minutes",
        benefits: "Transforms unconscious patterns, reduces emotional reactivity"
      }
    ],
    
    'disappointment': [
      {
        title: "Expectation Examination",
        description: "Explore the gap between expectations and reality to process disappointment.",
        steps: [
          "Clearly describe what you expected to happen",
          "Describe what actually happened",
          "Reflect on where your expectations originated",
          "Consider if these expectations were realistic",
          "Identify any lessons from this experience",
          "Formulate more flexible expectations going forward"
        ],
        duration: "15 minutes",
        benefits: "Promotes realistic thinking, facilitates learning from setbacks"
      },
      {
        title: "Growth Perspective Exercise",
        description: "Reframe disappointment as an opportunity for growth and learning.",
        steps: [
          "Acknowledge the disappointment fully without minimizing it",
          "List three things this experience can teach you",
          "Identify one strength or quality revealed by this challenge",
          "Consider how this experience might benefit you in the future",
          "Write a brief statement reframing this experience as part of your journey"
        ],
        duration: "15-20 minutes",
        benefits: "Transforms setbacks into growth opportunities, builds resilience"
      },
      {
        title: "Compassionate Disappointment Letter",
        description: "Process disappointment through self-compassionate writing.",
        steps: [
          "Write a letter to yourself from the perspective of a compassionate friend",
          "Acknowledge the pain of the disappointment",
          "Offer understanding and validation for your feelings",
          "Gently suggest a broader perspective on the situation",
          "Include encouraging words about moving forward",
          "Read the letter to yourself whenever disappointment resurfaces"
        ],
        duration: "20 minutes",
        benefits: "Provides emotional support, facilitates self-compassion"
      }
    ],
    
    'mindfulness': [
      {
        title: "Mindful Observation Practice",
        description: "Calm your mind by fully observing an object for 5 minutes.",
        steps: [
          "Choose any natural object and place it in front of you",
          "Focus all your attention on this object",
          "Observe its color, texture, shape, and any unique features",
          "When your mind wanders, gently return focus to the object",
          "Notice details you didn't see at first",
          "Conclude by noting how your attention feels now"
        ],
        duration: "5 minutes",
        benefits: "Trains attention, cultivates present-moment awareness"
      },
      {
        title: "Body Scan Meditation",
        description: "Systematically bring awareness to each part of your body.",
        steps: [
          "Lie down in a comfortable position",
          "Starting at your toes, bring awareness to each body part",
          "Notice sensations without judgment (heaviness, tingling, etc.)",
          "If you notice tension, breathe into that area and imagine it softening",
          "Continue gradually moving upward through your entire body",
          "End with awareness of your body as a whole"
        ],
        duration: "15-20 minutes",
        benefits: "Reduces physical tension, improves body awareness"
      },
      {
        title: "Five-Breath Awareness Practice",
        description: "A quick mindfulness technique for busy moments.",
        steps: [
          "Pause whatever you're doing",
          "Sit or stand with an upright, dignified posture",
          "Take five slow, conscious breaths",
          "Feel the sensation of the breath entering and leaving your body",
          "Notice how your mind and body feel after these breaths",
          "Continue your activities with refreshed awareness"
        ],
        duration: "1-2 minutes",
        benefits: "Creates mental space, accessible even in busy moments"
      }
    ],
    
    'loneliness': [
      {
        title: "Connection Inventory",
        description: "Recognize and strengthen your existing social connections.",
        steps: [
          "List all your current social connections (friends, family, acquaintances)",
          "Note the quality and frequency of each connection",
          "Identify which connections feel most nourishing",
          "Choose one connection you'd like to strengthen",
          "Plan a specific action to nurture this relationship",
          "Schedule this connection activity in your calendar"
        ],
        duration: "15-20 minutes",
        benefits: "Counters isolation perception, promotes social activation"
      },
      {
        title: "Self-Connection Practice",
        description: "Develop a stronger sense of connection with yourself.",
        steps: [
          "Create a comfortable, quiet space for self-reflection",
          "Ask yourself: 'What do I need right now?'",
          "Write down whatever arises without judgment",
          "Consider how you might meet one of these needs",
          "Express appreciation to yourself for this time together",
          "Schedule regular check-ins with yourself"
        ],
        duration: "10-15 minutes",
        benefits: "Strengthens internal resources, reduces dependence on external validation"
      },
      {
        title: "Belonging Expansion",
        description: "Cultivate a broader sense of human connection and belonging.",
        steps: [
          "Sit comfortably and bring awareness to your breath",
          "Visualize yourself as part of ever-widening circles of connection",
          "Start with close relationships, then community, then humanity",
          "Reflect on your shared humanity with others around you",
          "Consider: 'What values or experiences do I share with others?'",
          "Notice how this perspective affects your sense of isolation"
        ],
        duration: "10 minutes",
        benefits: "Expands sense of belonging, reduces perceived isolation"
      }
    ]
  };
  
  // Replace the getRecommendations function with this improved version
  const getRecommendations = (emotion, cause, issueType, userIssue) => {
    // First prioritize the user's selected issue type
    let recommendedExercises = [];
    
    // If user has selected a specific issue type, prioritize that above all
    const normalizedIssueType = issueType ? issueType.toLowerCase() : '';
    if (normalizedIssueType && exerciseCatalog[normalizedIssueType]) {
      recommendedExercises = [...exerciseCatalog[normalizedIssueType]];
    }
    
    // Only look at emotion/cause categories if we need more recommendations
    if (recommendedExercises.length < 2) {
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
        // Negative causes
        'loss': 'grief',
        'stress': 'stress',
        'relationship': 'relationship',
        'work': 'work',
        'health': 'health',
        'loneliness': 'loneliness',
        'financial': 'financial',
        'disappointment': 'disappointment',
        'other_negative': 'stress',
      };
      
      // Determine recommended categories
      const recommendedCategories = [];
      
      // Add emotion-based categories
      if (emotion && emotionToCategoryMap[emotion]) {
        recommendedCategories.push(...emotionToCategoryMap[emotion]);
      }
      
      // Add cause-based category
      if (cause && causeToCategoryMap[cause]) {
        recommendedCategories.push(causeToCategoryMap[cause]);
      }
      
      // Default categories if nothing specific found
      if (recommendedCategories.length === 0) {
        recommendedCategories.push('stress', 'mindfulness');
      }
      
      // Ensure unique categories
      const uniqueCategories = [...new Set(recommendedCategories)];
      
      // Collect exercises from relevant categories
      uniqueCategories.forEach(category => {
        // Skip categories that are too different from the user's selected issue
        if (normalizedIssueType && 
            !areRelatedCategories(normalizedIssueType, category)) {
          return;
        }
        
        if (exerciseCatalog[category]) {
          recommendedExercises = [...recommendedExercises, ...exerciseCatalog[category]];
        }
      });
    }
    
    // If we have a custom user issue, craft a personalized exercise
    if (userIssue && userIssue.trim().length > 0) {
      const personalizedExercise = createPersonalizedExercise(
        userIssue, 
        normalizedIssueType || 'default'
      );
      recommendedExercises = [personalizedExercise, ...recommendedExercises];
    }
    
    // Ensure uniqueness
    const uniqueExercises = [];
    recommendedExercises.forEach(exercise => {
      if (!uniqueExercises.some(ex => ex.title === exercise.title)) {
        uniqueExercises.push(exercise);
      }
    });
    
    // If we still don't have enough, add default mindfulness exercises
    if (uniqueExercises.length < 2 && exerciseCatalog['mindfulness']) {
      uniqueExercises.push(...exerciseCatalog['mindfulness']);
    }
    
    return uniqueExercises.slice(0, 4);
  };
  
  // Add this helper function to check if categories are related
  const areRelatedCategories = (category1, category2) => {
    // Define groups of related categories
    const relatedGroups = [
      ['work', 'stress', 'anxiety'], // Work-related
      ['relationship', 'loneliness'], // Relationship-related
      ['grief', 'loss'], // Loss-related
      ['health', 'stress'], // Health-related
      ['anxiety', 'stress', 'uncertainty'], // Anxiety-related
      ['anger', 'stress'], // Anger-related
      ['self-esteem', 'disappointment'] // Self-related
    ];
    
    // Check if both categories are in the same group
    return relatedGroups.some(group => 
      group.includes(category1) && group.includes(category2)
    ) || category2 === 'mindfulness'; // Mindfulness is always relevant
  };
  
  // Add a function to create a personalized exercise based on user's issue
  const createPersonalizedExercise = (issue, category) => {
    // Base templates for different categories
    const templates = {
      'relationship': {
        title: "Personalized Relationship Reflection",
        description: `Reflect on your specific situation: "${issue.substring(0, 50)}${issue.length > 50 ? '...' : ''}"`,
        steps: [
          "Write down exactly what's bothering you about this relationship",
          "Identify your needs that aren't being met",
          "Consider what might be happening from the other person's perspective",
          "Brainstorm one small step toward improvement"
        ]
      },
      'work': {
        title: "Work Stress Management",
        description: `Address your work challenge: "${issue.substring(0, 50)}${issue.length > 50 ? '...' : ''}"`,
        steps: [
          "Define the specific aspect that's most stressful",
          "Rate the importance of this issue on a scale of 1-10",
          "Identify one aspect you can control",
          "Create a boundary or solution for that aspect"
        ]
      },
      'anxiety': {
        title: "Targeted Anxiety Relief",
        description: `Focus on your specific worry: "${issue.substring(0, 50)}${issue.length > 50 ? '...' : ''}"`,
        steps: [
          "Notice where you feel this anxiety in your body",
          "Take 5 deep breaths focusing on that area",
          "Ask yourself what's the worst that could happen, and how you'd cope",
          "Identify one small action to take despite the anxiety"
        ]
      },
      'default': {
        title: "Personal Reflection Exercise",
        description: `Explore your situation: "${issue.substring(0, 50)}${issue.length > 50 ? '...' : ''}"`,
        steps: [
          "Write exactly what you're experiencing",
          "Note how this situation affects your emotions and body",
          "Consider what this experience might be teaching you",
          "Identify one small step toward self-care"
        ]
      }
    };
    
    return templates[category] || templates.default;
  };
  
  // Update the handleSubmit function
  const handleSubmit = () => {
    if (!selectedCause) return;
    
    // Instead of immediately showing recommendations, show the issue prompt
    setShowIssuePrompt(true);
  };
  
  // Update handleIssueSubmit function
  const handleIssueSubmit = () => {
    if (!issueType) return;
    
    setIsLoading(true);
    
    // Use setTimeout to simulate API call but ensure it always completes
    setTimeout(() => {
      try {
        // Use dominant emotion or notification mood
        const currentEmotion = dominantEmotion || notification?.currentMood;
        console.log("Getting recommendations for:", currentEmotion, selectedCause, issueType, userIssue);
        
        // Get personalized recommendations
        const exerciseOptions = getRecommendations(currentEmotion, selectedCause, issueType, userIssue);
        
        // If we didn't get any recommendations, add a fallback
        if (!exerciseOptions || exerciseOptions.length === 0) {
          console.log("No recommendations found, using fallback");
          setRecommendations([{
            title: "Mindful Breathing Exercise",
            description: "A simple practice to center yourself when feeling overwhelmed.",
            steps: [
              "Find a comfortable seated position",
              "Close your eyes or soften your gaze",
              "Breathe deeply for 10 breaths, focusing solely on the sensation",
              "Notice how you feel afterward"
            ]
          }]);
        } else {
          setRecommendations(exerciseOptions);
        }
        
        // Always move to recommendations screen
        setShowIssuePrompt(false);
        setShowRecommendations(true);
      } catch (error) {
        console.error("Error generating recommendations:", error);
        // Show simple fallback recommendation
        setRecommendations([{
          title: "Simple Breathing Exercise",
          description: "Take a moment to breathe and center yourself.",
          steps: [
            "Breathe in for 4 counts",
            "Hold for 2 counts",
            "Exhale for 6 counts",
            "Repeat 5 times"
          ]
        }]);
        setShowIssuePrompt(false);
    setShowRecommendations(true);
    } finally {
      setIsLoading(false);
    }
    }, 600); // Reduced from 800ms for better UX
  };
  
  // Handle recommendation click
  const handleRecommendationClick = (recommendation) => {
    // Add any specific properties needed for the interactive experience
    let enhancedExercise = { ...recommendation };
    
    // Add specific enhancements based on exercise type or title
    if (recommendation.title.toLowerCase().includes('journal') || 
        recommendation.description.toLowerCase().includes('writ')) {
      enhancedExercise.type = enhancedExercise.type || 'journaling';
    } 
    else if (recommendation.title.toLowerCase().includes('breath') || 
             recommendation.description.toLowerCase().includes('breath')) {
      enhancedExercise.type = enhancedExercise.type || 'breathing';
    }
    else if (recommendation.title.toLowerCase().includes('meditat') || 
             recommendation.description.toLowerCase().includes('meditat')) {
      enhancedExercise.type = enhancedExercise.type || 'meditation';
    }
    // Add specific links for our implemented exercises
    else if (recommendation.title === "Values Clarification") {
      enhancedExercise.link = 'values-clarification';
      enhancedExercise.type = 'reflection';
    }
    else if (recommendation.title === "Appreciation Expression") {
      enhancedExercise.link = 'appreciation-expression';
      enhancedExercise.type = 'appreciation';
    }
    // Add this specific case for Body Appreciation Practice
    else if (recommendation.title === "Body Appreciation Practice") {
      enhancedExercise.link = 'body-appreciation-link';
      enhancedExercise.type = 'body-appreciation';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "The Power of Body Gratitude",
          description: "Research on body appreciation and well-being",
          url: "https://www.psychologytoday.com/us/blog/beauty-sick/201904/what-is-body-appreciation"
        },
        {
          type: "video",
          title: "Guided Body Appreciation Practice",
          description: "Expert-led body gratitude meditation",
          url: "https://www.youtube.com/watch?v=example"
        }
      ];
    }
    else if (recommendation.title === "Perspective-Taking Practice") {
      enhancedExercise.link = 'perspective-taking';
      enhancedExercise.type = 'reflection';
    }
    else if (recommendation.title === "Work Boundaries Exercise") {
      enhancedExercise.link = 'work-boundaries';
      enhancedExercise.type = 'work';
    }
    else if (recommendation.title === "Task Prioritization Method") {
      enhancedExercise.link = 'task-prioritization';
      enhancedExercise.type = 'task';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "The Eisenhower Matrix: Time and Task Management",
          description: "Learn how to prioritize tasks effectively using the proven Eisenhower Matrix method",
          url: "https://www.indeed.com/career-advice/career-development/eisenhower-matrix"
        },
        {
          type: "article",
          title: "Time Management and Task Prioritization",
          description: "Professional guide to managing tasks and time effectively",
          url: "https://www.coursera.org/learn/work-smarter-not-harder"
        }
      ];
    }
    else if (recommendation.title === "Values Based Work Reflection") {
      enhancedExercise.link = 'work-values-reflection';
      enhancedExercise.type = 'work-values';
      enhancedExercise.resources = [
        {
          type: "video",
          title: "How to Find Work You Love",
          description: "Scott Dinsmore's popular TEDx talk about aligning work with personal values",
          url: "https://www.ted.com/talks/scott_dinsmore_how_to_find_work_you_love"
        },
        {
          type: "article",
          title: "Creating a Personal Mission Statement for Work",
          description: "Step-by-step guide to developing a meaningful work mission statement",
          url: "https://www.mindtools.com/pages/article/newHTE_93.htm"
        }
      ];
    }
    else if (recommendation.title === "Health Worry Examination") {
      enhancedExercise.link = 'health-worry-link';
      enhancedExercise.type = 'health-worry';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "Understanding Health Anxiety",
          description: "Expert insights on managing health-related worries",
          url: "https://www.health.harvard.edu/staying-healthy/always-worried-about-your-health-you-may-be-dealing-with-health-anxiety-disorder"
        },
        {
          type: "video",
          title: "Managing Health Anxiety",
          description: "Professional guidance on coping with health concerns",
          url: "https://www.youtube.com/watch?v=example"
        }
      ];
    }
    else if (recommendation.title === "Anxious Thought Reframing") {
      enhancedExercise.link = 'anxious-thought';
      enhancedExercise.type = 'anxious-thought';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "Cognitive Restructuring Techniques",
          description: "Evidence-based approaches to challenging anxious thoughts",
          url: "https://www.psychologytoday.com/us/blog/anxiety-files/201801/cognitive-restructuring-techniques"
        },
        {
          type: "video",
          title: "How to Challenge Anxious Thoughts",
          description: "Step-by-step guide to thought reframing",
          url: "https://www.youtube.com/watch?v=example"
        }
      ];
    }
    else if (recommendation.title === "Loss Processing Exercise") {
      enhancedExercise.link = 'loss-processing';
      enhancedExercise.type = 'loss-processing';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "Understanding Grief and Loss",
          description: "Expert insights on processing different types of loss",
          url: "https://www.psychologytoday.com/us/basics/grief"
        },
        {
          type: "video",
          title: "Coping with Loss",
          description: "Professional guidance on navigating the journey of loss",
          url: "https://www.youtube.com/watch?v=example"
        }
      ];
    }
    else if (recommendation.title === "Meaning-Making Practice") {
      enhancedExercise.link = 'meaning-making';
      enhancedExercise.type = 'meaning-making';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "Finding Meaning in Difficult Experiences",
          description: "Research on post-traumatic growth and meaning-making",
          url: "https://www.psychologytoday.com/us/blog/what-doesnt-kill-us/201901/finding-meaning-in-adversity"
        },
        {
          type: "video",
          title: "The Power of Meaning",
          description: "Expert insights on meaning-making and resilience",
          url: "https://www.youtube.com/watch?v=example"
        }
      ];
    }
    else if (recommendation.title === "Continuing Bonds Reflection") {
      enhancedExercise.link = 'continuing-bonds';
      enhancedExercise.type = 'continuing-bonds';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "Understanding Continuing Bonds",
          description: "Research on maintaining healthy connections after loss",
          url: "https://www.psychologytoday.com/us/blog/understanding-grief/201901/continuing-bonds-after-loss"
        },
        {
          type: "video",
          title: "Maintaining Connection After Loss",
          description: "Expert guidance on healthy continuing bonds",
          url: "https://www.youtube.com/watch?v=example"
        }
      ];
    }
    else if (recommendation.title === "Inner Critic Dialogue") {
      enhancedExercise.link = 'inner-critic';
      enhancedExercise.type = 'inner-critic';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "Understanding and Transforming Self-Criticism",
          description: "Research on self-compassion and inner critic work",
          url: "https://www.psychologytoday.com/us/blog/click-here-happiness/202101/how-transform-your-inner-critic"
        },
        {
          type: "video",
          title: "Working with Your Inner Critic",
          description: "Expert guidance on developing self-compassion",
          url: "https://www.youtube.com/watch?v=example"
        }
      ];
    }
    else if (recommendation.title === "Uncertainty Tolerance Practice") {
      enhancedExercise.link = 'uncertainty-tolerance';
      enhancedExercise.type = 'uncertainty-tolerance';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "Building Tolerance for Uncertainty",
          description: "Research on managing uncertainty and anxiety",
          url: "https://www.psychologytoday.com/us/blog/anxiety-files/201801/how-build-tolerance-uncertainty"
        },
        {
          type: "video",
          title: "Managing Uncertainty in Life",
          description: "Expert guidance on developing uncertainty tolerance",
          url: "https://www.youtube.com/watch?v=example"
        }
      ];
    }
    
    // Ensure resources are available
    if (!enhancedExercise.resources || enhancedExercise.resources.length === 0) {
      if (recommendation.title === "Values Clarification") {
        enhancedExercise.resources = [
          {
            type: "video",
            title: "How to Find Work That Matters",
            description: "Inspiring talk about aligning work with personal values and meaning",
            url: "https://www.youtube.com/watch?v=jpe-LKn-4gM"
          },
        ];
      }
      else if (recommendation.title === "Appreciation Expression") {
        enhancedExercise.resources = [
          {
            type: "article",
            title: "The Science of Gratitude in Relationships",
            description: "Research from Greater Good Science Center",
            url: "https://greatergood.berkeley.edu/article/item/how_gratitude_strengthens_relationships"
          }
        ];
      }
      else if (recommendation.title === "Perspective-Taking Practice") {
        enhancedExercise.resources = [
          {
            type: "article",
            title: "The Science of Empathy",
            description: "Research on perspective-taking from Greater Good Science Center",
            url: "https://greatergood.berkeley.edu/topic/empathy/definition"
          }
        ];
      }
      // Also add resources in the resources section
      else if (recommendation.title === "Work Boundaries Exercise") {
        enhancedExercise.resources = [
          {
            type: "article",
            title: "Setting Boundaries at Work",
            description: "Practical guide from Mayo Clinic on establishing professional boundaries",
            url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/work-life-balance/art-20048134"
          },
          {
            type: "video",
            title: "How to Set Boundaries at Work",
            description: "TEDx talk on establishing and maintaining professional boundaries",
            url: "https://www.youtube.com/watch?v=rtsHUeKnkC8"
          }
        ];
      }
    }
    
    else if (recommendation.title === "Future Possibilities Visualization") {
      enhancedExercise.link = 'future-possibilities';
      enhancedExercise.type = 'future-possibilities';
      enhancedExercise.resources = [
        {
          type: "article",
          title: "Managing Uncertainty Through Visualization",
          description: "Research on visualization techniques for anxiety management",
          url: "https://www.psychologytoday.com/us/blog/anxiety-files/202101/managing-uncertainty"
        },
        {
          type: "video",
          title: "Guided Future Visualization Practice",
          description: "Expert-led visualization for uncertainty",
          url: "https://www.youtube.com/watch?v=example"
        }
      ];
    }
    
    setActiveExercise(enhancedExercise);
  };
  
  // Get an appropriate mood icon based on the dominant emotion
  const getMoodIcon = () => {
    if (!dominantEmotion) return <FaHeartbeat className="text-[#5983FC]" />;
    
    const positiveEmotions = [
      'happy', 'excited', 'loving', 'optimistic', 'proud', 
      'grateful', 'relieved', 'amused', 'calm', 'caring'
    ];
    
    const neutralEmotions = [
      'neutral', 'surprised', 'curious'
    ];
    
    if (positiveEmotions.includes(dominantEmotion)) {
      return <FaRegSmileBeam className="text-emerald-400" />;
    } else if (neutralEmotions.includes(dominantEmotion)) {
      return <FaRegMeh className="text-[#5983FC]" />;
    } else {
      return <FaRegSadTear className="text-amber-400" />;
    }
  };
  
  // Get color theme based on emotional state for UI elements
  const getEmotionTheme = () => {
    if (notification.isNegativeShift) {
      return {
        primary: 'bg-[#3E60C1]',
        secondary: 'bg-[#3E60C1]/20',
        border: 'border-[#3E60C1]/30',
        text: 'text-[#5983FC]',
        hover: 'hover:bg-[#5983FC]',
        selected: 'bg-[#3E60C1]/20 border-[#5983FC]'
      };
    } else {
      return {
        primary: 'bg-amber-500',
        secondary: 'bg-amber-400/20',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        hover: 'hover:bg-amber-500/90',
        selected: 'bg-amber-500/20 border-amber-500/50'
      };
    }
  };
  
  const theme = getEmotionTheme();
  
  // Get an appropriate greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get positive reinforcement header based on dominant emotion
  const getPositiveHeader = () => {
    const headers = {
      'happy': "Happiness Noticed!",
      'excited': "Excitement Detected!",
      'loving': "Feeling the Love!",
      'optimistic': "Optimism Flowing!",
      'proud': "Pride Recognized!",
      'grateful': "Gratitude Observed!",
      'calm': "Peaceful Moments!",
      'default': "Positive Vibes!"
    };
    
    return headers[dominantEmotion] || headers.default;
  };

  // Add this new function to determine shift type
  const getShiftType = (currentMood, previousMood) => {
    const positiveMoods = ['happy', 'excited', 'optimistic'];
    const neutralMoods = ['neutral', 'calm'];
    
    if (positiveMoods.includes(previousMood) && !positiveMoods.includes(currentMood)) {
      return 'positive_to_negative';
    }
    if (neutralMoods.includes(previousMood) && !neutralMoods.includes(currentMood)) {
      return 'neutral_to_negative';
    }
    return 'general_negative';
  };

  const shiftType = getShiftType(notification.currentMood, notification.previousMood);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Add this new function to determine notification type and message
  const getNotificationType = () => {
    if (!notification) return 'mood_shift';
    return notification.type;
  };

  // Add this new function to get appropriate header message
  const getHeaderMessage = () => {
    if (showRecommendations) return 'Personalized Insights';
    
    const notificationType = getNotificationType();
    if (notificationType === 'emotional_support') {
      return `I notice you're feeling ${notification.currentMood}`;
    }
    
    if (notification.isNegativeShift) {
      return 'Mood Change Detected';
    }
    
    return 'Emotional Support';
  };

  // Add this new function to get appropriate subheader message
  const getSubheaderMessage = () => {
    const notificationType = getNotificationType();
    
    if (notificationType === 'emotional_support') {
      return "Would you like to explore what might be contributing to these feelings and find some supportive exercises?";
    }
    
    if (notification.isNegativeShift) {
      return "Understanding these emotional shifts can provide valuable insights for your well-being journey.";
    }
    
    return "Let's explore what might be contributing to your current emotional state and find some supportive exercises.";
  };

  // Add this new function before the renderIssuePrompt function
  const getCategoryIcon = (type) => {
    const icons = {
      'Relationship': <FaUserFriends className="w-5 h-5" />,
      'Work': <FaBriefcase className="w-5 h-5" />,
      'Health': <FaHeartbeat className="w-5 h-5" />,
      'Anxiety': <FaBrain className="w-5 h-5" />,
      'Loss': <FaRegSadTear className="w-5 h-5" />,
      'Self-esteem': <FaUserCircle className="w-5 h-5" />,
      'Uncertainty': <FaRegCompass className="w-5 h-5" />,
      'Other': <FaQuestion className="w-5 h-5" />
    };
    return icons[type] || <FaQuestion className="w-5 h-5" />;
  };

  // Replace the existing renderIssuePrompt function
  const renderIssuePrompt = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="text-white font-medium mb-3">What specifically are you dealing with?</h4>
        <p className="text-[#B8C7E0] mb-6 text-sm">
          Sharing more details will help us provide targeted exercises that better match your needs.
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            {['Relationship', 'Work', 'Health', 'Anxiety', 'Loss', 'Self-esteem', 'Uncertainty', 'Other'].map((type) => (
              <motion.div
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIssueType(type)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  issueType === type
                    ? `${theme.selected} border-[#5983FC] shadow-lg shadow-[#3E60C1]/10`
                    : 'bg-[#0F172A]/70 border-[#2A3547] hover:border-[#3E60C1]/50 hover:bg-[#1A2335]'
                }`}
              >
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className={`p-2 rounded-lg ${
                    issueType === type 
                      ? 'bg-[#5983FC]/20 text-[#5983FC]' 
                      : 'bg-[#1E293B] text-[#B8C7E0]'
                  } transition-colors`}>
                    {getCategoryIcon(type)}
                  </div>
                  <span className={`text-sm font-medium ${
                    issueType === type 
                      ? 'text-white' 
                      : 'text-[#B8C7E0]'
                  }`}>
                    {type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <textarea
              value={userIssue}
              onChange={(e) => setUserIssue(e.target.value)}
              placeholder="Would you like to share more about what you're experiencing? (optional)"
              className="w-full bg-[#0F172A] border border-[#2A3547] rounded-xl p-4 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] focus:ring-1 focus:ring-[#5983FC]/20 min-h-[120px] placeholder-[#4B5563] text-sm transition-all"
            ></textarea>
            <div className="absolute bottom-3 right-3 text-xs text-[#4B5563]">
              Optional
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setShowIssuePrompt(false);
              const exerciseOptions = getRecommendations(notification.currentMood, selectedCause);
              setRecommendations(exerciseOptions);
              setShowRecommendations(true);
            }}
            className="px-4 py-2 rounded-lg text-[#B8C7E0] hover:text-white transition-colors flex items-center hover:bg-[#1E293B]"
          >
            Skip
          </button>
          <button
            onClick={handleIssueSubmit}
            disabled={!issueType || isLoading}
            className={`px-6 py-2 rounded-lg flex items-center shadow-md ${
              issueType && !isLoading
                ? `${theme.primary} text-white ${theme.hover} transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`
                : 'bg-[#2A3547] text-[#4B5563] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </>
            ) : (
              <>
                Get Recommendations <FaChevronRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-b from-[#1A2335] to-[#1A2335]/95 border border-[#3E60C1]/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto mx-4 shadow-xl"
        >
          {/* Header section with dynamic icon and message */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.secondary} mr-3`}>
                {getMoodIcon()}
              </div>
              <h3 className="text-xl font-bold text-white">
                {getHeaderMessage()}
              </h3>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#B8C7E0] hover:bg-[#2A3547] transition-colors"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>

          {!showIssuePrompt && !showRecommendations ? (
            // Mood change cause selection UI
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-6">
                <p className={`text-[#B8C7E0] ${dominantEmotion ? 'mb-2' : 'mb-5'}`}>
                  {getSubheaderMessage()}
                </p>
                
                {dominantEmotion && (
                  <div className={`inline-block px-3 py-1 rounded-full ${theme.secondary} ${theme.text} text-sm font-medium mb-5`}>
                    Feeling: {dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}
                  </div>
                )}
                
                {/* Cause options with enhanced styling */}
                <div className="mb-5">
                  <h4 className="text-white font-medium mb-3">
                    {getNotificationType() === 'emotional_support' 
                      ? "What might be contributing to these feelings?"
                      : "What might be contributing to this?"}
                  </h4>
                  <div className="space-y-2">
                    {getCauseOptions().map(option => (
                      <motion.div 
                        key={option.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedCause(option.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedCause === option.id
                            ? `${theme.selected} text-white`
                            : 'bg-[#0F172A]/70 border-[#2A3547] text-[#B8C7E0] hover:border-[#3E60C1]'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3 border-2 flex items-center justify-center ${
                            selectedCause === option.id 
                              ? `border-${theme.text.split('-')[1]} bg-${theme.text.split('-')[1]}/10` 
                              : 'border-[#3E60C1]'
                          }`}>
                            {selectedCause === option.id && (
                              <div className={`w-2 h-2 rounded-full ${theme.text}`}></div>
                            )}
                          </div>
                          {option.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-[#B8C7E0] hover:text-white transition-colors flex items-center"
                >
                  <FaTimes className="mr-1" /> Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedCause || isLoading}
                  className={`px-6 py-2 rounded-lg flex items-center shadow-md ${
                    selectedCause && !isLoading
                      ? `${theme.primary} text-white ${theme.hover}`
                      : 'bg-[#2A3547] text-[#B8C7E0] cursor-not-allowed'
                  } transition-colors`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </>
                  ) : (
                    <>
                      Get Recommendations <FaChevronRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : showIssuePrompt ? (
            // New issue prompt UI
            renderIssuePrompt()
          ) : (
            // Recommendations UI 
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-[#B8C7E0] mb-6">
                {emotionalChange.isNeutral
                  ? "Based on your input, here are some considerations that might be helpful:"
                  : `Based on what you shared, here are some suggestions that might help with your ${dominantEmotion || 'feelings'}:`}
              </p>
              
              <div className="space-y-4 mb-6">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547] hover:border-[#3E60C1]/50 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className={`${theme.secondary} p-3 rounded-lg mr-4 flex-shrink-0`}>
                          <FaLightbulb className={theme.text} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-2">{rec.title}</h4>
                          <p className="text-[#B8C7E0] text-sm mb-3">{rec.description}</p>
                          
                          {/* Simplified display - just duration and benefits */}
                          <div className="flex items-center justify-between mb-2">
                            {rec.duration && (
                              <div className="flex items-center text-[#B8C7E0] text-xs">
                                <FaClock className="text-[#5983FC] mr-1" /> 
                                <span>{rec.duration}</span>
                              </div>
                            )}
                            {rec.type && (
                              <div className="bg-[#0F172A] px-2 py-0.5 rounded-full text-[#B8C7E0] text-xs">
                                {rec.type}
                              </div>
                            )}
                          </div>
                          
                          {/* Benefits summary */}
                          {rec.benefits && (
                            <div className="text-xs text-[#B8C7E0] mb-3">
                              <span className="text-emerald-400 font-medium">Benefits:</span> 
                              <span className="ml-1">{rec.benefits}</span>
                            </div>
                          )}
                          
                            <button 
                              onClick={() => handleRecommendationClick(rec)}
                            className={`flex items-center ${theme.text} hover:underline text-sm mt-2 group`}
                            >
                              Try this exercise <FaExternalLinkAlt className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-[#0F172A]/70 rounded-xl border border-[#2A3547]">
                    <p className="text-[#B8C7E0]">No specific recommendations found. Try selecting a different cause.</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className={`w-full py-3 rounded-lg ${theme.primary} text-white font-medium ${theme.hover} transition-colors shadow-md flex items-center justify-center`}
              >
                Close <FaTimes className="ml-2" />
              </button>
            </motion.div>
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
    </AnimatePresence>
  );
};

export default MoodCausePrompt; 