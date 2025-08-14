import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationPrefs = {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
};

type State = NotificationPrefs & {
  set: (partial: Partial<NotificationPrefs>) => void;
  toggle: (key: keyof NotificationPrefs) => void;
};

const DEFAULT_PREFS: NotificationPrefs = {
  email: true,
  push: true,
  sms: false,
  marketing: false,
};

export const useNotificationSettings = create<State>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFS,
      set: (partial) => set((s) => ({ ...s, ...partial })),
      toggle: (key) => set((s) => ({ ...s, [key]: !s[key] })),
    }),
    { name: 'notification_settings_v1' }
  )
);