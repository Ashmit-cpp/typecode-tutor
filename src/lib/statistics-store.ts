import { create } from 'zustand';
import type { Id } from '../../convex/_generated/dataModel';

export interface TestResult {
  _id: Id<"testResults">;
  mode: 'practice' | 'algorithm';
  wpm: number;
  accuracy: number;
  timeElapsed: number; // in seconds
  correctChars: number;
  totalChars: number;
  errors: number;
  completedAt: number; // timestamp
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
  setTestResults: (results: TestResult[]) => void;
  getStatisticsSummary: () => StatisticsSummary;
  getRecentTests: (limit?: number) => TestResult[];
}

export const useStatisticsStore = create<StatisticsState>((set, get) => ({
  testResults: [],
  
  setTestResults: (results) => {
    set({ testResults: results });
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
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, limit);
  },
})); 