import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CoachPersona = 'dean' | 'alumni' | 'ta';

export interface CoachPersonaTheme {
  key: CoachPersona;
  label: string;
  accentClass: string; // tailwind color class for accents
  chipClass: string;   // tailwind classes for chip background/border
  icon: 'academic' | 'alumni' | 'ta';
  copyStyle: 'formal' | 'conversational' | 'direct';
}

const THEMES: Record<CoachPersona, CoachPersonaTheme> = {
  dean: {
    key: 'dean',
    label: 'Dean of Admissions',
    accentClass: 'text-blue-600',
    chipClass: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
    icon: 'academic',
    copyStyle: 'formal',
  },
  alumni: {
    key: 'alumni',
    label: 'Alumni Interviewer',
    accentClass: 'text-purple-600',
    chipClass: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
    icon: 'alumni',
    copyStyle: 'conversational',
  },
  ta: {
    key: 'ta',
    label: 'Writing TA',
    accentClass: 'text-emerald-600',
    chipClass: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    icon: 'ta',
    copyStyle: 'direct',
  },
};

type State = {
  persona: CoachPersona;
  setPersona: (persona: CoachPersona) => void;
  getTheme: () => CoachPersonaTheme;
};

export const useCoachPersona = create<State>()(
  persist(
    (set, get) => ({
      persona: 'dean',
      setPersona: (persona) => set({ persona }),
      getTheme: () => THEMES[get().persona],
    }),
    { name: 'coach_persona_v1' }
  )
);

export const CoachPersonaThemes = THEMES;

