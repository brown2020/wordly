"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingsState {
  hardMode: boolean;
  darkMode: boolean;
  highContrastMode: boolean;
  // Actions
  setHardMode: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setHighContrastMode: (enabled: boolean) => void;
  toggleHardMode: () => void;
  toggleDarkMode: () => void;
  toggleHighContrastMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      hardMode: false,
      darkMode: false,
      highContrastMode: false,

      setHardMode: (enabled) => set({ hardMode: enabled }),
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setHighContrastMode: (enabled) => set({ highContrastMode: enabled }),

      toggleHardMode: () => set({ hardMode: !get().hardMode }),
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      toggleHighContrastMode: () => set({ highContrastMode: !get().highContrastMode }),
    }),
    {
      name: "wordly-settings",
    }
  )
);
