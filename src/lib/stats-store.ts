import { create } from 'zustand';

export interface TypingStats {
  accuracy: number;
  wpm: number;
  timeElapsed: number;
  correctChars: number;
  totalChars: number;
  errors: number;
}

interface StatsState {
  stats: TypingStats | null;
  setStats: (stats: TypingStats | null) => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
}));
