import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PersonaKey = 'policy' | 'essay' | 'aid' | 'general';

export type PersonaSetting = {
  tone: 'formal' | 'casual';
  detail: 'brief' | 'normal' | 'thorough';
  language: 'en' | 'ko';
};

type State = {
  personas: Partial<Record<PersonaKey, PersonaSetting>>;
  setPersonaSetting: (key: PersonaKey, setting: PersonaSetting) => void;
  getPersonaSetting: (key: PersonaKey) => PersonaSetting;
};

const DEFAULT: PersonaSetting = { tone: 'formal', detail: 'normal', language: 'en' };

export const useAssistantSettings = create<State>()(
  persist(
    (set, get) => ({
      personas: {},
      setPersonaSetting: (key, setting) => set((s) => ({ personas: { ...s.personas, [key]: setting } })),
      getPersonaSetting: (key) => get().personas[key] || DEFAULT,
    }),
    { name: 'assistant_settings_v1' }
  )
);

