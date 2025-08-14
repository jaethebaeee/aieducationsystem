import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GraduationYear = 2025 | 2026 | 2027 | 2028;
export type Region = 'US' | 'Canada' | 'UK' | 'EU' | 'APAC' | 'Other';
export type IntendedMajor = 'Computer Science' | 'Engineering' | 'Business' | 'Economics' | 'Biology' | 'Psychology' | 'English' | 'History' | 'Undecided' | string;
export type ApplicationPlan = 'ED' | 'EA' | 'RD' | 'REA' | 'Rolling';

export interface StudentActivity {
  id: string;
  category: 'STEM' | 'Leadership' | 'Community' | 'Arts' | 'Athletics' | 'Research' | 'Entrepreneurship' | 'Other';
  title: string;
  description?: string;
  role?: string;
  duration?: string;
  impactLevel?: 'Local' | 'Regional' | 'National' | 'International';
}

export interface TargetCollege {
  id: string;    // e.g. 'harvard'
  name: string;  // e.g. 'Harvard University'
  plan: ApplicationPlan;
}

export interface OnboardingAnswers {
  fullName: string;
  graduationYear: GraduationYear | null;
  region: Region | null;
  currentSchool?: string;
  gpaScale?: number;     // 4.0, 5.0, etc.
  gpa?: number;
  sat?: number;
  act?: number;
  testPlan?: 'SAT' | 'ACT' | 'Test-Optional' | 'Both' | 'Undecided';
  nextTestDate?: string; // ISO date (YYYY-MM-DD)
  intendedMajor: IntendedMajor | null;
  budget: 'Low' | 'Medium' | 'High' | null;
  needFinancialAid: boolean;
  targetColleges: TargetCollege[];
  activities: StudentActivity[];
  recommenders?: Array<{ id: string; name: string; subject?: string; email?: string }>;
  // Quick Setup
  curriculum?: 'AP' | 'IB' | 'A-level' | 'Korean' | 'Other' | string;
  gpaType?: 'Weighted' | 'Unweighted';
  classRankPercentile?: number; // 1-100
  awards?: string; // multiline
  citizenship?: 'Korean' | 'US' | 'Dual' | 'Other' | string;
  visaStatus?: string;
  edRiskTolerance?: 'Low' | 'Medium' | 'High';
  campusSize?: 'Small' | 'Medium' | 'Large';
  campusSetting?: 'Urban' | 'Suburban' | 'Rural';
  climatePreference?: 'Warm' | 'Mild' | 'Cold';
  hooks?: {
    firstGen?: boolean;
    legacy?: boolean;
    athlete?: boolean;
    arts?: boolean;
    athleteSport?: string;
    artsArea?: string;
  };
  identityThemes?: string[]; // up to 3
  weeklyEssayHours?: number;
  applicationPlatforms?: Array<'Common App' | 'UC' | 'Coalition' | string>;
  languagePreference?: 'ko' | 'en' | 'both';
  parentUpdates?: { enabled: boolean; contact?: string };
  consentDataUse?: boolean;
  alertsDeadlines?: boolean;
}

interface OnboardingStore {
  answers: OnboardingAnswers;
  // per-college prep checklist progress: { [collegeId]: { [itemKey]: boolean } }
  prepProgress: Record<string, Record<string, boolean>>;
  // per-college custom items: { [collegeId]: { customItems: { key: string; label: string }[], notes: string } }
  customPrep: Record<string, { customItems: { key: string; label: string }[]; notes: string } >;

  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  addTargetCollege: (college: TargetCollege) => void;
  removeTargetCollege: (id: string) => void;
  addActivity: (activity: StudentActivity) => void;
  removeActivity: (id: string) => void;
  togglePrepItem: (collegeId: string, itemKey: string) => void;
  addCustomPrepItem: (collegeId: string, label: string) => void;
  removeCustomPrepItem: (collegeId: string, key: string) => void;
  setCollegeNotes: (collegeId: string, notes: string) => void;
  reset: () => void;
}

const initialState: OnboardingAnswers = {
  fullName: '',
  graduationYear: null,
  region: null,
  currentSchool: '',
  gpaScale: 4.0,
  gpa: undefined,
  sat: undefined,
  act: undefined,
  testPlan: 'Undecided',
  intendedMajor: null,
  budget: null,
  needFinancialAid: true,
  targetColleges: [],
  activities: [],
  recommenders: [],
  curriculum: undefined,
  gpaType: undefined,
  classRankPercentile: undefined,
  awards: '',
  citizenship: undefined,
  visaStatus: '',
  edRiskTolerance: undefined,
  campusSize: undefined,
  campusSetting: undefined,
  climatePreference: undefined,
  hooks: { firstGen: false, legacy: false, athlete: false, arts: false, athleteSport: '', artsArea: '' },
  identityThemes: ['', '', ''],
  weeklyEssayHours: undefined,
  applicationPlatforms: [],
  languagePreference: undefined,
  parentUpdates: { enabled: false, contact: '' },
  consentDataUse: false,
  alertsDeadlines: true,
  nextTestDate: undefined,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      answers: initialState,
      prepProgress: {},
      customPrep: {},

      setAnswer: (key, value) => set((state) => ({ answers: { ...state.answers, [key]: value } })),
      addTargetCollege: (college) => set((state) => ({ answers: { ...state.answers, targetColleges: [...state.answers.targetColleges, college] } })),
      removeTargetCollege: (id) => set((state) => ({ answers: { ...state.answers, targetColleges: state.answers.targetColleges.filter(c => c.id !== id) } })),
      addActivity: (activity) => set((state) => ({ answers: { ...state.answers, activities: [...state.answers.activities, activity] } })),
      removeActivity: (id) => set((state) => ({ answers: { ...state.answers, activities: state.answers.activities.filter(a => a.id !== id) } })),

      togglePrepItem: (collegeId, itemKey) => set((state) => {
        const current = state.prepProgress[collegeId] || {};
        return {
          prepProgress: {
            ...state.prepProgress,
            [collegeId]: { ...current, [itemKey]: !current[itemKey] }
          }
        };
      }),

      addCustomPrepItem: (collegeId, label) => set((state) => {
        const entry = state.customPrep[collegeId] || { customItems: [], notes: '' };
        const key = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (entry.customItems.find(i => i.key === key)) return {};
        return {
          customPrep: {
            ...state.customPrep,
            [collegeId]: { ...entry, customItems: [...entry.customItems, { key, label }] }
          }
        };
      }),

      removeCustomPrepItem: (collegeId, key) => set((state) => {
        const entry = state.customPrep[collegeId] || { customItems: [], notes: '' };
        return {
          customPrep: {
            ...state.customPrep,
            [collegeId]: { ...entry, customItems: entry.customItems.filter(i => i.key !== key) }
          }
        };
      }),

      setCollegeNotes: (collegeId, notes) => set((state) => ({
        customPrep: {
          ...state.customPrep,
          [collegeId]: { ...(state.customPrep[collegeId] || { customItems: [], notes: '' }), notes }
        }
      })),

      reset: () => set({ answers: initialState, prepProgress: {}, customPrep: {} })
    }),
    {
      name: 'advisor-onboarding-store',
      partialize: (state) => ({ answers: state.answers, prepProgress: state.prepProgress, customPrep: state.customPrep })
    }
  )
);