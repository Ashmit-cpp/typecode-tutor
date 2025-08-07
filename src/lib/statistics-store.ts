import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TestResult {
  id: string;
  mode: 'practice' | 'algorithm';
  wpm: number;
  accuracy: number;
  timeElapsed: number; // in seconds
  correctChars: number;
  totalChars: number;
  errors: number;
  completedAt: Date;
  textPreview: string; // First 50 characters of the text typed
  algorithmName?: string; // Only for algorithm mode
}

export interface StatisticsSummary {
  totalTests: number;
  averageWpm: number;
  highestWpm: number;
  averageAccuracy: number;
  totalTimeSpent: number; // in seconds
  practiceTests: {
    count: number;
    averageWpm: number;
    highestWpm: number;
    averageAccuracy: number;
  };
  algorithmTests: {
    count: number;
    averageWpm: number;
    highestWpm: number;
    averageAccuracy: number;
    algorithmsCompleted: string[];
  };
}

interface StatisticsState {
  testResults: TestResult[];
  addTestResult: (result: Omit<TestResult, 'id' | 'completedAt'>) => void;
  getStatisticsSummary: () => StatisticsSummary;
  getRecentTests: (limit?: number) => TestResult[];
  clearAllStatistics: () => void;
}

export const useStatisticsStore = create<StatisticsState>()(
  persist(
    (set, get) => ({
      testResults: [],
      
      addTestResult: (result) => {
        const newResult: TestResult = {
          ...result,
          id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          completedAt: new Date(),
        };
        
        set((state) => ({
          testResults: [...state.testResults, newResult],
        }));
      },
      
      getStatisticsSummary: () => {
        const results = get().testResults;
        
        if (results.length === 0) {
          return {
            totalTests: 0,
            averageWpm: 0,
            highestWpm: 0,
            averageAccuracy: 0,
            totalTimeSpent: 0,
            practiceTests: {
              count: 0,
              averageWpm: 0,
              highestWpm: 0,
              averageAccuracy: 0,
            },
            algorithmTests: {
              count: 0,
              averageWpm: 0,
              highestWpm: 0,
              averageAccuracy: 0,
              algorithmsCompleted: [],
            },
          };
        }
        
        const practiceResults = results.filter(r => r.mode === 'practice');
        const algorithmResults = results.filter(r => r.mode === 'algorithm');
        
        const calculateStats = (tests: TestResult[]) => {
          if (tests.length === 0) return { averageWpm: 0, highestWpm: 0, averageAccuracy: 0 };
          
          const avgWpm = tests.reduce((sum, test) => sum + test.wpm, 0) / tests.length;
          const highestWpm = Math.max(...tests.map(test => test.wpm));
          const avgAccuracy = tests.reduce((sum, test) => sum + test.accuracy, 0) / tests.length;
          
          return {
            averageWpm: Math.round(avgWpm),
            highestWpm,
            averageAccuracy: Math.round(avgAccuracy),
          };
        };
        
        const overallStats = calculateStats(results);
        const practiceStats = calculateStats(practiceResults);
        const algorithmStats = calculateStats(algorithmResults);
        
        const uniqueAlgorithms = [...new Set(
          algorithmResults
            .filter(r => r.algorithmName)
            .map(r => r.algorithmName!)
        )];
        
        return {
          totalTests: results.length,
          averageWpm: overallStats.averageWpm,
          highestWpm: overallStats.highestWpm,
          averageAccuracy: overallStats.averageAccuracy,
          totalTimeSpent: Math.round(results.reduce((sum, test) => sum + test.timeElapsed, 0)),
          practiceTests: {
            count: practiceResults.length,
            ...practiceStats,
          },
          algorithmTests: {
            count: algorithmResults.length,
            ...algorithmStats,
            algorithmsCompleted: uniqueAlgorithms,
          },
        };
      },
      
      getRecentTests: (limit = 10) => {
        return get().testResults
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .slice(0, limit);
      },
      
      clearAllStatistics: () => {
        set({ testResults: [] });
      },
    }),
    {
      name: 'typing-statistics-storage',
    }
  )
); 