import { create } from 'zustand';

export type PracticeMode = 'practice' | 'algorithm';
export type TypingMode = 'input' | 'typing';

interface PracticeModeState {
  mode: PracticeMode;
  setMode: (mode: PracticeMode) => void;
  typingMode: TypingMode;
  setTypingMode: (mode: TypingMode) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

export const usePracticeModeStore = create<PracticeModeState>((set) => ({
  mode: 'practice',
  setMode: (mode) => set({ mode }),
  typingMode: 'input',
  setTypingMode: (typingMode) => set({ typingMode }),
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
})); 