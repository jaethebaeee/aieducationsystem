import React from 'react';
import OnboardingProgress from './OnboardingProgress';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: string;
  completedSteps: string[];
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ 
  children, 
  currentStep, 
  completedSteps 
}) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="bg-black/70 backdrop-blur border-b border-white/10 sticky top-0 z-30">
        <OnboardingProgress currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout; 