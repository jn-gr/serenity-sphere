import { useState } from 'react';

const EmotionAnalysisModal = ({ 
  selectedEmotions, 
  isOpen, 
  onClose,
  excitementSteps,
  setExcitementSteps,
  currentStep,
  setCurrentStep,
  amusementDescription,
  setAmusementDescription
}) => {
  const handleAddStep = () => {
    if (currentStep.trim()) {
      setExcitementSteps([...excitementSteps, currentStep]);
      setCurrentStep('');
    }
  };

  if (!isOpen) return null;

  const sortedEmotions = [...selectedEmotions].sort((a, b) => b[1] - a[1]);
  const primaryEmotion = sortedEmotions[0][0].toLowerCase();
  const isExcitementPrimary = primaryEmotion === 'excitement';
  const isAmusementPrimary = primaryEmotion === 'amusement';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-white mb-4">Emotion Analysis</h3>
        
        <div className="space-y-2 mb-6">
          {sortedEmotions.map(([emotion, threshold], idx) => {
            const percentage = Math.round(threshold * 100);
            return (
              <div 
                key={idx} 
                className="group bg-[#0F172A] p-3 rounded-lg transition-all duration-300 hover:bg-[#2A3547]/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#5983FC] font-medium text-sm">
                      #{idx + 1}
                    </span>
                    <span className="text-[#B8C7E0] capitalize font-medium">
                      {emotion.toLowerCase()}
                    </span>
                  </div>
                  <span className="text-[#5983FC] font-semibold">
                    {percentage}%
                  </span>
                </div>
                <div className="relative h-2.5 bg-[#2A3547] rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#3E60C1] to-[#5983FC] rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      animation: idx === 0 ? 'shimmer 3s infinite' : 'none'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {isExcitementPrimary && (
          <div className="space-y-4 border-t border-[#2A3547] pt-6">
            <p className="text-[#B8C7E0]">
              Your excitement stands out! Let's channel this energy:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentStep}
                onChange={(e) => setCurrentStep(e.target.value)}
                placeholder="Enter an action step"
                className="bg-[#0F172A] text-white px-4 py-2 rounded-lg flex-1"
              />
              <button 
                onClick={handleAddStep}
                className="bg-[#5983FC] text-white px-4 py-2 rounded-lg hover:bg-[#3E60C1] transition-colors"
              >
                Add Step
              </button>
            </div>
            <div className="space-y-2">
              {excitementSteps.map((step, index) => (
                <div key={index} className="flex items-center bg-[#0F172A] p-3 rounded-lg">
                  <span className="text-[#5983FC] mr-2">{index + 1}.</span>
                  <span className="text-[#B8C7E0]">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAmusementPrimary && (
          <div className="space-y-4 border-t border-[#2A3547] pt-6">
            <div className="space-y-3">
              <h4 className="text-[#B8C7E0] font-medium">
                Let's savour this joyful moment 🎉
              </h4>
              <p className="text-sm text-[#B8C7E0]/80">
                Reflect on what made this experience amusing or uplifting
              </p>
              <textarea
                value={amusementDescription}
                onChange={(e) => setAmusementDescription(e.target.value)}
                placeholder="Describe one moment that made you smile or laugh today..."
                className="w-full h-32 bg-[#0F172A] text-[#B8C7E0] p-3 rounded-lg border border-[#2A3547] focus:border-[#5983FC] focus:ring-1 focus:ring-[#5983FC] resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setAmusementDescription('')}
                  className="px-4 py-2 text-[#B8C7E0] hover:text-[#5983FC] transition-colors text-sm"
                >
                  Clear Reflection
                </button>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#5983FC] text-white py-2 rounded-lg hover:bg-[#3E60C1] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmotionAnalysisModal; 