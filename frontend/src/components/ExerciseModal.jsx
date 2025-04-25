import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaRegLightbulb, FaCheck, FaArrowRight, FaArrowLeft, FaPlay, FaPause, FaExternalLinkAlt, FaVolumeMute, FaVolumeUp, FaStopwatch, FaLink, FaYoutube, FaFileAlt, FaBook, FaEdit, FaTrash, FaPlus, FaClock, FaChevronLeft, FaChevronRight, FaLightbulb, FaPencilAlt, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ExerciseModal = ({ exercise, onClose }) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [exerciseContent, setExerciseContent] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResources, setShowResources] = useState(false);
  const [checklist, setChecklist] = useState({});
  const [activePerspective, setActivePerspective] = useState('your');
  const [yourViewData, setYourViewData] = useState({
    situation: '',
    feelings: '',
    needs: ''
  });
  const [theirViewData, setTheirViewData] = useState({
    feelings: '',
    needs: '',
    context: ''
  });
  const [commonGround, setCommonGround] = useState('');

  const [valuesList, setValuesList] = useState([
    { id: 1, value: '', rank: 1 },
    { id: 2, value: '', rank: 2 },
    { id: 3, value: '', rank: 3 },
    { id: 4, value: '', rank: 4 },
    { id: 5, value: '', rank: 5 }
  ]);
  const [draggedValue, setDraggedValue] = useState(null);
  const [valueDefinition, setValueDefinition] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [actualHours, setActualHours] = useState('');
  const [boundaryIssues, setBoundaryIssues] = useState(['', '', '']);
  const [boundaryStatements, setBoundaryStatements] = useState(['', '', '']);
  const [obstacles, setObstacles] = useState(['', '', '']);
  const [selectedBoundary, setSelectedBoundary] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [workValues, setWorkValues] = useState([{ value: '', rating: 5, alignment: '' }]);
  const [missionStatement, setMissionStatement] = useState('');
  const [meaningfulTask, setMeaningfulTask] = useState('');
  const [bodyAreas, setBodyAreas] = useState([
    { area: 'Heart', gratitude: '', checked: false },
    { area: 'Lungs', gratitude: '', checked: false },
    { area: 'Brain', gratitude: '', checked: false },
    { area: 'Arms & Hands', gratitude: '', checked: false },
    { area: 'Legs & Feet', gratitude: '', checked: false },
    { area: 'Senses', gratitude: '', checked: false }
  ]);
  const [generalGratitude, setGeneralGratitude] = useState('');
  const [selfCareIntention, setSelfCareIntention] = useState('');
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathingComplete, setIsBreathingComplete] = useState(false);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [gratitudeText, setGratitudeText] = useState('');
  const [healthWorry, setHealthWorry] = useState('');
  const [worryLevel, setWorryLevel] = useState(5);
  const [supportingEvidence, setSupportingEvidence] = useState(['']);
  const [contradictingEvidence, setContradictingEvidence] = useState(['']);
  const [controlPercentage, setControlPercentage] = useState(50);
  const [actionStep, setActionStep] = useState('');
  const [anxiousThought, setAnxiousThought] = useState('');
  const [thoughtBelief, setThoughtBelief] = useState(50);
  const [balancedThought, setBalancedThought] = useState('');
  const [newBelief, setNewBelief] = useState(50);
  const [innerCriticThought, setInnerCriticThought] = useState('');
  const [criticImpact, setCriticImpact] = useState('');
  const [mentorResponse, setMentorResponse] = useState('');
  const [balancedResponse, setBalancedResponse] = useState('');
  const [practicePlan, setPracticePlan] = useState('');
  const [currentBodyPart, setCurrentBodyPart] = useState(0);
  const [bodyScanNotes, setBodyScanNotes] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const [scanTimer, setScanTimer] = useState(null);
  const [lossDescription, setLossDescription] = useState('');
  const [tangibleLosses, setTangibleLosses] = useState(['']);
  const [intangibleLosses, setIntangibleLosses] = useState(['']);
  const [missedMost, setMissedMost] = useState('');
  const [remainingStrengths, setRemainingStrengths] = useState(['']);
  const [adaptationStep, setAdaptationStep] = useState('');
  const [perspectiveChange, setPerspectiveChange] = useState('');
  const [valueShifts, setValueShifts] = useState(['']);
  const [discoveredStrengths, setDiscoveredStrengths] = useState(['']);
  const [meaningConnection, setMeaningConnection] = useState('');
  const [futureImpact, setFutureImpact] = useState('');
  const [meaningStatement, setMeaningStatement] = useState('');
  const [bondQuality, setBondQuality] = useState('');
  const [bondMemories, setBondMemories] = useState('');
  const [continuingAspects, setContinuingAspects] = useState('');
  const [ritualDescription, setRitualDescription] = useState('');
  const [identityIntegration, setIdentityIntegration] = useState('');
  const [ongoingMessage, setOngoingMessage] = useState('');
  const [uncertaintySituation, setUncertaintySituation] = useState('');
  const [physicalSensations, setPhysicalSensations] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [controlAspects, setControlAspects] = useState('');
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const [futurePossibilitiesData, setFuturePossibilitiesData] = useState({
    situation: '',
    scenarios: {
      positive: { description: '', coping: '', resources: '' },
      neutral: { description: '', coping: '', resources: '' },
      challenging: { description: '', coping: '', resources: '' }
    }
  });
  const getDurationInSeconds = () => {
    if (!exercise.duration) return 300;

    const durationMatch = exercise.duration.match(/(\d+)[-–]?(\d+)?\s+minute/i);
    if (durationMatch) {
      const minDuration = parseInt(durationMatch[1], 10);
      const maxDuration = durationMatch[2] ? parseInt(durationMatch[2], 10) : minDuration;
      return Math.max(minDuration, maxDuration) * 60;
    }

    return 300;
  };
  const totalDuration = getDurationInSeconds();
  const startTimer = () => {
    if (!timerActive) {
      setTimerActive(true);
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          if (prev >= totalDuration) {
            clearInterval(timerRef.current);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setTimerActive(false);
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeElapsed(0);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentStep = () => {
    if (!exerciseContent?.steps || exerciseContent.steps.length === 0) {
      return "No steps available for this exercise.";
    }

    if (step < exerciseContent.steps.length) {
      return exerciseContent.steps[step].content;
    }

    return "Complete! How do you feel now?";
  };

  const handleComplete = () => {
    pauseTimer();
    setCompleted(true);
  };

  const hasInteractiveComponent = () => {
    if (!exerciseContent) return false;

    return exerciseContent.type === 'journal' ||
      exerciseContent.type === 'journaling' ||
      exerciseContent.type === 'appreciation' ||
      exerciseContent.type === 'meditation' ||
      exerciseContent.type === 'breathing' ||
      exerciseContent.type === 'reflection' ||
      exerciseContent.type === 'checklist' ||
      exerciseContent.type === 'sensory' ||
      exerciseContent.type === 'coping' ||
      exerciseContent.type === 'physical' ||
      exerciseContent.type === 'relationship' ||
      exerciseContent.type === 'work' ||
      exerciseContent.type === 'task' ||
      exerciseContent.type === 'work-values' ||
      exerciseContent.type === 'appreciation' ||
      exerciseContent.type === 'body-appreciation' ||
      exerciseContent.type === 'health-worry' ||
      exerciseContent.type === 'anxious-thought' ||
      exerciseContent.type === 'body-scan' ||
      exerciseContent.type === 'loss-processing' ||
      exerciseContent.type === 'meaning-making' ||
      exerciseContent.type === 'continuing-bonds' ||
      exerciseContent.type === 'inner-critic' ||
      exerciseContent.type === 'uncertainty-tolerance' ||
      exerciseContent.type === 'future-possibilities';
  };

  const renderInteractiveComponent = () => {
    if (!exerciseContent) return null;

    switch (exerciseContent.type) {
      case 'journal':
      case 'journaling':
        return (
          <div className="mt-4">
            <h4 className="text-white text-sm mb-2">Your Journal Entry:</h4>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex space-x-2">
                {['😢', '😔', '😐', '🙂', '😊'].map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => setJournalEntry(prev => `${prev}\nFeeling: ${emoji}\n\n`)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3E60C1]/20 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="text-xs text-[#B8C7E0]">Track your mood</div>
            </div>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              className="w-full h-32 bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
              placeholder="Start writing here..."
            />

            {exerciseContent.prompts && (
              <div className="mt-4">
                <h4 className="text-white text-sm mb-2">Journaling Prompts:</h4>
                <div className="space-y-2">
                  {exerciseContent.prompts.map((prompt, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0F172A] p-3 rounded-lg border border-[#2A3547] text-[#B8C7E0] text-sm cursor-pointer hover:border-[#5983FC] transition-colors"
                      onClick={() => setJournalEntry(prev => prev ? `${prev}\n\n${prompt}:\n` : `${prompt}:\n`)}
                    >
                      {prompt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'breathing':
        return (
          <div className="mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-semibold text-white mb-3">
                {formatTime(timeElapsed)} / {formatTime(totalDuration)}
              </div>
              <div className="relative w-32 h-32 mb-6">
                <div
                  className={`absolute inset-0 rounded-full border-2 border-[#5983FC] ${timerActive ? 'animate-pulse-slow' : ''
                    }`}
                ></div>
                <div
                  className={`absolute inset-0 bg-[#5983FC]/20 rounded-full transform transition-all duration-4000 ${timerActive && timeElapsed % 8 < 4
                    ? 'scale-100'
                    : 'scale-50'
                    }`}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  {timerActive && timeElapsed % 12 < 4
                    ? "Inhale"
                    : timerActive && timeElapsed % 12 < 7
                      ? "Hold"
                      : "Exhale"}
                </div>
              </div>
              <div className="w-full bg-[#0F172A] h-2 rounded-full mb-4">
                <div
                  className="bg-gradient-to-r from-[#3E60C1] to-[#5983FC] h-2 rounded-full"
                  style={{ width: `${(timeElapsed / totalDuration) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center space-x-4">
                {timerActive ? (
                  <button
                    onClick={pauseTimer}
                    className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                  >
                    <FaPause />
                  </button>
                ) : (
                  <button
                    onClick={startTimer}
                    className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                  >
                    <FaPlay />
                  </button>
                )}
                {exerciseContent.audioUrl && (
                  <button
                    onClick={toggleAudio}
                    className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                  >
                    {audioRef.current?.paused ? <FaVolumeUp /> : <FaVolumeMute />}
                  </button>
                )}
              </div>
              <audio ref={audioRef} src={exerciseContent.audioUrl} loop />
            </div>
          </div>
        );

      case 'meditation':
        return (
          <div className="mt-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-semibold text-white mb-3">
                {formatTime(timeElapsed)} / {formatTime(totalDuration)}
              </div>
              <div className="w-full max-w-[200px] relative mb-6">
                <svg viewBox="0 0 100 220" className="w-full">
                  <path d="M50,10 Q65,30 50,50 Q35,70 50,90 Q65,110 50,140 Q35,160 50,180 Q65,200 50,220"
                    fill="none"
                    stroke="#5983FC"
                    strokeWidth="1.5"
                    strokeDasharray="5,5"
                  />
                  <circle
                    cx="50"
                    cy={10 + (timeElapsed % 30) * 7}
                    r="5"
                    fill="#5983FC"
                    className={timerActive ? "animate-pulse" : ""}
                  />
                  <rect x="30" y="30" width="40" height="60" rx="20" fill="none" stroke="#5983FC" strokeWidth="0.5" />
                  <rect x="35" y="90" width="30" height="60" rx="5" fill="none" stroke="#5983FC" strokeWidth="0.5" />
                  <rect x="40" y="150" width="20" height="70" rx="5" fill="none" stroke="#5983FC" strokeWidth="0.5" />
                </svg>
                <div className="text-[#B8C7E0] text-xs text-center mt-2">
                  Focus on your {
                    timerActive && timeElapsed % 30 < 5 ? "head" :
                      timerActive && timeElapsed % 30 < 10 ? "shoulders" :
                        timerActive && timeElapsed % 30 < 15 ? "chest" :
                          timerActive && timeElapsed % 30 < 20 ? "abdomen" :
                            timerActive && timeElapsed % 30 < 25 ? "legs" : "feet"
                  }
                </div>
              </div>
              <div className="w-full bg-[#0F172A] h-2 rounded-full mb-4">
                <div
                  className="bg-gradient-to-r from-[#3E60C1] to-[#5983FC] h-2 rounded-full"
                  style={{ width: `${(timeElapsed / totalDuration) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center space-x-4">
                {timerActive ? (
                  <button
                    onClick={pauseTimer}
                    className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                  >
                    <FaPause />
                  </button>
                ) : (
                  <button
                    onClick={startTimer}
                    className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                  >
                    <FaPlay />
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                >
                  <FaArrowLeft />
                </button>
                {exerciseContent.audioUrl && (
                  <button
                    onClick={toggleAudio}
                    className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                  >
                    {audioRef.current?.paused ? <FaVolumeUp /> : <FaVolumeMute />}
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'reflection':
        if (exerciseContent.title?.toLowerCase().includes('values clarification')) {
          return (
            <div className="mt-4">
              <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-3">
                <h4 className="text-white text-sm font-medium mb-3">Values Tracker</h4>
                <p className="text-[#B8C7E0] text-xs mb-3">Enter your values and drag to reorder by importance:</p>
                <div className="space-y-3 mb-4">
                  {valuesList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 cursor-move p-2 rounded-lg hover:bg-[#1A2335]/50 transition-colors"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, item)}
                    >
                      <div
                        className="w-8 h-8 bg-[#3E60C1]/20 rounded-full flex items-center justify-center text-[#5983FC] flex-shrink-0"
                      >
                        {item.rank}
                      </div>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleValueChange(item.id, e.target.value)}
                        className="flex-1 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                        placeholder={`Value #${item.rank}...`}
                      />
                      <div className="flex-shrink-0 text-[#5983FC]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-[#1A2335]/50 rounded-lg border border-[#2A3547]">
                  <div className="text-xs text-[#B8C7E0] mb-2">
                    <span className="text-[#5983FC]">Drag & drop tip:</span> Drag values up or down to rearrange their priority order.
                  </div>
                </div>

                <h4 className="text-white text-sm font-medium mb-2 mt-4">Value Definition</h4>
                <div className="mb-3">
                  <textarea
                    value={valueDefinition}
                    onChange={(e) => setValueDefinition(e.target.value)}
                    className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder={`Define what your top value "${valuesList[0]?.value || 'value'}" means to you personally...`}
                  />
                </div>

                <h4 className="text-white text-sm font-medium mb-2">Action Plan</h4>
                <div>
                  <textarea
                    value={actionPlan}
                    onChange={(e) => setActionPlan(e.target.value)}
                    className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="One specific way I'll honor this value this week..."
                  />
                </div>
              </div>
            </div>
          );
        } else if (exerciseContent.title?.toLowerCase().includes('perspective-taking')) {
          return (
            <div className="mt-4">
              <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-3">
                <div className="flex mb-4">
                  <button
                    onClick={() => setActivePerspective('your')}
                    className={`flex-1 py-2 ${activePerspective === 'your'
                      ? 'bg-[#3E60C1] text-white rounded-l-lg'
                      : 'bg-[#1A2335] text-[#B8C7E0] rounded-l-lg hover:bg-[#2A3547]'
                      } transition-colors`}
                  >
                    Your View
                  </button>
                  <button
                    onClick={() => setActivePerspective('their')}
                    className={`flex-1 py-2 ${activePerspective === 'their'
                      ? 'bg-[#3E60C1] text-white rounded-r-lg'
                      : 'bg-[#1A2335] text-[#B8C7E0] rounded-r-lg hover:bg-[#2A3547]'
                      } transition-colors`}
                  >
                    Their View
                  </button>
                </div>

                {activePerspective === 'your' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[#5983FC] text-xs mb-1 block">Describe the situation briefly:</label>
                      <textarea
                        value={yourViewData.situation}
                        onChange={(e) => setYourViewData({ ...yourViewData, situation: e.target.value })}
                        className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                        placeholder="What happened? Who was involved?"
                      />
                    </div>

                    <div>
                      <label className="text-[#5983FC] text-xs mb-1 block">How did you feel about it?</label>
                      <textarea
                        value={yourViewData.feelings}
                        onChange={(e) => setYourViewData({ ...yourViewData, feelings: e.target.value })}
                        className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                        placeholder="Your emotions and reactions..."
                      />
                    </div>

                    <div>
                      <label className="text-[#5983FC] text-xs mb-1 block">What did you want or need in this situation?</label>
                      <textarea
                        value={yourViewData.needs}
                        onChange={(e) => setYourViewData({ ...yourViewData, needs: e.target.value })}
                        className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                        placeholder="Your goals, needs, or desires..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[#5983FC] text-xs mb-1 block">How might they have felt about it?</label>
                      <textarea
                        value={theirViewData.feelings}
                        onChange={(e) => setTheirViewData({ ...theirViewData, feelings: e.target.value })}
                        className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                        placeholder="Try to imagine their emotions and reactions..."
                      />
                    </div>

                    <div>
                      <label className="text-[#5983FC] text-xs mb-1 block">What might they have wanted or needed?</label>
                      <textarea
                        value={theirViewData.needs}
                        onChange={(e) => setTheirViewData({ ...theirViewData, needs: e.target.value })}
                        className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                        placeholder="Their possible goals, needs, or concerns..."
                      />
                    </div>

                    <div>
                      <label className="text-[#5983FC] text-xs mb-1 block">What context or background might influence their perspective?</label>
                      <textarea
                        value={theirViewData.context}
                        onChange={(e) => setTheirViewData({ ...theirViewData, context: e.target.value })}
                        className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                        placeholder="Their history, values, current stressors..."
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-[#2A3547]">
                  <label className="text-[#5983FC] text-xs mb-1 block">Possible common ground:</label>
                  <textarea
                    value={commonGround}
                    onChange={(e) => setCommonGround(e.target.value)}
                    className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="What shared concerns, values, or goals might you both have?"
                  />
                </div>

                {(yourViewData.needs || theirViewData.needs) && (
                  <div className="mt-4 pt-4 border-t border-[#2A3547]">
                    <h4 className="text-white text-sm font-medium mb-2">Exercise Insights</h4>
                    <div className="bg-[#0F172A]/50 p-3 rounded-lg text-sm text-[#B8C7E0]">
                      {yourViewData.needs && theirViewData.needs ? (
                        <p>You've explored both perspectives - this is a powerful way to build empathy and understanding in difficult situations.</p>
                      ) : yourViewData.needs ? (
                        <p>Great start! Now try to shift to their perspective to gain deeper understanding.</p>
                      ) : (
                        <p>Interesting! You've started with their perspective - now consider your own needs as well.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        } else {
          return (
            <div className="mt-4 space-y-3">
              {exerciseContent.reflectionPrompts?.map((prompt, index) => (
                <div key={index} className="bg-[#0F172A] p-3 rounded-lg border border-[#2A3547]">
                  <p className="text-[#B8C7E0] mb-2">{prompt}</p>
                  <textarea
                    className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
                    placeholder="Your thoughts..."
                  />
                  <div className="flex justify-end mt-2">
                    <div className="flex space-x-1">
                      {['🤔', '💡', '❤️', '👍', '👎'].map((reaction, idx) => (
                        <button
                          key={idx}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#3E60C1]/20 transition-colors text-xs"
                        >
                          {reaction}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        }

      case 'checklist':
        return (
          <div className="mt-4 space-y-2">
            {exerciseContent.checkItems?.map((item, index) => (
              <div
                key={index}
                className={`flex items-start p-3 rounded-lg border ${checklist[index]
                  ? 'bg-[#3E60C1]/10 border-[#5983FC]/30'
                  : 'bg-[#0F172A] border-[#2A3547]'
                  } transition-colors`}
              >
                <div
                  className={`w-5 h-5 rounded border mr-3 cursor-pointer flex-shrink-0 mt-0.5 ${checklist[index]
                    ? 'border-[#5983FC] bg-[#5983FC]/10'
                    : 'border-[#2A3547]'
                    } transition-colors`}
                  onClick={() => toggleCheckItem(index)}
                >
                  {checklist[index] && <FaCheck className="text-[#5983FC] text-xs m-auto" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${checklist[index] ? 'text-[#5983FC]' : 'text-[#B8C7E0]'}`}>{item}</p>
                  {checklist[index] && (
                    <div className="mt-2 text-xs text-[#B8C7E0]">
                      <span className="text-emerald-400">✓</span> Completed {new Date().toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-2 flex justify-between items-center">
              <div className="text-xs text-[#B8C7E0]">
                {Object.values(checklist).filter(Boolean).length} of {exerciseContent.checkItems?.length || 0} completed
              </div>
              {Object.values(checklist).filter(Boolean).length === (exerciseContent.checkItems?.length || 0) && (
                <div className="text-sm text-emerald-400 flex items-center">
                  <FaCheck className="mr-1" /> All done!
                </div>
              )}
            </div>
          </div>
        );

      case 'sensory':
        return (
          <div className="mt-4">
            <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-3">
              <div className="grid grid-cols-5 gap-1 mb-4">
                {['👁️', '👂', '👃', '👅', '👐'].map((icon, idx) => (
                  <button
                    key={idx}
                    className={`p-2 flex flex-col items-center justify-center rounded-lg border ${step % 5 === idx
                      ? 'border-[#5983FC] bg-[#3E60C1]/10 text-white'
                      : 'border-[#2A3547] text-[#B8C7E0]'
                      }`}
                    onClick={() => setStep(idx)}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="text-xs mt-1">{
                      idx === 0 ? "See" :
                        idx === 1 ? "Hear" :
                          idx === 2 ? "Smell" :
                            idx === 3 ? "Taste" : "Touch"
                    }</span>
                  </button>
                ))}
              </div>

              <h4 className="text-white text-sm font-medium mb-2">
                {step % 5 === 0 ? "What do you SEE?" :
                  step % 5 === 1 ? "What do you HEAR?" :
                    step % 5 === 2 ? "What can you SMELL?" :
                      step % 5 === 3 ? "What do you TASTE?" :
                        "What can you FEEL?"}
              </h4>

              <div className="space-y-2">
                {[1, 2, 3, 4, 5].slice(0, 5 - step % 5).map((num) => (
                  <div key={num} className="flex items-center">
                    <div className="w-6 h-6 bg-[#3E60C1]/20 rounded-full flex items-center justify-center text-[#5983FC] mr-2">
                      {num}
                    </div>
                    <input
                      type="text"
                      className="flex-1 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                      placeholder={`Enter something you can ${step % 5 === 0 ? "see" :
                        step % 5 === 1 ? "hear" :
                          step % 5 === 2 ? "smell" :
                            step % 5 === 3 ? "taste" : "feel"
                        }...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'coping':
        return (
          <div className="mt-4">
            <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-3">
              <h4 className="text-white text-sm font-medium mb-3">Emotion Intensity</h4>
              <div className="flex items-center mb-6">
                <span className="text-[#B8C7E0] text-sm mr-3">Low</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[#B8C7E0] text-sm ml-3">High</span>
              </div>

              <h4 className="text-white text-sm font-medium mb-2">Thought Reframing</h4>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">Triggering thought:</label>
                  <textarea
                    className="w-full h-10 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="What thought is causing distress..."
                  />
                </div>
                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">Evidence for this thought:</label>
                  <textarea
                    className="w-full h-10 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="Facts that support this thought..."
                  />
                </div>
                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">Evidence against this thought:</label>
                  <textarea
                    className="w-full h-10 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="Facts that contradict this thought..."
                  />
                </div>
                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">Alternative perspective:</label>
                  <textarea
                    className="w-full h-10 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="A more balanced thought..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'physical':
        return (
          <div className="mt-4">
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold text-white mb-3">
                {formatTime(timeElapsed)} / {formatTime(totalDuration)}
              </div>
              <div className="w-full max-w-[200px] relative mb-4">
                <svg viewBox="0 0 100 220" className="w-full">
                  <rect x="30" y="30" width="40" height="60" rx="20"
                    fill={timeElapsed % 35 < 5 ? "#5983FC33" : "none"}
                    stroke="#5983FC" strokeWidth="0.5"
                  />
                  <rect x="35" y="90" width="30" height="60" rx="5"
                    fill={timeElapsed % 35 >= 5 && timeElapsed % 35 < 15 ? "#5983FC33" : "none"}
                    stroke="#5983FC" strokeWidth="0.5"
                  />
                  <rect x="40" y="150" width="20" height="70" rx="5"
                    fill={timeElapsed % 35 >= 15 && timeElapsed % 35 < 25 ? "#5983FC33" : "none"}
                    stroke="#5983FC" strokeWidth="0.5"
                  />
                  <circle cx="50" cy="15" r="10"
                    fill={timeElapsed % 35 >= 25 ? "#5983FC33" : "none"}
                    stroke="#5983FC" strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="w-full bg-[#0F172A] h-6 rounded-full mb-4 overflow-hidden relative">
                <div
                  className={`h-6 ${timerActive && timeElapsed % 10 < 5
                    ? "bg-amber-500 transition-all duration-500"
                    : "bg-[#5983FC] transition-all duration-500"
                    }`}
                  style={{
                    width: `${(timeElapsed / totalDuration) * 100}%`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                  {timerActive && timeElapsed % 10 < 5
                    ? "TENSE"
                    : "RELEASE"}
                </div>
              </div>

              <div className="text-[#B8C7E0] text-sm mb-3">
                {timerActive && timeElapsed % 35 < 5
                  ? "Focus on your FACE & JAW"
                  : timerActive && timeElapsed % 35 < 15
                    ? "Focus on your SHOULDERS & ARMS"
                    : timerActive && timeElapsed % 35 < 25
                      ? "Focus on your LEGS & FEET"
                      : "Focus on your ABDOMEN & CHEST"}
              </div>

              <div className="flex items-center space-x-4">
                {timerActive ? (
                  <button
                    onClick={pauseTimer}
                    className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                  >
                    <FaPause />
                  </button>
                ) : (
                  <button
                    onClick={startTimer}
                    className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                  >
                    <FaPlay />
                  </button>
                )}

                <button
                  onClick={resetTimer}
                  className="bg-[#0F172A] p-3 rounded-full text-[#B8C7E0] hover:text-white transition-colors"
                >
                  <FaArrowLeft />
                </button>
              </div>
            </div>
          </div>
        );

      case 'relationship':
        return (
          <div className="mt-4">
            <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-3">
              <h4 className="text-white text-sm font-medium mb-3">Perspective Switcher</h4>

              <div className="flex mb-4">
                <button
                  className="flex-1 py-2 rounded-l-lg bg-[#3E60C1] text-white"
                >
                  Your View
                </button>
                <button
                  className="flex-1 py-2 rounded-r-lg bg-[#1A2335] text-[#B8C7E0]"
                >
                  Their View
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">What I want or need:</label>
                  <textarea
                    className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="Describe what you want from this situation or relationship..."
                  />
                </div>

                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">What they might want or need:</label>
                  <textarea
                    className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="Consider what the other person might want..."
                  />
                </div>

                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">Common ground:</label>
                  <textarea
                    className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="What shared interests or values might you have?"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'work':
        return (
          <div className="mt-4">
            <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-4">
              <h4 className="text-white text-sm font-medium mb-3">Current Work Pattern</h4>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">My Official Work Hours:</label>
                  <textarea
                    value={workHours}
                    onChange={(e) => setWorkHours(e.target.value)}
                    className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="E.g., Monday-Friday, 9am-5pm"
                  />
                </div>

                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">When Work Actually Happens:</label>
                  <textarea
                    value={actualHours}
                    onChange={(e) => setActualHours(e.target.value)}
                    className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="E.g., Check emails at 7am, work until 7pm, weekend calls..."
                  />
                </div>
              </div>

              <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-4">
                <h4 className="text-white text-sm font-medium mb-3">Boundary Issues & Solutions</h4>

                <div className="space-y-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="p-3 bg-[#1A2335]/50 rounded-lg border border-[#2A3547]">
                      <h5 className="text-white text-xs font-medium mb-2">Issue #{index + 1}</h5>

                      <div className="mb-3">
                        <label className="text-[#5983FC] text-xs mb-1 block">Specific Boundary Issue:</label>
                        <textarea
                          value={boundaryIssues[index]}
                          onChange={(e) => {
                            const newIssues = [...boundaryIssues];
                            newIssues[index] = e.target.value;
                            setBoundaryIssues(newIssues);
                          }}
                          className="w-full h-12 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                          placeholder="E.g., After-hours work emails, lunch breaks interrupted..."
                        />
                      </div>

                      <div className="mb-3">
                        <label className="text-[#5983FC] text-xs mb-1 block">Boundary Statement:</label>
                        <textarea
                          value={boundaryStatements[index]}
                          onChange={(e) => {
                            const newStatements = [...boundaryStatements];
                            newStatements[index] = e.target.value;
                            setBoundaryStatements(newStatements);
                          }}
                          className="w-full h-12 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                          placeholder="E.g., I will not check email after 7pm..."
                        />
                      </div>

                      <div>
                        <label className="text-[#5983FC] text-xs mb-1 block">Potential Obstacles:</label>
                        <textarea
                          value={obstacles[index]}
                          onChange={(e) => {
                            const newObstacles = [...obstacles];
                            newObstacles[index] = e.target.value;
                            setObstacles(newObstacles);
                          }}
                          className="w-full h-12 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                          placeholder="E.g., Manager expectations, habit of checking phone..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-4">
                <h4 className="text-white text-sm font-medium mb-3">Implementation Plan</h4>

                <p className="text-[#B8C7E0] text-sm mb-3">Select one boundary to implement first:</p>

                <div className="space-y-2 mb-4">
                  {boundaryStatements.map((statement, index) => (
                    statement && (
                      <div
                        key={index}
                        onClick={() => setSelectedBoundary(statement)}
                        className={`p-3 rounded-lg cursor-pointer ${selectedBoundary === statement
                          ? 'bg-[#3E60C1]/20 border-[#5983FC]/50 border'
                          : 'bg-[#1A2335] border border-[#2A3547] hover:border-[#3E60C1]/50'
                          }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${selectedBoundary === statement
                            ? 'border-[#5983FC] bg-[#5983FC]/10 border-2'
                            : 'border border-[#3E60C1]'
                            }`}>
                            {selectedBoundary === statement && (
                              <div className="w-2 h-2 rounded-full bg-[#5983FC]"></div>
                            )}
                          </div>
                          <span className="text-[#B8C7E0] text-sm">{statement}</span>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {selectedBoundary && (
                  <div className="p-3 bg-[#1A2335]/50 rounded-lg">
                    <h5 className="text-white text-xs font-medium mb-2">Next Steps for Implementation</h5>
                    <ol className="list-decimal pl-5 text-[#B8C7E0] text-sm space-y-1">
                      <li>Communicate this boundary to necessary colleagues</li>
                      <li>Modify technology to support this boundary (e.g., turn off notifications)</li>
                      <li>Plan how you'll respond if the boundary is crossed</li>
                      <li>Practice saying "no" or redirecting requests that violate this boundary</li>
                      <li>Schedule a review in 1 week to assess how it's working</li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="bg-[#0F172A]/70 p-3 rounded-lg border border-[#2A3547]">
                <h4 className="text-[#5983FC] text-sm font-medium mb-2 flex items-center">
                  <FaRegLightbulb className="mr-2" /> Tips for Setting Work Boundaries:
                </h4>
                <ul className="space-y-2">
                  <li className="text-[#B8C7E0] text-sm flex items-start">
                    <span className="text-[#5983FC] mr-2">•</span>
                    <span>Start with one small, achievable boundary</span>
                  </li>
                  <li className="text-[#B8C7E0] text-sm flex items-start">
                    <span className="text-[#5983FC] mr-2">•</span>
                    <span>Use clear, direct language when communicating boundaries</span>
                  </li>
                  <li className="text-[#B8C7E0] text-sm flex items-start">
                    <span className="text-[#5983FC] mr-2">•</span>
                    <span>Remember that setting boundaries improves your productivity and wellbeing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'values-clarification':
        return (
          <div className="mt-4">
            <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-3">
              <h4 className="text-white text-sm font-medium mb-3">Values Tracker</h4>

              <div className="space-y-3 mb-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#3E60C1]/20 rounded-full flex items-center justify-center text-[#5983FC]">
                      {num}
                    </div>
                    <input
                      type="text"
                      className="flex-1 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                      placeholder={`Value #${num}...`}
                    />
                    <select
                      className="w-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    >
                      {[1, 2, 3, 4, 5].map((rank) => (
                        <option key={rank} value={rank}>{rank}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <h4 className="text-white text-sm font-medium mb-2">Value Definition</h4>
              <div className="mb-3">
                <textarea
                  className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                  placeholder="Define what your top value means to you personally..."
                />
              </div>

              <h4 className="text-white text-sm font-medium mb-2">Action Plan</h4>
              <div>
                <textarea
                  className="w-full h-16 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                  placeholder="One specific way I'll honor this value this week..."
                />
              </div>
            </div>
          </div>
        );

      case 'appreciation':
        return (
          <div className="mt-4">
            <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-3">
              <h4 className="text-white text-sm font-medium mb-3">Appreciation Exercise</h4>

              <div className="mb-4">
                <label className="text-[#5983FC] text-xs mb-1 block">Who would you like to appreciate?</label>
                <input
                  type="text"
                  className="w-full bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                  placeholder="Name or relationship (e.g., friend, partner, family member, or colleague)"
                />
              </div>

              <div className="space-y-4 mb-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="bg-[#1A2335]/50 p-3 rounded-lg border border-[#2A3547]">
                    <label className="text-[#5983FC] text-xs mb-1 block">Quality/Action #{num} you appreciate:</label>
                    <textarea
                      className="w-full h-12 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC] mb-2"
                      placeholder="Describe a specific quality or action you appreciate..."
                    />
                    <label className="text-[#5983FC] text-xs mb-1 block">Why this matters to you:</label>
                    <textarea
                      className="w-full h-12 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                      placeholder="How has this impacted you or made a difference?"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-[#1A2335]/50 p-3 rounded-lg border border-[#2A3547]">
                <h4 className="text-white text-sm font-medium mb-2">Practice Your Expression</h4>
                <p className="text-[#B8C7E0] text-xs mb-2">Craft a message you could share with this person:</p>
                <textarea
                  className="w-full h-24 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                  placeholder="Dear [name], I want to express my appreciation for..."
                />
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-3 rounded-lg border border-[#2A3547]">
              <h4 className="text-[#5983FC] text-sm font-medium mb-2 flex items-center">
                <FaRegLightbulb className="mr-2" /> Tips for Effective Appreciation:
              </h4>
              <ul className="space-y-2">
                <li className="text-[#B8C7E0] text-sm flex items-start">
                  <span className="text-[#5983FC] mr-2">•</span>
                  <span>Be specific about what they did and its impact</span>
                </li>
                <li className="text-[#B8C7E0] text-sm flex items-start">
                  <span className="text-[#5983FC] mr-2">•</span>
                  <span>Express genuine emotion rather than just saying "thanks"</span>
                </li>
                <li className="text-[#B8C7E0] text-sm flex items-start">
                  <span className="text-[#5983FC] mr-2">•</span>
                  <span>Avoid adding criticism or requests to your appreciation</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'perspective-taking':
        return (
          <div className="mt-4">
            <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-3">
              <h4 className="text-white text-sm font-medium mb-3">Perspective-Taking Practice</h4>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">Describe the situation:</label>
                  <textarea
                    className="w-full h-10 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="Briefly describe the situation or conflict..."
                  />
                </div>

                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">Your perspective:</label>
                  <textarea
                    className="w-full h-10 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="Write down your perspective on the situation..."
                  />
                </div>

                <div>
                  <label className="text-[#5983FC] text-xs mb-1 block">Their perspective:</label>
                  <textarea
                    className="w-full h-10 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                    placeholder="Consider what the other person might think or feel about the situation..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-3 rounded-lg border border-[#2A3547]">
              <h4 className="text-[#5983FC] text-sm font-medium mb-2 flex items-center">
                <FaRegLightbulb className="mr-2" /> Effective Perspective-Taking Tips:
              </h4>
              <ul className="space-y-2">
                <li className="text-[#B8C7E0] text-sm flex items-start">
                  <span className="text-[#5983FC] mr-2">•</span>
                  <span>Be objective and unbiased in your description</span>
                </li>
                <li className="text-[#B8C7E0] text-sm flex items-start">
                  <span className="text-[#5983FC] mr-2">•</span>
                  <span>Consider both sides of the situation</span>
                </li>
                <li className="text-[#B8C7E0] text-sm flex items-start">
                  <span className="text-[#5983FC] mr-2">•</span>
                  <span>Try to understand their feelings and thoughts</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'task':
        return (
          <div className="space-y-6">
            {/* Matrix explanation */}
            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547] mb-4">
              <h4 className="text-white font-medium mb-2">The Eisenhower Matrix</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-emerald-500/20 p-3 rounded-lg">
                  <span className="text-emerald-400 font-medium">Urgent & Important</span>
                  <p className="text-[#B8C7E0] text-xs mt-1">Do these tasks immediately</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <span className="text-blue-400 font-medium">Important, Not Urgent</span>
                  <p className="text-[#B8C7E0] text-xs mt-1">Schedule these tasks</p>
                </div>
                <div className="bg-amber-500/20 p-3 rounded-lg">
                  <span className="text-amber-400 font-medium">Urgent, Not Important</span>
                  <p className="text-[#B8C7E0] text-xs mt-1">Delegate if possible</p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-lg">
                  <span className="text-red-400 font-medium">Neither</span>
                  <p className="text-[#B8C7E0] text-xs mt-1">Eliminate or postpone</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter a task..."
                  className="w-full bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                />
                <div className="flex gap-2">
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="flex-1 bg-[#1A2335] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] text-sm focus:outline-none focus:border-[#5983FC]"
                  >
                    <option value="">Select Priority</option>
                    <option value="urgent-important">Urgent & Important</option>
                    <option value="important">Important, Not Urgent</option>
                    <option value="urgent">Urgent, Not Important</option>
                    <option value="neither">Neither</option>
                  </select>
                  <button
                    onClick={() => {
                      if (newTask && taskCategory) {
                        setTasks([...tasks, { text: newTask, category: taskCategory, id: Date.now() }]);
                        setNewTask('');
                        setTaskCategory('');
                      }
                    }}
                    className="px-4 py-2 bg-[#5983FC] text-white rounded-lg hover:bg-[#3E60C1] transition-colors whitespace-nowrap"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <h5 className="text-emerald-400 font-medium mb-3">Urgent & Important</h5>
                <div className="space-y-2">
                  {tasks
                    .filter(task => task.category === 'urgent-important')
                    .map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onDelete={() => setTasks(tasks.filter(t => t.id !== task.id))}
                        onEdit={() => setEditingTask(task)}
                        color="emerald"
                      />
                    ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h5 className="text-blue-400 font-medium mb-3">Important, Not Urgent</h5>
                <div className="space-y-2">
                  {tasks
                    .filter(task => task.category === 'important')
                    .map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onDelete={() => setTasks(tasks.filter(t => t.id !== task.id))}
                        onEdit={() => setEditingTask(task)}
                        color="blue"
                      />
                    ))}
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <h5 className="text-amber-400 font-medium mb-3">Urgent, Not Important</h5>
                <div className="space-y-2">
                  {tasks
                    .filter(task => task.category === 'urgent')
                    .map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onDelete={() => setTasks(tasks.filter(t => t.id !== task.id))}
                        onEdit={() => setEditingTask(task)}
                        color="amber"
                      />
                    ))}
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h5 className="text-red-400 font-medium mb-3">Neither</h5>
                <div className="space-y-2">
                  {tasks
                    .filter(task => task.category === 'neither')
                    .map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onDelete={() => setTasks(tasks.filter(t => t.id !== task.id))}
                        onEdit={() => setEditingTask(task)}
                        color="red"
                      />
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h4 className="text-white font-medium mb-2">Action Plan</h4>
              <div className="space-y-2 text-sm text-[#B8C7E0]">
                <p>• Focus first on {tasks.filter(t => t.category === 'urgent-important').length} urgent and important tasks</p>
                <p>• Schedule {tasks.filter(t => t.category === 'important').length} important but not urgent tasks</p>
                <p>• Consider delegating {tasks.filter(t => t.category === 'urgent').length} urgent but not important tasks</p>
                <p>• Review and possibly eliminate {tasks.filter(t => t.category === 'neither').length} tasks that are neither urgent nor important</p>
              </div>
            </div>
          </div>
        );


      case 'body-appreciation':
        return (
          <div className="space-y-4">
            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Take a Moment</h3>
              <p className="text-[#B8C7E0] text-sm mb-3">
                Begin with three deep breaths to center yourself.
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setBreathCount(prev => Math.min(prev + 1, 3))}
                  className="px-4 py-2 bg-[#3E60C1] hover:bg-[#5983FC] rounded-lg text-white transition-colors"
                >
                  Breathe {breathCount}/3
                </button>
                {breathCount >= 3 && (
                  <span className="text-emerald-400">✓ Ready</span>
                )}
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h3 className="text-white font-medium mb-3">Body Appreciation</h3>
              <div className="space-y-3">
                {bodyAreas.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${item.checked
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-[#2A3547] bg-[#1E293B]'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white">{item.area}</label>
                      <button
                        onClick={() => {
                          const newAreas = [...bodyAreas];
                          newAreas[index].checked = !newAreas[index].checked;
                          setBodyAreas(newAreas);
                        }}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${item.checked
                          ? 'bg-emerald-500 text-white'
                          : 'border border-[#3E60C1]'
                          }`}
                      >
                        {item.checked && "✓"}
                      </button>
                    </div>
                    {item.checked && (
                      <textarea
                        value={item.gratitude}
                        onChange={(e) => {
                          const newAreas = [...bodyAreas];
                          newAreas[index].gratitude = e.target.value;
                          setBodyAreas(newAreas);
                        }}
                        placeholder={`What do you appreciate about your ${item.area.toLowerCase()}?`}
                        className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded p-2 text-white focus:outline-none focus:border-[#5983FC] text-sm"
                        rows="2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Daily Intention</h3>
              <textarea
                value={selfCareIntention}
                onChange={(e) => setSelfCareIntention(e.target.value)}
                placeholder="Today, I will honor my body by..."
                className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#5983FC]"
                rows="2"
              />
            </div>
          </div>
        );

      case 'work-boundaries':
        return (
          <div className="space-y-6">
            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Work Boundaries</h3>
                <button
                  onClick={() => setBoundaries([...boundaries, { hours: '', issues: '', statement: '', obstacles: '', steps: '' }])}
                  className="p-2 bg-[#1E293B] hover:bg-[#2A3547] rounded-lg text-emerald-400"
                >
                  <FaPlus />
                </button>
              </div>

              {boundaries.map((boundary, index) => (
                <div key={index} className="mb-4 p-4 border border-[#2A3547] rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[#B8C7E0] text-sm block mb-2">Current Work Hours</label>
                      <textarea
                        value={boundary.hours}
                        onChange={(e) => {
                          const newBoundaries = [...boundaries];
                          newBoundaries[index].hours = e.target.value;
                          setBoundaries(newBoundaries);
                        }}
                        className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-2 text-white"
                        placeholder="Describe your current work schedule..."
                      />
                    </div>
                    <div>
                      <label className="text-[#B8C7E0] text-sm block mb-2">Boundary Issues</label>
                      <textarea
                        value={boundary.issues}
                        onChange={(e) => {
                          const newBoundaries = [...boundaries];
                          newBoundaries[index].issues = e.target.value;
                          setBoundaries(newBoundaries);
                        }}
                        className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-2 text-white"
                        placeholder="What boundary issues are you facing?"
                      />
                    </div>
                    <div>
                      <label className="text-[#B8C7E0] text-sm block mb-2">Boundary Statement</label>
                      <textarea
                        value={boundary.statement}
                        onChange={(e) => {
                          const newBoundaries = [...boundaries];
                          newBoundaries[index].statement = e.target.value;
                          setBoundaries(newBoundaries);
                        }}
                        className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-2 text-white"
                        placeholder="Write your boundary statement..."
                      />
                    </div>
                    <div>
                      <label className="text-[#B8C7E0] text-sm block mb-2">Implementation Steps</label>
                      <textarea
                        value={boundary.steps}
                        onChange={(e) => {
                          const newBoundaries = [...boundaries];
                          newBoundaries[index].steps = e.target.value;
                          setBoundaries(newBoundaries);
                        }}
                        className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-2 text-white"
                        placeholder="How will you implement this boundary?"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'task-prioritization':
        return (
          <div className="space-y-6">
            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <div className="mb-4">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    placeholder="Enter a task..."
                    className="flex-1 bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-2 text-white"
                  />
                  <button
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-[#5983FC] text-white rounded-lg hover:bg-[#3E60C1] transition-colors"
                  >
                    Add Task
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onDelete={() => handleDeleteTask(task.id)}
                      color="blue"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'work-values':
        return (
          <div className="space-y-6">
            <div className="bg-[#0F172A]/70 p-4 rounded-xl border border-[#2A3547]">
              <h3 className="text-white font-medium mb-4">Core Work Values</h3>

              {workValues.map((item, index) => (
                <div key={index} className="mb-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => {
                        const newValues = [...workValues];
                        newValues[index].value = e.target.value;
                        setWorkValues(newValues);
                      }}
                      placeholder={`Work Value ${index + 1}`}
                      className="flex-1 bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-2 text-white focus:outline-none focus:border-[#5983FC]"
                    />
                    {workValues.length > 1 && (
                      <button
                        onClick={() => {
                          setWorkValues(workValues.filter((_, i) => i !== index));
                        }}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[#B8C7E0] text-sm">
                      Alignment with current role (1-10):
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={item.rating}
                        onChange={(e) => {
                          const newValues = [...workValues];
                          newValues[index].rating = parseInt(e.target.value);
                          setWorkValues(newValues);
                        }}
                        className="flex-1 h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#5983FC]
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                          [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#5983FC] 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
                          [&::-webkit-slider-thumb]:hover:bg-[#3E60C1] [&::-webkit-slider-thumb]:hover:scale-110
                          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 
                          [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#5983FC] 
                          [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full 
                          [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-all 
                          [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:hover:bg-[#3E60C1]
                          [&::-moz-range-thumb]:hover:scale-110"
                      />
                      <div className="bg-[#1E293B] px-3 py-1 rounded-lg border border-[#3E60C1]/30 min-w-[60px] text-center">
                        <span className="text-[#5983FC] font-medium">{item.rating}</span>
                        <span className="text-[#B8C7E0] text-sm">/10</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#B8C7E0] text-sm mb-1">
                        How does your work currently honor this value?
                      </label>
                      <textarea
                        value={item.alignment}
                        onChange={(e) => {
                          const newValues = [...workValues];
                          newValues[index].alignment = e.target.value;
                          setWorkValues(newValues);
                        }}
                        placeholder="Describe how your work aligns with this value..."
                        className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-2 text-white focus:outline-none focus:border-[#5983FC] min-h-[60px]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {workValues.length < 5 && (
                <button
                  onClick={() => setWorkValues([...workValues, { value: '', rating: 5, alignment: '' }])}
                  className="text-[#5983FC] hover:text-[#3E60C1] text-sm flex items-center gap-1"
                >
                  <FaPlus /> Add another value
                </button>
              )}
            </div>

            <div className="bg-[#0F172A]/70 p-4 rounded-xl border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Bringing More Meaning</h3>
              <textarea
                value={meaningfulTask}
                onChange={(e) => setMeaningfulTask(e.target.value)}
                placeholder="Describe one way you could bring more meaning to your daily tasks..."
                className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#5983FC] min-h-[80px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-4 rounded-xl border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Personal Work Mission Statement</h3>
              <textarea
                value={missionStatement}
                onChange={(e) => setMissionStatement(e.target.value)}
                placeholder="Create a brief mission statement that captures your work purpose..."
                className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            {workValues.some(v => v.value) && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
                <p className="text-emerald-400 text-sm">
                  {workValues.filter(v => v.value && v.alignment).length === workValues.length && meaningfulTask && missionStatement
                    ? "Great job completing your work values reflection! Consider reviewing these periodically to stay aligned with your purpose."
                    : "Keep going! Reflecting on your work values helps create more meaning in your daily tasks."}
                </p>
              </div>
            )}
          </div>
        );

      case 'health-worry':
        return (
          <div className="space-y-4">
            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Health Concern</h3>
              <textarea
                value={healthWorry}
                onChange={(e) => setHealthWorry(e.target.value)}
                placeholder="Describe your specific health concern in detail..."
                className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#5983FC]"
                rows="3"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Worry Level (1-10)</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={worryLevel}
                  onChange={(e) => setWorryLevel(e.target.value)}
                  className="flex-1 h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white font-medium w-8">{worryLevel}</span>
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Evidence Supporting This Worry</h3>
              <div className="space-y-2">
                {supportingEvidence.map((evidence, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={evidence}
                      onChange={(e) => {
                        const newEvidence = [...supportingEvidence];
                        newEvidence[index] = e.target.value;
                        setSupportingEvidence(newEvidence);
                      }}
                      placeholder="Enter evidence..."
                      className="flex-1 bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#5983FC]"
                    />
                    <button
                      onClick={() => {
                        const newEvidence = supportingEvidence.filter((_, i) => i !== index);
                        setSupportingEvidence(newEvidence);
                      }}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                {supportingEvidence.length < 5 && (
                  <button
                    onClick={() => setSupportingEvidence([...supportingEvidence, ''])}
                    className="text-[#5983FC] hover:text-[#3E60C1] text-sm flex items-center"
                  >
                    <FaPlus className="mr-1" /> Add Evidence
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Evidence That Contradicts This Worry</h3>
              <div className="space-y-2">
                {contradictingEvidence.map((evidence, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={evidence}
                      onChange={(e) => {
                        const newEvidence = [...contradictingEvidence];
                        newEvidence[index] = e.target.value;
                        setContradictingEvidence(newEvidence);
                      }}
                      placeholder="Enter contradicting evidence..."
                      className="flex-1 bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#5983FC]"
                    />
                    <button
                      onClick={() => {
                        const newEvidence = contradictingEvidence.filter((_, i) => i !== index);
                        setContradictingEvidence(newEvidence);
                      }}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                {contradictingEvidence.length < 5 && (
                  <button
                    onClick={() => setContradictingEvidence([...contradictingEvidence, ''])}
                    className="text-[#5983FC] hover:text-[#3E60C1] text-sm flex items-center"
                  >
                    <FaPlus className="mr-1" /> Add Evidence
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Control Assessment</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[#B8C7E0] text-sm block mb-2">
                    What percentage of this worry is within your control?
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={controlPercentage}
                      onChange={(e) => setControlPercentage(e.target.value)}
                      className="flex-1 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-white font-medium w-12">{controlPercentage}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-[#B8C7E0] text-sm block mb-2">
                    Action step for the controllable aspect:
                  </label>
                  <textarea
                    value={actionStep}
                    onChange={(e) => setActionStep(e.target.value)}
                    placeholder="What specific action can you take to address the controllable part of this worry?"
                    className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#5983FC]"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            {(healthWorry || supportingEvidence.some(e => e) || contradictingEvidence.some(e => e)) && (
              <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
                <h3 className="text-white font-medium mb-3">Reflection Summary</h3>
                <div className="space-y-2 text-sm text-[#B8C7E0]">
                  <p>• Your worry level is {worryLevel}/10</p>
                  <p>• You identified {supportingEvidence.filter(e => e).length} supporting factors and {contradictingEvidence.filter(e => e).length} contradicting factors</p>
                  <p>• {controlPercentage}% of this concern appears to be within your control</p>
                  {actionStep && <p>• You have a specific action plan to address the controllable aspects</p>}
                </div>
              </div>
            )}
          </div>
        );

      case 'body-scan':
        return (
          <div className="space-y-4">
            <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
              <h3 className="text-white font-medium mb-2">Mindful Body Scan</h3>
              <p className="text-[#B8C7E0] text-sm mb-4">
                Take a moment to systematically bring awareness to each part of your body. Notice sensations without judgment.
              </p>
              {!isScanning && (
                <button
                  onClick={() => {
                    setIsScanning(true);
                    setCurrentBodyPart(0);
                    setBodyScanNotes({});
                  }}
                  className="w-full py-2 bg-[#3E60C1] text-white rounded-lg hover:bg-[#3E60C1]/90 transition-colors"
                >
                  Begin Body Scan
                </button>
              )}
            </div>

            {isScanning && (
              <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-medium">Current Focus</h3>
                  <span className="text-[#B8C7E0] text-sm">
                    {currentBodyPart + 1} of {bodyParts.length}
                  </span>
                </div>

                <div className="relative h-2 bg-[#1E293B] rounded-full mb-4">
                  <div
                    className="absolute h-full bg-[#3E60C1] rounded-full transition-all duration-500"
                    style={{ width: `${((currentBodyPart + 1) / bodyParts.length) * 100}%` }}
                  />
                </div>

                <div className="text-center mb-6">
                  <h4 className="text-xl font-medium text-white mb-2">
                    {bodyParts[currentBodyPart].name}
                  </h4>
                  <p className="text-[#B8C7E0] text-sm">
                    {bodyParts[currentBodyPart].prompt}
                  </p>
                </div>

                <div className="mb-4">
                  <textarea
                    value={bodyScanNotes[currentBodyPart] || ''}
                    onChange={(e) => {
                      setBodyScanNotes(prev => ({
                        ...prev,
                        [currentBodyPart]: e.target.value
                      }));
                    }}
                    placeholder="Note any sensations, tension, or observations..."
                    className="w-full bg-[#1E293B] border border-[#3E60C1]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#5983FC]"
                    rows="3"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      if (currentBodyPart > 0) {
                        setCurrentBodyPart(prev => prev - 1);
                      } else {
                        setIsScanning(false);
                      }
                    }}
                    className="px-4 py-2 text-[#B8C7E0] hover:text-white transition-colors"
                  >
                    {currentBodyPart === 0 ? 'End Scan' : 'Previous'}
                  </button>
                  <button
                    onClick={() => {
                      if (currentBodyPart < bodyParts.length - 1) {
                        setCurrentBodyPart(prev => prev + 1);
                      } else {
                        setIsScanning(false);
                      }
                    }}
                    className="px-4 py-2 bg-[#3E60C1] text-white rounded-lg hover:bg-[#3E60C1]/90 transition-colors"
                  >
                    {currentBodyPart === bodyParts.length - 1 ? 'Complete' : 'Next'}
                  </button>
                </div>
              </div>
            )}

            {!isScanning && Object.keys(bodyScanNotes).length > 0 && (
              <div className="bg-[#0F172A]/70 p-4 rounded-lg border border-[#2A3547]">
                <h3 className="text-white font-medium mb-3">Body Scan Summary</h3>
                <div className="space-y-3">
                  {Object.entries(bodyScanNotes).map(([index, note]) => (
                    <div key={index} className="bg-[#1E293B] p-3 rounded-lg">
                      <h4 className="text-white font-medium mb-1">
                        {bodyParts[parseInt(index)].name}
                      </h4>
                      <p className="text-[#B8C7E0] text-sm">{note}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setCurrentBodyPart(0);
                    setBodyScanNotes({});
                    setIsScanning(true);
                  }}
                  className="mt-4 w-full py-2 bg-[#3E60C1] text-white rounded-lg hover:bg-[#3E60C1]/90 transition-colors"
                >
                  Start New Scan
                </button>
              </div>
            )}
          </div>
        );

      case 'anxious-thought':
        return (
          <div className="space-y-6">
            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Anxious Thought Reframing</h4>
              <p className="text-[#B8C7E0]">
                This exercise helps you challenge anxious thoughts by examining evidence and creating more balanced perspectives.
              </p>
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Step 1: Identify Your Anxious Thought</h4>
              <textarea
                value={anxiousThought}
                onChange={(e) => setAnxiousThought(e.target.value)}
                placeholder="Write down the anxious thought that's bothering you..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px] mb-4"
              />
              <div className="space-y-2">
                <label className="text-[#B8C7E0] text-sm">How much do you believe this thought?</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={thoughtBelief}
                    onChange={(e) => setThoughtBelief(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#2A3547] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[#B8C7E0] min-w-[3rem] text-right">{thoughtBelief}%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Step 2: Examine the Evidence</h4>

              <div className="mb-4">
                <label className="text-[#B8C7E0] text-sm block mb-2">Evidence Supporting This Thought</label>
                {supportingEvidence.map((evidence, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={evidence}
                      onChange={(e) => {
                        const newEvidence = [...supportingEvidence];
                        newEvidence[index] = e.target.value;
                        setSupportingEvidence(newEvidence);
                      }}
                      placeholder="Add evidence that supports this thought..."
                      className="flex-1 bg-[#0F172A] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
                    />
                    <button
                      onClick={() => {
                        setSupportingEvidence(supportingEvidence.filter((_, i) => i !== index));
                      }}
                      className="text-[#B8C7E0] hover:text-white transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setSupportingEvidence([...supportingEvidence, ''])}
                  className="text-[#5983FC] hover:text-[#3E60C1] text-sm flex items-center mt-2"
                >
                  <FaPlus className="mr-1" /> Add Evidence
                </button>
              </div>

              <div>
                <label className="text-[#B8C7E0] text-sm block mb-2">Evidence That Contradicts This Thought</label>
                {contradictingEvidence.map((evidence, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={evidence}
                      onChange={(e) => {
                        const newEvidence = [...contradictingEvidence];
                        newEvidence[index] = e.target.value;
                        setContradictingEvidence(newEvidence);
                      }}
                      placeholder="Add evidence that contradicts this thought..."
                      className="flex-1 bg-[#0F172A] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
                    />
                    <button
                      onClick={() => {
                        setContradictingEvidence(contradictingEvidence.filter((_, i) => i !== index));
                      }}
                      className="text-[#B8C7E0] hover:text-white transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setContradictingEvidence([...contradictingEvidence, ''])}
                  className="text-[#5983FC] hover:text-[#3E60C1] text-sm flex items-center mt-2"
                >
                  <FaPlus className="mr-1" /> Add Evidence
                </button>
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Step 3: Create a Balanced Thought</h4>
              <textarea
                value={balancedThought}
                onChange={(e) => setBalancedThought(e.target.value)}
                placeholder="Based on the evidence, write a more balanced thought..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px] mb-4"
              />
              <div className="space-y-2">
                <label className="text-[#B8C7E0] text-sm">How much do you believe this balanced thought?</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newBelief}
                    onChange={(e) => setNewBelief(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#2A3547] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[#B8C7E0] min-w-[3rem] text-right">{newBelief}%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Summary</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[#B8C7E0] text-sm block mb-1">Original Thought</label>
                  <p className="text-white">{anxiousThought || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-[#B8C7E0] text-sm block mb-1">Supporting Evidence</label>
                  <ul className="list-disc list-inside text-white">
                    {supportingEvidence.map((evidence, index) => (
                      evidence && <li key={index}>{evidence}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="text-[#B8C7E0] text-sm block mb-1">Contradicting Evidence</label>
                  <ul className="list-disc list-inside text-white">
                    {contradictingEvidence.map((evidence, index) => (
                      evidence && <li key={index}>{evidence}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="text-[#B8C7E0] text-sm block mb-1">Balanced Thought</label>
                  <p className="text-white">{balancedThought || 'Not specified'}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#B8C7E0]">Original Belief: {thoughtBelief}%</span>
                  <span className="text-[#B8C7E0]">New Belief: {newBelief}%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'loss-processing':
        return (
          <div className="mt-4 space-y-6">
            <div className="space-y-3">
              <h4 className="text-white text-sm font-medium">Describe Your Loss</h4>
              <textarea
                value={lossDescription}
                onChange={(e) => setLossDescription(e.target.value)}
                placeholder="Take a moment to write about the loss you're experiencing..."
                className="w-full h-32 bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-white text-sm font-medium">Tangible Losses</h4>
                {tangibleLosses.map((loss, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={loss}
                      onChange={(e) => {
                        const newLosses = [...tangibleLosses];
                        newLosses[index] = e.target.value;
                        setTangibleLosses(newLosses);
                      }}
                      placeholder="e.g., Physical items, opportunities..."
                      className="flex-1 bg-[#0F172A] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
                    />
                    <button
                      onClick={() => {
                        if (tangibleLosses.length === 1) {
                          setTangibleLosses(['']);
                        } else {
                          setTangibleLosses(tangibleLosses.filter((_, i) => i !== index));
                        }
                      }}
                      className="p-2 text-[#B8C7E0] hover:text-white"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setTangibleLosses([...tangibleLosses, ''])}
                  className="text-[#5983FC] hover:text-[#3E60C1] text-sm flex items-center"
                >
                  <FaPlus className="mr-1" /> Add another
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-white text-sm font-medium">Intangible Losses</h4>
                {intangibleLosses.map((loss, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={loss}
                      onChange={(e) => {
                        const newLosses = [...intangibleLosses];
                        newLosses[index] = e.target.value;
                        setIntangibleLosses(newLosses);
                      }}
                      placeholder="e.g., Feelings, connections..."
                      className="flex-1 bg-[#0F172A] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
                    />
                    <button
                      onClick={() => {
                        if (intangibleLosses.length === 1) {
                          setIntangibleLosses(['']);
                        } else {
                          setIntangibleLosses(intangibleLosses.filter((_, i) => i !== index));
                        }
                      }}
                      className="p-2 text-[#B8C7E0] hover:text-white"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setIntangibleLosses([...intangibleLosses, ''])}
                  className="text-[#5983FC] hover:text-[#3E60C1] text-sm flex items-center"
                >
                  <FaPlus className="mr-1" /> Add another
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white text-sm font-medium">What You Miss Most</h4>
              <textarea
                value={missedMost}
                onChange={(e) => setMissedMost(e.target.value)}
                placeholder="Describe what you miss most and why..."
                className="w-full h-24 bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-white text-sm font-medium">What Remains</h4>
              {remainingStrengths.map((strength, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={strength}
                    onChange={(e) => {
                      const newStrengths = [...remainingStrengths];
                      newStrengths[index] = e.target.value;
                      setRemainingStrengths(newStrengths);
                    }}
                    placeholder="List strengths, resources, or support that remains..."
                    className="flex-1 bg-[#0F172A] border border-[#2A3547] rounded-lg p-2 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
                  />
                  <button
                    onClick={() => {
                      if (remainingStrengths.length === 1) {
                        setRemainingStrengths(['']);
                      } else {
                        setRemainingStrengths(remainingStrengths.filter((_, i) => i !== index));
                      }
                    }}
                    className="p-2 text-[#B8C7E0] hover:text-white"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setRemainingStrengths([...remainingStrengths, ''])}
                className="text-[#5983FC] hover:text-[#3E60C1] text-sm flex items-center"
              >
                <FaPlus className="mr-1" /> Add another
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-white text-sm font-medium">Moving Forward</h4>
              <textarea
                value={adaptationStep}
                onChange={(e) => setAdaptationStep(e.target.value)}
                placeholder="Write one small step you can take toward adaptation..."
                className="w-full h-24 bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC]"
              />
            </div>
          </div>
        );

      case 'meaning-making':
        return (
          <div className="space-y-6">
            <div className="bg-[#1E293B] rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">Perspective Changes</h3>
              <p className="text-[#94A3B8] text-sm mb-4">
                How has this experience changed your view of life or yourself?
              </p>
              <textarea
                value={perspectiveChange}
                onChange={(e) => setPerspectiveChange(e.target.value)}
                placeholder="Consider how this experience has shifted your understanding or viewpoint..."
                className="w-full bg-[#0F172A] text-white rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-[#3E60C1] focus:outline-none"
              />
            </div>

            <div className="bg-[#1E293B] rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">Values & Priorities</h3>
              <p className="text-[#94A3B8] text-sm mb-4">
                What values or priorities have shifted through this experience?
              </p>
              <div className="space-y-3">
                {valueShifts.map((shift, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shift}
                      onChange={(e) => {
                        const newShifts = [...valueShifts];
                        newShifts[index] = e.target.value;
                        setValueShifts(newShifts);
                      }}
                      placeholder="Enter a value or priority shift..."
                      className="flex-1 bg-[#0F172A] text-white rounded-lg p-3 focus:ring-2 focus:ring-[#3E60C1] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const newShifts = valueShifts.filter((_, i) => i !== index);
                        setValueShifts(newShifts);
                      }}
                      className="p-2 text-[#94A3B8] hover:text-white transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setValueShifts([...valueShifts, ''])}
                  className="text-[#3E60C1] hover:text-[#5983FC] transition-colors text-sm flex items-center gap-2"
                >
                  <FaPlus /> Add another value shift
                </button>
              </div>
            </div>

            <div className="bg-[#1E293B] rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">Growth & Strengths</h3>
              <p className="text-[#94A3B8] text-sm mb-4">
                What new strengths or capabilities have you discovered?
              </p>
              <div className="space-y-3">
                {discoveredStrengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={strength}
                      onChange={(e) => {
                        const newStrengths = [...discoveredStrengths];
                        newStrengths[index] = e.target.value;
                        setDiscoveredStrengths(newStrengths);
                      }}
                      placeholder="Enter a discovered strength..."
                      className="flex-1 bg-[#0F172A] text-white rounded-lg p-3 focus:ring-2 focus:ring-[#3E60C1] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const newStrengths = discoveredStrengths.filter((_, i) => i !== index);
                        setDiscoveredStrengths(newStrengths);
                      }}
                      className="p-2 text-[#94A3B8] hover:text-white transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setDiscoveredStrengths([...discoveredStrengths, ''])}
                  className="text-[#3E60C1] hover:text-[#5983FC] transition-colors text-sm flex items-center gap-2"
                >
                  <FaPlus /> Add another strength
                </button>
              </div>
            </div>

            <div className="bg-[#1E293B] rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">Connection & Meaning</h3>
              <p className="text-[#94A3B8] text-sm mb-4">
                How does this experience connect you to others or contribute to your life's meaning?
              </p>
              <textarea
                value={meaningConnection}
                onChange={(e) => setMeaningConnection(e.target.value)}
                placeholder="Reflect on how this experience connects to your broader life story..."
                className="w-full bg-[#0F172A] text-white rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-[#3E60C1] focus:outline-none"
              />
            </div>

            <div className="bg-[#1E293B] rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">Future Impact</h3>
              <p className="text-[#94A3B8] text-sm mb-4">
                How might this experience influence your future choices and path?
              </p>
              <textarea
                value={futureImpact}
                onChange={(e) => setFutureImpact(e.target.value)}
                placeholder="Consider how this experience might shape your future decisions..."
                className="w-full bg-[#0F172A] text-white rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-[#3E60C1] focus:outline-none"
              />
            </div>

            <div className="bg-[#1E293B] rounded-xl p-6 space-y-4">
              <h3 className="text-white font-medium">Meaning Statement</h3>
              <p className="text-[#94A3B8] text-sm mb-4">
                Write a brief statement that captures the meaning you've found in this experience.
              </p>
              <textarea
                value={meaningStatement}
                onChange={(e) => setMeaningStatement(e.target.value)}
                placeholder="This experience has taught me that..."
                className="w-full bg-[#0F172A] text-white rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-[#3E60C1] focus:outline-none"
              />
            </div>
          </div>
        );
      case 'continuing-bonds':
        return (
          <div className="space-y-6">
            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Continuing Bonds Reflection</h4>
              <p className="text-[#B8C7E0]">
                This practice helps you maintain a healthy connection with what you've lost while allowing for adaptation and growth.
              </p>
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">1. Quality Reflection</h4>
              <p className="text-[#B8C7E0] mb-4">
                What positive qualities or aspects of what you've lost do you most value and remember?
              </p>
              <textarea
                value={bondQuality}
                onChange={(e) => setBondQuality(e.target.value)}
                placeholder="Reflect on the meaningful qualities..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">2. Memory Connection</h4>
              <p className="text-[#B8C7E0] mb-4">
                What specific memories or moments best capture these qualities?
              </p>
              <textarea
                value={bondMemories}
                onChange={(e) => setBondMemories(e.target.value)}
                placeholder="Share meaningful memories..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">3. Continuing Presence</h4>
              <p className="text-[#B8C7E0] mb-4">
                How do these qualities continue to be present in your life now?
              </p>
              <textarea
                value={continuingAspects}
                onChange={(e) => setContinuingAspects(e.target.value)}
                placeholder="Reflect on how these qualities live on..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">4. Ritual Creation</h4>
              <p className="text-[#B8C7E0] mb-4">
                What small ritual could you create to honor this continuing connection?
              </p>
              <textarea
                value={ritualDescription}
                onChange={(e) => setRitualDescription(e.target.value)}
                placeholder="Describe a meaningful ritual..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">5. Identity Integration</h4>
              <p className="text-[#B8C7E0] mb-4">
                How might you incorporate these valued aspects into your own identity or life?
              </p>
              <textarea
                value={identityIntegration}
                onChange={(e) => setIdentityIntegration(e.target.value)}
                placeholder="Reflect on integration possibilities..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">6. Ongoing Message</h4>
              <p className="text-[#B8C7E0] mb-4">
                Write a brief message expressing your ongoing relationship and connection.
              </p>
              <textarea
                value={ongoingMessage}
                onChange={(e) => setOngoingMessage(e.target.value)}
                placeholder="Write your message of connection..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Your Reflection Summary</h4>
              <div className="space-y-3">
                {bondQuality && (
                  <div>
                    <p className="text-[#B8C7E0] text-sm font-medium">Valued Qualities:</p>
                    <p className="text-[#B8C7E0] text-sm">{bondQuality}</p>
                  </div>
                )}
                {bondMemories && (
                  <div>
                    <p className="text-[#B8C7E0] text-sm font-medium">Meaningful Memories:</p>
                    <p className="text-[#B8C7E0] text-sm">{bondMemories}</p>
                  </div>
                )}
                {continuingAspects && (
                  <div>
                    <p className="text-[#B8C7E0] text-sm font-medium">Continuing Presence:</p>
                    <p className="text-[#B8C7E0] text-sm">{continuingAspects}</p>
                  </div>
                )}
                {ritualDescription && (
                  <div>
                    <p className="text-[#B8C7E0] text-sm font-medium">Honoring Ritual:</p>
                    <p className="text-[#B8C7E0] text-sm">{ritualDescription}</p>
                  </div>
                )}
                {identityIntegration && (
                  <div>
                    <p className="text-[#B8C7E0] text-sm font-medium">Identity Integration:</p>
                    <p className="text-[#B8C7E0] text-sm">{identityIntegration}</p>
                  </div>
                )}
                {ongoingMessage && (
                  <div>
                    <p className="text-[#B8C7E0] text-sm font-medium">Message of Connection:</p>
                    <p className="text-[#B8C7E0] text-sm">{ongoingMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'inner-critic':
        return (
          <div className="space-y-6">
            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Identify Your Inner Critic</h4>
              <p className="text-[#B8C7E0] mb-4">
                What is a common self-critical thought that your inner critic tells you?
              </p>
              <textarea
                value={innerCriticThought}
                onChange={(e) => setInnerCriticThought(e.target.value)}
                placeholder="Write down the exact words your inner critic uses..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Impact Assessment</h4>
              <p className="text-[#B8C7E0] mb-4">
                How does this criticism affect your feelings and behaviors?
              </p>
              <textarea
                value={criticImpact}
                onChange={(e) => setCriticImpact(e.target.value)}
                placeholder="Describe the emotional and behavioral impact..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Mentor's Response</h4>
              <p className="text-[#B8C7E0] mb-4">
                Imagine a compassionate mentor responding to your inner critic. What would they say?
              </p>
              <textarea
                value={mentorResponse}
                onChange={(e) => setMentorResponse(e.target.value)}
                placeholder="Write down what a supportive mentor might say..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Balanced Response</h4>
              <p className="text-[#B8C7E0] mb-4">
                Create a balanced response that acknowledges challenges while being supportive.
              </p>
              <textarea
                value={balancedResponse}
                onChange={(e) => setBalancedResponse(e.target.value)}
                placeholder="Write a balanced response that combines understanding with encouragement..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Practice Plan</h4>
              <p className="text-[#B8C7E0] mb-4">
                How will you practice responding to your inner critic with this new balanced voice?
              </p>
              <textarea
                value={practicePlan}
                onChange={(e) => setPracticePlan(e.target.value)}
                placeholder="Create a specific plan for practicing your new response..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
              />
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Exercise Summary</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[#B8C7E0] font-medium mb-2">Your Inner Critic:</p>
                  <p className="text-white">{innerCriticThought || 'Not yet specified'}</p>
                </div>
                <div>
                  <p className="text-[#B8C7E0] font-medium mb-2">Impact:</p>
                  <p className="text-white">{criticImpact || 'Not yet specified'}</p>
                </div>
                <div>
                  <p className="text-[#B8C7E0] font-medium mb-2">Mentor's Response:</p>
                  <p className="text-white">{mentorResponse || 'Not yet specified'}</p>
                </div>
                <div>
                  <p className="text-[#B8C7E0] font-medium mb-2">Balanced Response:</p>
                  <p className="text-white">{balancedResponse || 'Not yet specified'}</p>
                </div>
                <div>
                  <p className="text-[#B8C7E0] font-medium mb-2">Practice Plan:</p>
                  <p className="text-white">{practicePlan || 'Not yet specified'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'uncertainty-tolerance':
        return (
          <div className="space-y-6">
            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Uncertainty Tolerance Practice</h4>
              <p className="text-[#B8C7E0]">
                This exercise helps you build comfort with uncertainty through mindful awareness and practical steps.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">1. Identify Your Situation</h4>
                <textarea
                  value={uncertaintySituation}
                  onChange={(e) => setUncertaintySituation(e.target.value)}
                  placeholder="Describe the situation that involves uncertainty..."
                  className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
                />
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">2. Notice Physical Sensations</h4>
                <textarea
                  value={physicalSensations}
                  onChange={(e) => setPhysicalSensations(e.target.value)}
                  placeholder="What physical sensations arise when you think about this uncertainty? (e.g., tension, butterflies, etc.)"
                  className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
                />
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">3. Observe Your Thoughts</h4>
                <textarea
                  value={thoughts}
                  onChange={(e) => setThoughts(e.target.value)}
                  placeholder="What thoughts come up about this uncertainty? Try to observe them without judgment..."
                  className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
                />
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">4. Identify What's in Your Control</h4>
                <textarea
                  value={controlAspects}
                  onChange={(e) => setControlAspects(e.target.value)}
                  placeholder="What aspects of this situation are still within your control? What can you influence?"
                  className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
                />
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">5. Choose an Action Step</h4>
                <textarea
                  value={actionStep}
                  onChange={(e) => setActionStep(e.target.value)}
                  placeholder="What is one small action you can take within your control to move forward?"
                  className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px]"
                />
              </div>
            </div>

            <div className="bg-[#0F172A]/70 p-5 rounded-xl border border-[#2A3547]">
              <h4 className="text-white font-medium mb-3">Exercise Summary</h4>
              <div className="space-y-3">
                {uncertaintySituation && (
                  <div>
                    <p className="text-[#B8C7E0] font-medium">Your Situation:</p>
                    <p className="text-[#B8C7E0]">{uncertaintySituation}</p>
                  </div>
                )}
                {physicalSensations && (
                  <div>
                    <p className="text-[#B8C7E0] font-medium">Physical Sensations:</p>
                    <p className="text-[#B8C7E0]">{physicalSensations}</p>
                  </div>
                )}
                {thoughts && (
                  <div>
                    <p className="text-[#B8C7E0] font-medium">Your Thoughts:</p>
                    <p className="text-[#B8C7E0]">{thoughts}</p>
                  </div>
                )}
                {controlAspects && (
                  <div>
                    <p className="text-[#B8C7E0] font-medium">What's in Your Control:</p>
                    <p className="text-[#B8C7E0]">{controlAspects}</p>
                  </div>
                )}
                {actionStep && (
                  <div>
                    <p className="text-[#B8C7E0] font-medium">Your Action Step:</p>
                    <p className="text-[#B8C7E0]">{actionStep}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'future-possibilities':
        const updateScenario = (type, newData) => {
          setFuturePossibilitiesData(prev => ({
            ...prev,
            scenarios: {
              ...prev.scenarios,
              [type]: newData
            }
          }));
        };

        const isScenarioComplete = (scenario) => {
          return scenario.description && scenario.coping && scenario.resources;
        };

        const allScenariosComplete = () => {
          return isScenarioComplete(futurePossibilitiesData.scenarios.positive) &&
            isScenarioComplete(futurePossibilitiesData.scenarios.neutral) &&
            isScenarioComplete(futurePossibilitiesData.scenarios.challenging);
        };

        const handleSave = () => {
          const exerciseData = {
            situation: futurePossibilitiesData.situation,
            scenarios: futurePossibilitiesData.scenarios,
            completedAt: new Date().toISOString()
          };

          console.log('Saving exercise data:', exerciseData);

          toast.success('Your visualization exercise has been saved!', {
            position: 'bottom-right',
            theme: 'dark'
          });

          setCompleted(true);
        };

        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h4 className="text-white font-medium mb-2">What situation are you uncertain about?</h4>
              <textarea
                value={futurePossibilitiesData.situation}
                onChange={(e) => setFuturePossibilitiesData(prev => ({ ...prev, situation: e.target.value }))}
                placeholder="Describe the situation you'd like to explore..."
                className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[100px] placeholder-[#4B5563]"
              />
            </div>

            {futurePossibilitiesData.situation && (
              <>
                <ScenarioInput
                  type="positive"
                  scenario={futurePossibilitiesData.scenarios.positive}
                  onUpdate={(newData) => updateScenario('positive', newData)}
                  isCompleted={isScenarioComplete(futurePossibilitiesData.scenarios.positive)}
                />

                <ScenarioInput
                  type="neutral"
                  scenario={futurePossibilitiesData.scenarios.neutral}
                  onUpdate={(newData) => updateScenario('neutral', newData)}
                  isCompleted={isScenarioComplete(futurePossibilitiesData.scenarios.neutral)}
                />

                <ScenarioInput
                  type="challenging"
                  scenario={futurePossibilitiesData.scenarios.challenging}
                  onUpdate={(newData) => updateScenario('challenging', newData)}
                  isCompleted={isScenarioComplete(futurePossibilitiesData.scenarios.challenging)}
                />

                {allScenariosComplete() && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#5983FC] text-white rounded-lg hover:bg-[#3E60C1] transition-colors flex items-center"
                    >
                      <FaSave className="mr-2" /> Save Visualization
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const loadExerciseContent = async () => {
      setIsLoading(true);

      try {
        const exerciseKey = determineExerciseKey();

        setExerciseContent(exerciseContents[exerciseKey] || createDefaultExercise());

        if (exerciseContents[exerciseKey]?.checkItems) {
          const initialChecklist = {};
          exerciseContents[exerciseKey].checkItems.forEach((_, index) => {
            initialChecklist[index] = false;
          });
          setChecklist(initialChecklist);
        }
      } catch (error) {
        console.error("Error loading exercise content:", error);
        setExerciseContent(createDefaultExercise());
      } finally {
        setIsLoading(false);
      }
    };

    loadExerciseContent();
  }, [exercise]);

  const determineExerciseKey = () => {
    if (!exercise) return 'default';

    if (exercise.link && typeof exercise.link === 'string') {

      if (exercise.link === 'task-prioritization' ||
        (exercise.type === 'task') ||
        exercise.title === "Task Prioritization Method") {
        return 'task-prioritization';
      }
      if (exercise.link === 'future-possibilities') {
        return 'future-possibilities';
      }
      if (exercise.link === 'uncertainty-tolerance') {
        return 'uncertainty-tolerance';
      }
      if (exercise.link === 'meaning-making') {
        return 'meaning-making';
      }
      if (exercise.link === 'continuing-bonds') {
        return 'continuing-bonds';
      }
      if (exercise.link === 'anxious-thought') {
        return 'anxious-thought';
      }
      if (exercise.link === 'work-boundaries') {
        return 'work-boundaries';
      }
      if (exerciseContents[exercise.link]) {
        return exercise.link;
      }

      const pathSegments = exercise.link.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (exerciseContents[lastSegment]) {
        return lastSegment;
      }
    }

    const titleLower = exercise.title?.toLowerCase() || '';

    if (titleLower.includes('values clarification')) return 'values-clarification';
    if (titleLower.includes('appreciation expression')) return 'appreciation-expression';
    if (titleLower.includes('perspective-taking')) return 'perspective-taking';
    if (titleLower.includes('self-compass')) return 'self-compassion';
    if (titleLower.includes('strengths inventory')) return 'strengths-inventory';
    if (titleLower.includes('inner critic')) return 'inner-critic';
    if (titleLower.includes('grief') || titleLower.includes('loss')) {
      if (titleLower.includes('journal')) return 'grief-journal';
      if (titleLower.includes('ritual') || titleLower.includes('honor')) return 'memory-honor';
      if (titleLower.includes('letter')) return 'grief-letter';
      return 'grief-processing';
    }
    if (titleLower.includes('anxiety') || titleLower.includes('stress')) {
      if (titleLower.includes('ground') || titleLower.includes('5-4-3-2-1')) return 'grounding';
      if (titleLower.includes('breath')) return 'breathing';
      if (titleLower.includes('worry')) return 'worry-time';
      if (titleLower.includes('muscle') || titleLower.includes('relax')) return 'muscle-relaxation';
      if (titleLower.includes('thought') || titleLower.includes('reframing')) return 'anxious-thought';
      return 'anxiety-management';
    }
    if (titleLower.includes('anger')) {
      if (titleLower.includes('stop')) return 'anger-stop';
      if (titleLower.includes('letter')) return 'anger-letter';
      if (titleLower.includes('root')) return 'anger-root-cause';
      return 'anger-management';
    }
    if (titleLower.includes('work')) {
      if (titleLower.includes('boundar')) return 'work-boundaries';
      if (titleLower.includes('task') || titleLower.includes('priorit')) return 'task-prioritization';
      if (titleLower.includes('value')) return 'work-values';
      return 'work-stress';
    }
    if (titleLower.includes('mindful')) {
      if (titleLower.includes('body') || titleLower.includes('scan')) return 'body-scan';
      if (titleLower.includes('breath')) return 'mindful-breathing';
      if (titleLower.includes('observ')) return 'mindful-observation';
      return 'mindfulness';
    }
    if (titleLower.includes('lonel') || titleLower.includes('connect')) {
      if (titleLower.includes('inventory')) return 'connection-inventory';
      if (titleLower.includes('self-connect')) return 'self-connection';
      return 'belonging-expansion';
    }
    if (titleLower.includes('health') || titleLower.includes('body')) {
      if (titleLower.includes('appreciation')) return 'body-appreciation';
      if (titleLower.includes('worry')) return 'health-worry';
      return 'mindful-body-scan';
    }
    if (exercise.type === 'journaling' || exercise.type === 'journal') return 'journaling';
    if (exercise.type === 'meditation') return 'mindfulness';
    if (exercise.type === 'breathing') return 'breathing';
    if (exercise.type === 'grounding') return 'grounding';
    if (exercise.type === 'reflection') return 'reflection';

    return 'default';
  };

  const createDefaultExercise = () => {
    return {
      title: exercise.title || "Wellness Exercise",
      description: exercise.description || "A practice to support your well-being.",
      steps: exercise.steps
        ? exercise.steps.map(step => typeof step === 'string'
          ? { title: "Step", content: step }
          : step)
        : [{ title: "Practice", content: "Follow the instructions provided." }],
      tips: exercise.benefits
        ? ["Remember: " + exercise.benefits]
        : ["Take your time with this exercise."],
      resources: exercise.resources || [],
      type: exercise.type || "general"
    };
  };

  const handleSave = () => {
    if (journalEntry.trim()) {
      console.log("Saving journal entry:", journalEntry);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    }
  };

  const nextStep = () => {
    if (exerciseContent && step < exerciseContent.steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleCheckItem = (index) => {
    setChecklist({
      ...checklist,
      [index]: !checklist[index]
    });
  };

  const handleValueChange = (id, newValue) => {
    setValuesList(valuesList.map(item =>
      item.id === id ? { ...item, value: newValue } : item
    ));
  };

  const handleDragStart = (e, value) => {
    setDraggedValue(value);
    e.target.style.opacity = '0.6';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedValue(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetValue) => {
    e.preventDefault();

    if (draggedValue.id === targetValue.id) return;

    const updatedList = [...valuesList];
    const draggedIndex = updatedList.findIndex(item => item.id === draggedValue.id);
    const targetIndex = updatedList.findIndex(item => item.id === targetValue.id);
    const draggedRank = updatedList[draggedIndex].rank;
    updatedList[draggedIndex].rank = updatedList[targetIndex].rank;
    updatedList[targetIndex].rank = draggedRank;
    updatedList.sort((a, b) => a.rank - b.rank);
    setValuesList(updatedList);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-b from-[#1A2335] to-[#1A2335]/95 border border-[#3E60C1]/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto mx-4 shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{exerciseContent?.title || exercise.title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#B8C7E0] hover:bg-[#2A3547] transition-colors"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Description */}
        <p className="text-[#B8C7E0] mb-4">{exerciseContent?.description || exercise.description}</p>

        {/* Duration & Type */}
        <div className="flex items-center justify-between mb-6">
          {exercise.duration && (
            <div className="flex items-center text-[#B8C7E0] text-sm">
              <FaStopwatch className="mr-2 text-[#5983FC]" />
              {exercise.duration}
            </div>
          )}
          {(exerciseContent?.type || exercise.type) && (
            <div className="bg-[#0F172A] px-3 py-1 rounded-full text-[#B8C7E0] text-xs font-medium">
              {(exerciseContent?.type || exercise.type).charAt(0).toUpperCase() + (exerciseContent?.type || exercise.type).slice(1)}
            </div>
          )}
        </div>

        {/* Tabs: Steps / Resources */}
        <div className="flex border-b border-[#2A3547] mb-4">
          <button
            onClick={() => setShowResources(false)}
            className={`px-4 py-2 ${!showResources ? 'text-[#5983FC] border-b-2 border-[#5983FC]' : 'text-[#B8C7E0]'}`}
          >
            Exercise
          </button>
          <button
            onClick={() => setShowResources(true)}
            className={`px-4 py-2 ${showResources ? 'text-[#5983FC] border-b-2 border-[#5983FC]' : 'text-[#B8C7E0]'}`}
          >
            Resources
          </button>
        </div>

        {!showResources ? (
          // Exercise view
          <div className="mb-6">
            {!completed ? (
              <>
                {/* Step progress */}
                {exerciseContent?.steps && exerciseContent.steps.length > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#B8C7E0] text-sm">
                      Step {step + 1} of {exerciseContent.steps.length}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-[#0F172A] rounded-full">
                        <div
                          className="h-1 bg-[#5983FC] rounded-full"
                          style={{ width: `${((step + 1) / exerciseContent.steps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current step display */}
                <div className="bg-[#0F172A] p-4 rounded-lg border border-[#2A3547] mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#5983FC] text-sm font-medium">
                      {exerciseContent?.steps?.[step]?.title || `Step ${step + 1}`}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={prevStep}
                        disabled={step === 0}
                        className={`p-2 rounded-lg transition-all ${step === 0
                            ? 'bg-[#2A3547] text-[#B8C7E0]/50 cursor-not-allowed'
                            : 'bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547] hover:text-white'
                          }`}
                        aria-label="Previous step"
                      >
                        <FaChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[#B8C7E0] text-sm">
                        {step + 1} / {exerciseContent.steps.length}
                      </span>
                      {step < (exerciseContent?.steps?.length - 1) ? (
                        <button
                          onClick={nextStep}
                          className="p-2 rounded-lg bg-[#1A2335] text-[#B8C7E0] hover:bg-[#2A3547] hover:text-white transition-all"
                          aria-label="Next step"
                        >
                          <FaChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleComplete}
                          className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
                          aria-label="Complete exercise"
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-white">{getCurrentStep()}</p>
                </div>

                {/* Interactive component if applicable */}
                {hasInteractiveComponent() && renderInteractiveComponent()}

                {/* Tips if available */}
                {exerciseContent?.tips && exerciseContent.tips.length > 0 && step === exerciseContent.steps.length - 1 && (
                  <div className="mt-4 bg-[#0F172A]/70 p-3 rounded-lg border border-[#2A3547]">
                    <h4 className="text-[#5983FC] text-sm font-medium mb-2 flex items-center">
                      <FaRegLightbulb className="mr-2" /> Helpful Tips:
                    </h4>
                    <ul className="space-y-2">
                      {exerciseContent.tips.map((tip, idx) => (
                        <li key={idx} className="text-[#B8C7E0] text-sm flex items-start">
                          <span className="text-[#5983FC] mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-end mt-6">
                  {step === (exerciseContent?.steps?.length - 1) && (
                    <button
                      onClick={handleComplete}
                      className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 flex items-center"
                    >
                      Complete <FaCheck className="ml-2" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              // Completion view
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
                  <FaCheck className="text-2xl" />
                </div>
                <h3 className="text-white text-xl font-medium mb-2">Exercise Completed!</h3>
                <p className="text-[#B8C7E0] mb-6">
                  Great job! How do you feel after completing this exercise?
                </p>

                {/* Reflection prompt */}
                <div className="mb-6">
                  <textarea
                    className="w-full h-20 bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] mb-4"
                    placeholder="Share your thoughts on how this exercise affected you..."
                  />
                </div>

                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-[#3E60C1] text-white hover:bg-[#5983FC]"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        ) : (
          // Resources view
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Professional Resources</h3>

            {exerciseContent?.resources?.length > 0 || exercise.resources?.length > 0 ? (
              <div className="space-y-3">
                {(exerciseContent?.resources || exercise.resources || []).map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start bg-[#0F172A] p-3 rounded-lg border border-[#2A3547] hover:border-[#5983FC] transition-colors"
                  >
                    <div className="bg-[#2A3547] p-2 rounded-lg mr-3">
                      {resource.type === 'video' ? (
                        <FaYoutube className="text-red-500" />
                      ) : resource.type === 'article' ? (
                        <FaFileAlt className="text-blue-400" />
                      ) : resource.type === 'book' ? (
                        <FaBook className="text-amber-400" />
                      ) : (
                        <FaLink className="text-[#5983FC]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{resource.title}</h4>
                      <p className="text-[#B8C7E0] text-xs">{resource.description}</p>
                    </div>
                    <FaExternalLinkAlt className="text-[#5983FC] ml-2 mt-1 flex-shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-[#B8C7E0] text-sm">
                No external resources available for this exercise.
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExerciseModal;

// Add this new TaskItem component at the bottom of the file
const TaskItem = ({ task, onDelete, onEdit, color }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(task.text);
  };

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit({ ...task, text: editedText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`group relative bg-[#1A2335] rounded-lg border border-${color}-500/20 transition-all duration-200 hover:border-${color}-500/40 min-h-[40px] overflow-visible`}>
        <div className="flex items-center justify-between p-2 gap-2">
          <span className="text-[#B8C7E0] text-sm break-words overflow-hidden flex-1 pr-1">{task.text}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
            <button
              onClick={() => onDelete(task.id)}
              className="flex items-center justify-center w-6 h-6 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
              title="Delete"
            >
              <FaTrash className="w-3 h-3" />
            </button>
        </div>
      </div>
    </div>
  );
};

// Add these helper functions for the progress indicator
const getProgressStyle = () => {
  const checkedAreas = bodyAreas.filter(a => a.checked && a.gratitude.trim());
  const progress = checkedAreas.length;

  if (progress >= 4 && generalGratitude && selfCareIntention) {
    return 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400';
  }
  if (progress >= 2) {
    return 'bg-amber-500/10 border border-amber-500/30 text-amber-400';
  }
  return 'bg-[#1E293B] border border-[#3E60C1]/30 text-[#B8C7E0]';
};

const getProgressMessage = () => {
  const checkedAreas = bodyAreas.filter(a => a.checked && a.gratitude.trim());
  const progress = checkedAreas.length;

  if (progress >= 4 && generalGratitude && selfCareIntention) {
    return "Beautiful reflection! You've created a meaningful appreciation practice.";
  }
  if (progress >= 2) {
    return "Great progress! Consider exploring a few more areas of gratitude.";
  }
  return "Begin by selecting areas of your body and noting what you appreciate about them.";
};

// Add this new component for the scenario input
const ScenarioInput = ({ type, scenario, onUpdate, isCompleted }) => {
  const getScenarioIcon = () => {
    switch (type) {
      case 'positive':
        return <FaSmile className="text-emerald-400" />;
      case 'neutral':
        return <FaMeh className="text-[#5983FC]" />;
      case 'challenging':
        return <FaFrown className="text-amber-400" />;
      default:
        return null;
    }
  };

  const getScenarioLabel = () => {
    switch (type) {
      case 'positive':
        return 'Positive Outcome';
      case 'neutral':
        return 'Neutral Outcome';
      case 'challenging':
        return 'Challenging Outcome';
      default:
        return '';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        {getScenarioIcon()}
        <h4 className="text-white font-medium ml-2">{getScenarioLabel()}</h4>
      </div>
      <div className="space-y-3">
        <textarea
          value={scenario.description || ''}
          onChange={(e) => onUpdate({ ...scenario, description: e.target.value })}
          placeholder={`Describe a ${type} possible outcome...`}
          className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[80px] placeholder-[#4B5563]"
        />
        <textarea
          value={scenario.coping || ''}
          onChange={(e) => onUpdate({ ...scenario, coping: e.target.value })}
          placeholder="How would you cope with this outcome?"
          className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[80px] placeholder-[#4B5563]"
        />
        <textarea
          value={scenario.resources || ''}
          onChange={(e) => onUpdate({ ...scenario, resources: e.target.value })}
          placeholder="What resources and strengths could help you?"
          className="w-full bg-[#0F172A] border border-[#2A3547] rounded-lg p-3 text-[#B8C7E0] focus:outline-none focus:border-[#5983FC] min-h-[80px] placeholder-[#4B5563]"
        />
      </div>
      {isCompleted && (
        <div className="mt-2 text-emerald-400 flex items-center text-sm">
          <FaCheck className="mr-1" /> Scenario completed
        </div>
      )}
    </div>
  );
};