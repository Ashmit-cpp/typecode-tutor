import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PracticeMode = 'practice' | 'algorithm';

interface PracticeModeState {
  mode: PracticeMode;
  setMode: (mode: PracticeMode) => void;
}

export const usePracticeModeStore = create<PracticeModeState>()(
  persist(
    (set) => ({
      mode: 'practice',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'practice-mode-storage',
    }
  )
); 