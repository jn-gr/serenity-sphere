import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaSave, FaRegLightbulb, FaCheck, FaArrowRight, FaArrowLeft, FaPlay, FaPause, FaExternalLinkAlt } from 'react-icons/fa';

const ExerciseModal = ({ exercise, onClose }) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(1);
  const [exerciseContent, setExerciseContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [checklist, setChecklist] = useState({});

  useEffect(() => {
    // Timer for breathing exercises
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!timerActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, seconds]);
  
  useEffect(() => {
    // Load exercise content based on the link path
    const fetchExerciseContent = async () => {
      setLoading(true);
      try {
        // Extract the exercise type from the link
        const exercisePath = exercise.link.split('/').pop();
        
        // Define content for different exercise types
        const exerciseContents = {
          // GRIEF EXERCISES
          'grief-journal': {
            title: "Grief Journaling Exercise",
            description: "Writing about your grief can help process emotions and honor your memories.",
            steps: [
              {
                title: "Prepare",
                content: "Find a quiet space where you won't be interrupted. Take a few deep breaths to center yourself."
              },
              {
                title: "Remember",
                content: "Think of a memory with your loved one. It could be a special moment, a regular day, or something that captures their essence."
              },
              {
                title: "Write",
                content: "Write freely about this memory. What happened? What did you see, hear, or feel? What made this moment meaningful?"
              },
              {
                title: "Reflect",
                content: "How does remembering make you feel now? Notice your emotions without judgment. There's no right or wrong way to feel."
              }
            ],
            prompts: [
              "Describe a memory that brings you joy when you think of your loved one.",
              "What qualities or traits do you miss most about them?",
              "If you could tell them something now, what would you say?",
              "How has your relationship with them shaped who you are today?",
              "What traditions or activities remind you of them?"
            ],
            tips: [
              "Don't worry about grammar or structure - just write from the heart.",
              "It's okay if tears come while writing - that's a natural part of grief.",
              "You can save your journal entries to revisit when you need to feel connected.",
              "There's no timeline for grief. Be patient with yourself in this process."
            ],
            resources: [
              {
                title: "What is Normal Grief? | Mayo Clinic",
                description: "Expert information about grief processes and coping strategies",
                link: "https://www.mayoclinic.org/patient-visitor-guide/support-groups/what-is-grief"
              },
              {
                title: "Coping with Grief and Loss | HelpGuide.org",
                description: "Comprehensive guide to understanding and navigating grief",
                link: "https://www.helpguide.org/articles/grief/coping-with-grief-and-loss.htm"
              },
              {
                title: "The Ball in the Box: A Helpful Analogy for Grief | Twitter Thread",
                description: "A simple but profound way to understand how grief changes over time",
                link: "https://twitter.com/LaurenHerschel/status/946887540732915712"
              },
              {
                title: "What's Your Grief: 64 Journaling Prompts",
                description: "Extensive list of journaling prompts specifically for grief",
                link: "https://whatsyourgrief.com/64-journaling-prompts-for-coping-with-grief/"
              }
            ],
            type: "journal"
          },
          
          // ANXIETY & STRESS EXERCISES
          'breathing': {
            title: "4-7-8 Breathing Technique",
            description: "A calming breathing exercise to help reduce anxiety and stress.",
            steps: [
              {
                title: "Prepare",
                content: "Find a comfortable sitting position. Place the tip of your tongue against the ridge behind your upper front teeth."
              },
              {
                title: "Inhale",
                content: "Close your mouth and inhale quietly through your nose for a count of 4."
              },
              {
                title: "Hold",
                content: "Hold your breath for a count of 7."
              },
              {
                title: "Exhale",
                content: "Exhale completely through your mouth with a whooshing sound for a count of 8."
              }
            ],
            tips: [
              "Repeat this cycle 4 times initially, and work up to 8 cycles with practice.",
              "This exercise is especially helpful before bed or during moments of stress.",
              "The ratio of 4:7:8 is important, but you can adjust the actual time if needed.",
              "You may feel lightheaded at first - this is normal and will pass with practice."
            ],
            resources: [
              {
                title: "The 4-7-8 Breathing Technique | Dr. Andrew Weil",
                description: "Video demonstration by Dr. Weil who popularized this technique",
                link: "https://www.drweil.com/videos-features/videos/breathing-exercises-4-7-8-breath/"
              },
              {
                title: "Harvard Health: Relaxation techniques: Breath control helps quell errant stress response",
                description: "Scientific explanation of how breathing exercises affect stress",
                link: "https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response"
              },
              {
                title: "Guided 4-7-8 Breathing Exercise | YouTube",
                description: "Follow along with this guided video for proper technique",
                link: "https://www.youtube.com/watch?v=PmBYdfv5RSk"
              }
            ],
            type: "breathing"
          },
          'grounding': {
            title: "5-4-3-2-1 Grounding Exercise",
            description: "A sensory awareness technique to help manage anxiety and bring you back to the present moment.",
            steps: [
              {
                title: "Observe",
                content: "Look around and identify 5 things you can SEE in the room. Say them out loud or note them mentally."
              },
              {
                title: "Touch",
                content: "Find 4 things you can TOUCH or FEEL. This could be the texture of your clothing, the surface of a table, or the feeling of the chair against your back."
              },
              {
                title: "Listen",
                content: "Focus on 3 things you can HEAR. These might be distant sounds, like birds outside, or closer sounds, like your own breathing."
              },
              {
                title: "Smell",
                content: "Notice 2 things you can SMELL. If you can't smell anything at first, move to another spot or find something with a scent, like hand lotion or a candle."
              },
              {
                title: "Taste",
                content: "Identify 1 thing you can TASTE. You might take a sip of a beverage, eat a small piece of food, or simply notice the current taste in your mouth."
              }
            ],
            tips: [
              "Take your time with each step – there's no rush.",
              "If you're in a situation where you can't speak aloud, just note each observation silently.",
              "For a shorter exercise, you can do a 3-2-1 version with just three senses.",
              "Practice regularly to make this technique more effective during high-anxiety moments."
            ],
            resources: [
              {
                title: "Grounding Techniques | University of Rochester Medical Center",
                description: "Evidence-based grounding techniques from mental health experts",
                link: "https://www.urmc.rochester.edu/behavioral-health-partners/bhp-blog/april-2018/5-4-3-2-1-coping-technique-for-anxiety.aspx"
              },
              {
                title: "How to Ground Yourself During an Anxiety Attack | Healthline",
                description: "Practical strategies for using grounding during high anxiety moments",
                link: "https://www.healthline.com/health/grounding-techniques"
              },
              {
                title: "VA: PTSD Coach Online - Grounding Exercises",
                description: "Collection of grounding exercises from the Veterans Administration",
                link: "https://www.ptsd.va.gov/apps/ptsdcoachonline/tools/index.htm"
              }
            ],
            type: "sensory"
          },
          'muscle-relaxation': {
            title: "Progressive Muscle Relaxation",
            description: "A technique that involves tensing and then releasing different muscle groups to reduce physical tension and anxiety.",
            steps: [
              {
                title: "Prepare",
                content: "Find a comfortable position sitting or lying down. Close your eyes if you feel comfortable doing so."
              },
              {
                title: "Feet & Legs",
                content: "Start with your feet and legs. Tense these muscles by pointing your toes and tightening your calves and thighs. Hold for 5 seconds, then release completely. Notice the difference between tension and relaxation."
              },
              {
                title: "Abdomen & Chest",
                content: "Move to your abdomen and chest. Tighten these muscles by taking a deep breath and holding it while clenching your stomach muscles. Hold for 5 seconds, then release, letting the breath go."
              },
              {
                title: "Arms & Hands",
                content: "Next, focus on your arms and hands. Make fists and tense your arms. Hold for 5 seconds, then release, letting your hands go limp."
              },
              {
                title: "Shoulders & Neck",
                content: "Move to your shoulders and neck. Raise your shoulders toward your ears and tighten your neck muscles. Hold for 5 seconds, then release, feeling the tension melt away."
              },
              {
                title: "Face",
                content: "Finally, tense the muscles in your face by squeezing your eyes shut and clenching your jaw. Hold for 5 seconds, then release, feeling your face soften."
              },
              {
                title: "Complete Body",
                content: "Now, become aware of your entire body. Notice any remaining tension and let it go. Feel a wave of relaxation flowing from the top of your head to the tips of your toes."
              }
            ],
            tips: [
              "Don't tense your muscles too tightly to avoid cramping or pain.",
              "Focus on the contrast between tension and relaxation.",
              "Breathe normally throughout the exercise, except when specifically instructed otherwise.",
              "Practice regularly for best results - aim for once or twice daily."
            ],
            resources: [
              {
                title: "Progressive Muscle Relaxation | Anxiety Canada",
                description: "Detailed guide with audio instructions for PMR",
                link: "https://www.anxietycanada.com/articles/how-to-do-progressive-muscle-relaxation/"
              },
              {
                title: "The Science Behind Progressive Muscle Relaxation | American Psychological Association",
                description: "Scientific research on the effectiveness of progressive muscle relaxation",
                link: "https://www.apa.org/topics/stress/relaxation"
              },
              {
                title: "15-Minute Progressive Muscle Relaxation | YouTube",
                description: "Guided video to follow along with a full PMR session",
                link: "https://www.youtube.com/watch?v=1nZEdqcGVzo"
              }
            ],
            type: "physical"
          },
          
          // GRATITUDE & POSITIVE EMOTION EXERCISES
          'gratitude': {
            title: "Gratitude Practice",
            description: "Cultivating gratitude has been shown to increase positive emotions and improve well-being.",
            steps: [
              {
                title: "Reflect",
                content: "Take a moment to think about the past day or week. What are you grateful for?"
              },
              {
                title: "List",
                content: "Write down 3-5 things you feel grateful for. These can be simple things like a good meal or complex things like a supportive relationship."
              },
              {
                title: "Elaborate",
                content: "Choose one item from your list and expand on why you're grateful for it. How does it affect your life? What would be different without it?"
              },
              {
                title: "Feel",
                content: "As you write, try to really feel the gratitude in your body. Where do you notice these positive feelings? Allow yourself to fully experience this emotion."
              }
            ],
            prompts: [
              "What's something in your daily life that you might take for granted, but would really miss if it were gone?",
              "Who has done something that you're thankful for recently?",
              "What's something about your body or health that you're grateful for today?",
              "What opportunity or experience are you thankful for having had?",
              "What's something in nature that brings you joy or awe?"
            ],
            tips: [
              "Try to be specific rather than general in your gratitude items.",
              "Focus on people rather than things where possible, as this tends to build stronger positive emotions.",
              "Consider surprising or unexpected things you're grateful for.",
              "Make this a regular practice - daily or weekly - for maximum benefit."
            ],
            resources: [
              {
                title: "The Science of Gratitude | Greater Good Science Center, UC Berkeley",
                description: "Research on the psychological benefits of gratitude practice",
                link: "https://greatergood.berkeley.edu/topic/gratitude/definition"
              },
              {
                title: "Giving Thanks Can Make You Happier | Harvard Health",
                description: "Harvard's perspective on the mental health benefits of gratitude",
                link: "https://www.health.harvard.edu/healthbeat/giving-thanks-can-make-you-happier"
              },
              {
                title: "How Gratitude Changes You and Your Brain | Greater Good Magazine",
                description: "Research findings on the neural effects of gratitude practice",
                link: "https://greatergood.berkeley.edu/article/item/how_gratitude_changes_you_and_your_brain"
              }
            ],
            type: "journal"
          },
          'three-good-things': {
            title: "Three Good Things Practice",
            description: "This simple exercise helps train your mind to notice and remember positive experiences.",
            steps: [
              {
                title: "Identify",
                content: "Think of three good things that happened today. They can be small (enjoying a cup of coffee) or significant (accomplishing a goal)."
              },
              {
                title: "Write",
                content: "For each good thing, write it down and note why it happened and how it made you feel."
              },
              {
                title: "Reflect",
                content: "Consider what these positive events tell you about your life, yourself, and others around you."
              },
              {
                title: "Savor",
                content: "Take a moment to really savor the positive feelings associated with these good things."
              }
            ],
            tips: [
              "Try to do this exercise before bed to end your day on a positive note.",
              "Keep a dedicated journal for your Three Good Things practice to build a collection of positive memories.",
              "Even on difficult days, challenge yourself to find three positive moments, no matter how small.",
              "Look for patterns over time - what consistently brings you joy or satisfaction?"
            ],
            resources: [
              {
                title: "Three Good Things Exercise | Positive Psychology Center, UPenn",
                description: "The original research-backed Three Good Things practice from Dr. Martin Seligman's team",
                link: "https://ppc.sas.upenn.edu/resources/three-good-things-exercise"
              },
              {
                title: "The Three Good Things Exercise | Action for Happiness",
                description: "Detailed instructions and variations on the practice",
                link: "https://www.actionforhappiness.org/take-action/find-three-good-things-each-day"
              },
              {
                title: "The Science of Three Good Things | Psychology Today",
                description: "Scientific research on why this simple exercise is so effective",
                link: "https://www.psychologytoday.com/us/blog/click-here-happiness/201807/the-three-good-things-exercise"
              }
            ],
            type: "journal"
          },
          
          // MINDFULNESS EXERCISES
          'mindfulness': {
            title: "Basic Mindfulness Meditation",
            description: "A simple meditation practice to develop present-moment awareness and acceptance.",
            steps: [
              {
                title: "Posture",
                content: "Find a comfortable seated position with your back straight but not rigid. Place your hands on your lap or knees."
              },
              {
                title: "Breath",
                content: "Close your eyes or lower your gaze. Bring your attention to your breathing. Notice the sensations as you inhale and exhale naturally. Don't try to control your breath, just observe it."
              },
              {
                title: "Anchor",
                content: "When your mind wanders (which is normal), gently bring your attention back to your breath. The practice isn't about preventing thoughts but noticing when you're distracted and returning to your anchor."
              },
              {
                title: "Body",
                content: "Expand your awareness to include your whole body. Notice any sensations, tension, or comfort without trying to change anything."
              },
              {
                title: "Sounds",
                content: "Now include awareness of sounds in your environment. Notice them come and go without labeling them as good or bad."
              },
              {
                title: "Thoughts",
                content: "Finally, observe your thoughts as they arise. Try to see them as passing events rather than facts or commands that require action."
              },
              {
                title: "Close",
                content: "When you're ready to end your practice, slowly open your eyes if they were closed. Take a moment to notice how you feel before moving on with your day."
              }
            ],
            tips: [
              "Start with just 5 minutes and gradually increase your time.",
              "Consistency is more important than duration - a daily 5-minute practice is better than an occasional 30-minute one.",
              "Be kind to yourself when your mind wanders. This is part of the practice, not a failure.",
              "Try using a timer so you don't need to check the time during your practice."
            ],
            resources: [
              {
                title: "Getting Started with Mindfulness | Mindful.org",
                description: "Comprehensive beginner's guide to mindfulness meditation",
                link: "https://www.mindful.org/meditation/mindfulness-getting-started/"
              },
              {
                title: "How to Meditate | The New York Times",
                description: "Well-respected guide for beginners from The New York Times",
                link: "https://www.nytimes.com/guides/well/how-to-meditate"
              },
              {
                title: "Body Scan Meditation | Guided Practice from UCLA",
                description: "Free guided audio meditation from UCLA's Mindful Awareness Research Center",
                link: "https://www.uclahealth.org/programs/marc/mindful-meditations"
              },
              {
                title: "The Science of Mindfulness | Harvard Health",
                description: "Research on the benefits of mindfulness meditation",
                link: "https://www.health.harvard.edu/blog/mindfulness-meditation-may-ease-anxiety-mental-stress-201401086967"
              }
            ],
            type: "meditation"
          },
          
          // ANGER MANAGEMENT EXERCISES
          'anger-management': {
            title: "Anger Cooling Technique",
            description: "A multi-step approach to manage intense anger in the moment.",
            steps: [
              {
                title: "Recognize",
                content: "Become aware that you're feeling angry. Notice physical signs like increased heart rate, muscle tension, or feeling hot."
              },
              {
                title: "Pause",
                content: "Take a deliberate pause before reacting. Count slowly to 10 while taking deep breaths."
              },
              {
                title: "Breathe",
                content: "Take several deep breaths. Inhale through your nose for 4 counts, hold for 2, and exhale through your mouth for 6 counts."
              },
              {
                title: "Reframe",
                content: "Try to look at the situation from a different perspective. Ask yourself: Will this matter in an hour? A day? A week?"
              },
              {
                title: "Choose",
                content: "Consciously choose how to respond rather than react. Consider what response will best serve you in the long run."
              }
            ],
            tips: [
              "If possible, physically step away from the triggering situation temporarily.",
              "Avoid making important decisions or having difficult conversations when you're at the height of anger.",
              "Regular physical exercise can help reduce overall stress and make anger management easier.",
              "If anger is a frequent issue that impacts your relationships or wellbeing, consider speaking with a mental health professional."
            ],
            resources: [
              {
                title: "Controlling Anger Before It Controls You | American Psychological Association",
                description: "Expert strategies for managing anger from the APA",
                link: "https://www.apa.org/topics/anger/control"
              },
              {
                title: "How to Control Anger: 25 Tips to Manage Your Anger | Healthline",
                description: "Practical techniques for immediate and long-term anger management",
                link: "https://www.healthline.com/health/mental-health/how-to-control-anger"
              },
              {
                title: "Anger Management: 10 Tips to Tame Your Temper | Mayo Clinic",
                description: "Evidence-based approaches to managing anger from medical experts",
                link: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434"
              },
              {
                title: "Strategies to Keep Anger at Bay | HelpGuide.org",
                description: "Comprehensive guide with specific techniques for different situations",
                link: "https://www.helpguide.org/articles/relationships-communication/anger-management.htm"
              }
            ],
            type: "coping"
          },
          
          // DEFAULT EXERCISE
          'default': {
            title: exercise.title || "Mindfulness Exercise",
            description: exercise.description || "A guided exercise to help with your well-being.",
            steps: [
              {
                title: "Center",
                content: "Find a comfortable position and take a few moments to center yourself."
              },
              {
                title: "Breathe",
                content: "Take a few deep breaths, feeling your body relax with each exhale."
              },
              {
                title: "Reflect",
                content: "Gently reflect on what you're experiencing right now, with an attitude of curiosity and kindness."
              }
            ],
            tips: [
              "There's no right or wrong way to practice mindfulness.",
              "Return to your breath whenever you notice your mind wandering.",
              "Even a few minutes of practice can be beneficial."
            ],
            type: "general"
          },
          'active-listening': {
            title: "Active Listening Practice",
            description: "Active listening is a powerful skill that strengthens relationships and improves understanding. This practice will help you develop your active listening abilities.",
            steps: [
              {
                title: "Understanding Active Listening",
                content: "Active listening means fully concentrating on what someone is saying, understanding their message, responding thoughtfully, and remembering key information. It's about being present rather than just waiting for your turn to speak."
              },
              {
                title: "Key Components",
                content: "Active listening involves several key behaviors: maintaining eye contact, giving verbal and non-verbal feedback, avoiding interruptions, asking clarifying questions, paraphrasing to confirm understanding, and responding thoughtfully."
              },
              {
                title: "Practice Exercise",
                content: "Next time you're in a conversation, try the RASA technique: Receive (pay attention), Appreciate (nod, say 'hmm'), Summarize ('So what you're saying is...'), and Ask questions to clarify or deepen understanding."
              },
              {
                title: "Reflection",
                content: "After practicing, reflect on: How did it feel to listen this way? What did you notice about the speaker's response? What was challenging? What insights did you gain that you might have missed otherwise?"
              }
            ],
            resources: [
              {
                title: "The Power of Listening | William Ury | TEDxSanDiego",
                description: "A compelling TED talk on the transformative power of listening",
                link: "https://www.youtube.com/watch?v=saXfavo1OQo"
              },
              {
                title: "10 Steps To Effective Listening - Forbes",
                description: "Practical steps to improve your listening skills",
                link: "https://www.forbes.com/sites/womensmedia/2012/11/09/10-steps-to-effective-listening/"
              },
              {
                title: "Active Listening - Mind Tools",
                description: "Comprehensive guide to active listening techniques",
                link: "https://www.mindtools.com/CommSkll/ActiveListening.htm"
              },
              {
                title: "Julian Treasure: 5 Ways To Listen Better | TED Talk",
                description: "Learn how to listen consciously in this popular TED talk",
                link: "https://www.ted.com/talks/julian_treasure_5_ways_to_listen_better"
              }
            ],
            tips: [
              "Focus completely on the speaker and remove distractions (put away your phone, turn off notifications).",
              "Show that you're listening through your body language - face the person, maintain appropriate eye contact, and nod occasionally.",
              "Avoid preparing your response while the other person is still talking.",
              "Ask open-ended questions that encourage elaboration rather than yes/no answers.",
              "Practice empathy by trying to understand the speaker's perspective, even if you disagree.",
              "Provide feedback by paraphrasing ('What I'm hearing is...') to ensure you've understood correctly."
            ],
            exercises: [
              {
                title: "One-Minute Exercise",
                description: "In your next conversation, try counting to 1 silently after the person stops speaking before you respond. This small pause ensures they're finished and gives you time to consider your response."
              },
              {
                title: "Paraphrasing Practice",
                description: "In your next three conversations, challenge yourself to paraphrase what the speaker has said before responding with your own thoughts."
              },
              {
                title: "Emotion Recognition",
                description: "During a conversation, try to identify the emotions behind what the person is saying, not just the content. You might note to yourself: 'They seem excited about this' or 'I sense frustration in their voice.'"
              }
            ],
            type: "relationship"
          },
          'self-compassion': {
            title: "Self-Compassion Practice",
            description: "Learn to treat yourself with the same kindness and understanding you would offer to a good friend.",
            steps: [
              {
                title: "Recognize Suffering",
                content: "Notice when you're experiencing difficulty or emotional pain. Acknowledge it with phrases like 'This is a moment of suffering' or 'This is hard right now.'"
              },
              {
                title: "Remember Common Humanity",
                content: "Remind yourself that suffering is part of the shared human experience. Many others have felt what you're feeling. Try saying: 'Everyone struggles sometimes' or 'I'm not alone in this feeling.'"
              },
              {
                title: "Offer Kindness",
                content: "Speak to yourself with warmth and understanding. Place a hand on your heart if that feels comfortable. Ask: 'What do I need to hear right now?' Then offer those words to yourself."
              },
              {
                title: "Physical Self-Compassion",
                content: "Take a self-compassion break by giving yourself physical comfort. This might be a gentle hand on your cheek, a deep breath, or a moment of rest. Honor what your body needs right now."
              }
            ],
            resources: [
              {
                title: "Self-Compassion Guided Practices and Exercises | Dr. Kristin Neff",
                description: "Free resources from the leading researcher on self-compassion",
                link: "https://self-compassion.org/category/exercises/"
              },
              {
                title: "The Three Elements of Self-Compassion | Greater Good Magazine",
                description: "Learn about the three components that make up self-compassion",
                link: "https://greatergood.berkeley.edu/article/item/the_three_parts_of_self_compassion"
              },
              {
                title: "Self-Compassion Break | Guided Audio Practice",
                description: "Follow along with this 5-minute guided self-compassion exercise",
                link: "https://self-compassion.org/wp-content/uploads/2015/12/self-compassion.break_.mp3"
              },
              {
                title: "The Science of Self-Compassion | Stanford Medicine",
                description: "Research on how self-compassion affects mental and physical health",
                link: "https://med.stanford.edu/compassion/research.html"
              }
            ],
            tips: [
              "Try to use the same supportive tone you would use with a good friend going through a difficult time.",
              "It's normal to feel resistance to self-compassion at first. Notice this without judgment.",
              "Start with small moments of difficulty before tackling your biggest challenges.",
              "Practice regularly, even when you're feeling good, to build the self-compassion habit.",
              "Remember that self-compassion is not self-pity or self-indulgence—it's about honest kindness."
            ],
            type: "emotional"
          }
        };
        
        // Get the appropriate content or fall back to default
        const content = exerciseContents[exercisePath] || exerciseContents['default'];
        
        // Set the content
        setExerciseContent(content);
        
        // Initialize checklist for exercises that use it
        if (content.steps) {
          const initialChecklist = {};
          content.steps.forEach((_, index) => {
            initialChecklist[index] = false;
          });
          setChecklist(initialChecklist);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading exercise content:", error);
        setLoading(false);
        // Fall back to a basic template
        setExerciseContent({
          title: exercise.title,
          description: exercise.description,
          steps: [{ title: "Practice", content: "Follow the instructions provided." }],
          tips: ["Take your time with this exercise."],
          type: "general"
        });
      }
    };
    
    fetchExerciseContent();
  }, [exercise]);

  const handleSave = () => {
    if (journalEntry.trim()) {
      // In a real application, you would save this to your backend
      console.log("Saving journal entry:", journalEntry);
      
      // For now, just show a success message
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    }
  };

  const nextStep = () => {
    if (exerciseContent && step < exerciseContent.steps.length) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setSeconds(0);
    setTimerActive(false);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleCheckItem = (index) => {
    setChecklist({
      ...checklist,
      [index]: !checklist[index]
    });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#1A2335] border border-[#3E60C1] rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto mx-4"
        >
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse text-[#B8C7E0]">Loading exercise...</div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1A2335] border border-[#3E60C1] rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {exerciseContent?.title || exercise.title}
          </h3>
          <button onClick={onClose} className="text-[#B8C7E0] hover:text-white">
              <FaTimes />
            </button>
          </div>
          
        <p className="text-[#B8C7E0] mb-6">
          {exerciseContent?.description || exercise.description}
        </p>
        
        {/* Steps progress indicator */}
        {exerciseContent?.steps && exerciseContent.steps.length > 1 && (
          <div className="flex justify-between mb-6">
            {exerciseContent.steps.map((s, i) => (
              <div 
                key={i} 
                className={`flex-1 h-1 rounded-full mx-1 ${
                  i + 1 === step ? 'bg-[#5983FC]' : 
                  i + 1 < step ? 'bg-[#3E60C1]/50' : 'bg-[#2A3547]'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Current step content */}
        {exerciseContent?.steps && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">
              {exerciseContent.steps[step-1]?.title || `Step ${step}`}
            </h4>
            <p className="text-[#B8C7E0]">
              {exerciseContent.steps[step-1]?.content}
            </p>
            
            {/* Checkbox for completion */}
            <div className="mt-4">
              <button 
                onClick={() => toggleCheckItem(step-1)}
                className="flex items-center text-[#B8C7E0] hover:text-white"
              >
                <div className={`w-5 h-5 mr-2 flex items-center justify-center rounded border ${
                  checklist[step-1] ? 'bg-green-500 border-green-600' : 'border-[#3E60C1]'
                }`}>
                  {checklist[step-1] && <FaCheck className="text-white text-xs" />}
                </div>
                Mark as completed
              </button>
            </div>
          </div>
        )}
        
        {/* Breathing exercise timer */}
        {exerciseContent?.type === 'breathing' && (
          <div className="mb-6 bg-[#0F172A] rounded-lg border border-[#2A3547] p-4">
            <h4 className="text-white font-medium mb-3">Breathing Timer</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#5983FC] mb-4">
                {formatTime(seconds)}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleTimer}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#3E60C1] text-white hover:bg-[#5983FC]"
                >
                  {timerActive ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={resetTimer}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2A3547] text-white hover:bg-[#3E60C1]"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Meditation timer */}
        {exerciseContent?.type === 'meditation' && (
          <div className="mb-6 bg-[#0F172A] rounded-lg border border-[#2A3547] p-4">
            <h4 className="text-white font-medium mb-3">Meditation Timer</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#5983FC] mb-4">
                {formatTime(seconds)}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleTimer}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#3E60C1] text-white hover:bg-[#5983FC]"
                >
                  {timerActive ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={resetTimer}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2A3547] text-white hover:bg-[#3E60C1]"
                >
                  <FaTimes />
                </button>
              </div>
              <p className="text-[#B8C7E0] text-sm mt-4">
                Recommended duration: 5-10 minutes for beginners
              </p>
            </div>
          </div>
        )}
        
        {/* Journal entry area for journal-type exercises */}
        {exerciseContent?.type === 'journal' && (
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">Your Journal Entry</label>
            <div className="bg-[#0F172A] rounded-lg border border-[#2A3547] p-2">
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write your thoughts and feelings here..."
                className="w-full bg-transparent text-[#B8C7E0] p-2 min-h-[120px] focus:outline-none resize-none"
              ></textarea>
            </div>
            
            {/* Journal prompts */}
            {exerciseContent?.prompts && (
              <div className="mt-4">
                <h5 className="text-white font-medium mb-2">Prompts for Reflection</h5>
                <div className="bg-[#0F172A] rounded-lg border border-[#2A3547] p-4">
                  <ul className="space-y-2">
                    {exerciseContent.prompts.map((prompt, index) => (
                      <li key={index} className="flex items-start">
                        <FaRegLightbulb className="text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-[#B8C7E0]">{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!journalEntry.trim()}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  journalEntry.trim() 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-[#2A3547] text-[#B8C7E0] cursor-not-allowed'
                }`}
              >
                <FaSave className="mr-2" /> Save Entry
              </button>
            </div>
            
            {saved && (
              <div className="mt-2 text-green-400 text-sm">
                Journal entry saved successfully!
              </div>
            )}
          </div>
        )}
        
        {/* Tips section */}
        {exerciseContent?.tips && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Helpful Tips</h4>
            <div className="bg-[#0F172A] rounded-lg border border-[#2A3547] p-4">
              <ul className="space-y-2">
                {exerciseContent.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <FaRegLightbulb className="text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-[#B8C7E0]">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* External resources section */}
        {exerciseContent?.resources && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Recommended Resources</h4>
            <div className="bg-[#0F172A] rounded-lg border border-[#2A3547] p-4">
              <ul className="space-y-4">
                {exerciseContent.resources.map((resource, index) => (
                  <li key={index} className="border-b border-[#2A3547] last:border-0 pb-3 last:pb-0">
                    <a 
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5983FC] hover:text-[#3E60C1] font-medium block mb-1"
                    >
                      {resource.title} <FaExternalLinkAlt className="inline-block ml-1 text-xs" />
                    </a>
                    <p className="text-[#B8C7E0] text-sm">{resource.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Additional exercises section */}
        {exerciseContent?.exercises && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Try These Micro-Practices</h4>
            <div className="bg-[#0F172A] rounded-lg border border-[#2A3547] p-4">
              <ul className="space-y-3">
                {exerciseContent.exercises.map((ex, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-blue-500/20 p-2 rounded-full mt-1 mr-3">
                      <FaRegLightbulb className="text-blue-400 text-xs" />
                    </div>
                    <div>
                      <h5 className="text-white font-medium mb-1">{ex.title}</h5>
                      <p className="text-[#B8C7E0] text-sm">{ex.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        {exerciseContent?.steps && exerciseContent.steps.length > 1 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-4 py-2 rounded-lg flex items-center ${
                step !== 1 
                  ? 'bg-[#3E60C1] text-white hover:bg-[#5983FC]' 
                  : 'bg-[#2A3547] text-[#B8C7E0] cursor-not-allowed'
              }`}
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
            
            {step < exerciseContent.steps.length ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 rounded-lg bg-[#3E60C1] text-white hover:bg-[#5983FC] flex items-center"
              >
                Next <FaArrowRight className="ml-2" />
              </button>
            ) : (
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#3E60C1] text-white hover:bg-[#5983FC]"
              >
                Complete
            </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExerciseModal; 