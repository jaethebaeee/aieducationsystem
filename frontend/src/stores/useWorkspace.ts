import { create } from 'zustand';

export type Selection = { type: 'school' | 'essay'; id: string; name?: string } | null;
export type Profile = { major?: string; intl?: boolean; budget?: number; traits?: string[] } | null;

export const useWorkspace = create<{
  selection: Selection;
  setSelection: (s: Selection) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
}>((set) => ({
  selection: null,
  setSelection: (selection) => set({ selection }),
  profile: null,
  setProfile: (profile) => set({ profile }),
}));

