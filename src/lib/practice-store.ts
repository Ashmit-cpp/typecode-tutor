import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PracticeMode = 'practice' | 'algorithm';
export type TypingMode = 'input' | 'typing';

interface PracticeModeState {
  mode: PracticeMode;
  setMode: (mode: PracticeMode) => void;
  typingMode: TypingMode;
  setTypingMode: (mode: TypingMode) => void;
}

export const usePracticeModeStore = create<PracticeModeState>()(
  persist(
    (set) => ({
      mode: 'practice',
      setMode: (mode) => set({ mode }),
      typingMode: 'input',
      setTypingMode: (typingMode) => set({ typingMode }),
    }),
    {
      name: 'practice-mode-storage',
    }
  )
); 