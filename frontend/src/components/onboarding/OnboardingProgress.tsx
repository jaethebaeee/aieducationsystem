import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../../contexts/LanguageContext';

const translations = {
  en: {
    steps: [
      { id: 'welcome', label: 'Welcome', description: 'Get Started' },
      { id: 'goals', label: 'Goals', description: 'Set Your Goals' },
      { id: 'universities', label: 'Universities', description: 'Choose Universities' },
      { id: 'profile', label: 'Profile', description: 'Complete Profile' }
    ]
  },
  ko: {
    steps: [
      { id: 'welcome', label: '환영', description: '시작하기' },
      { id: 'goals', label: '목표', description: '목표 설정' },
      { id: 'universities', label: '대학', description: '대학 선택' },
      { id: 'profile', label: '프로필', description: '프로필 완성' }
    ]
  }
};

interface OnboardingProgressProps {
  currentStep: string;
  completedSteps: string[];
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ 
  currentStep, 
  completedSteps 
}) => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {t.steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isCurrent
                      ? 'bg-blue-100 border-blue-600 text-blue-600'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-medium ${
                      isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-xs ${
                      isCompleted || isCurrent ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < t.steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgress; 