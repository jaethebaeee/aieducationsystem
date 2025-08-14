import React, { useState } from 'react';
import { useOnboardingStore } from '../../services/onboardingStore';
import { useNavigate } from 'react-router-dom';

const NudgeButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...props }) => (
  <button
    {...props}
    className={`px-3 py-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white ${className}`}
  >
    {children}
  </button>
);

export default function DashboardNudge() {
  const { answers } = useOnboardingStore();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const numTargets = answers?.targetColleges?.length || 0;
  const onboardingCoreDone = Boolean(answers.fullName && answers.graduationYear && answers.region && answers.intendedMajor);
  if (dismissed) return null;

  // Show when onboarding isn’t complete OR user has very few targets
  if (onboardingCoreDone && numTargets >= 3) return null;

  const prefillPrompt = (prompt: string) => {
    // Open chat and prefill with a suggestion
    document.dispatchEvent(new CustomEvent('chat:toggle'));
    document.dispatchEvent(new CustomEvent('chat:prefill', { detail: { prompt } } as any));
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Not sure which schools to finalize?</p>
          <p className="text-xs text-white/70 mt-1">Use the assistant to generate reach/match/safety sets or jump into quick research. You can always adjust later.</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-white/60 hover:text-white text-sm">Dismiss</button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <NudgeButton onClick={() => prefillPrompt('Given my profile, suggest 3 reach, 3 match, and 3 safety schools with brief rationales and upcoming deadlines.')}>Get smart recommendations</NudgeButton>
        <NudgeButton onClick={() => prefillPrompt('Research and compare two schools I am considering. Show priorities, culture, and deadlines with sources.')}>Ask Advisor</NudgeButton>
        <NudgeButton className="bg-indigo-600 hover:bg-indigo-500 border-indigo-500" onClick={() => navigate('/onboarding/advisor')}>
          {onboardingCoreDone ? 'Add a target' : 'Resume onboarding'}
        </NudgeButton>
      </div>
    </div>
  );
}

