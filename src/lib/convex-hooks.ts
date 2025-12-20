import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { useStatisticsStore } from "./statistics-store";
import { usePracticeModeStore } from "./practice-store";

// Hook to sync test results from Convex to local store
export function useTestResults() {
  const results = useQuery(api.functions.getAllTestResults);
  const setTestResults = useStatisticsStore((state) => state.setTestResults);

  useEffect(() => {
    if (results !== undefined) {
      setTestResults(results || []);
    }
  }, [results, setTestResults]);

  return {
    data: results,
    isLoading: results === undefined,
    error: null, // Convex handles errors internally, but we can add more sophisticated error handling later
  };
}

// Hook to add test result
export function useAddTestResult() {
  return useMutation(api.functions.addTestResult);
}

// Hook to clear all statistics
export function useClearStatistics() {
  return useMutation(api.functions.clearAllStatistics);
}

// Hook to sync user settings from Convex to local store
export function useUserSettings() {
  const settings = useQuery(api.functions.getUserSettings);
  const setMode = usePracticeModeStore((state) => state.setMode);
  const setTypingMode = usePracticeModeStore((state) => state.setTypingMode);
  const setIsLoaded = usePracticeModeStore((state) => state.setIsLoaded);

  useEffect(() => {
    if (settings) {
      setMode(settings.practiceMode);
      setTypingMode(settings.typingMode);
      setIsLoaded(true);
    }
  }, [settings, setMode, setTypingMode, setIsLoaded]);

  return {
    data: settings,
    isLoading: settings === undefined,
    error: null, // Convex handles errors internally, but we can add more sophisticated error handling later
  };
}

// Hook to update practice mode
export function useUpdatePracticeMode() {
  const mutation = useMutation(api.functions.updatePracticeMode);
  const setMode = usePracticeModeStore((state) => state.setMode);
  
  return async (mode: 'practice' | 'algorithm') => {
    setMode(mode); // Update local state immediately for responsiveness
    await mutation({ practiceMode: mode });
  };
}

// Hook to update typing mode
export function useUpdateTypingMode() {
  const mutation = useMutation(api.functions.updateTypingMode);
  const setTypingMode = usePracticeModeStore((state) => state.setTypingMode);
  
  return async (mode: 'input' | 'typing') => {
    setTypingMode(mode); // Update local state immediately for responsiveness
    await mutation({ typingMode: mode });
  };
}

