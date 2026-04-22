import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";
import { getLocalPracticeIdentity } from "./local-practice-identity";
import { usePracticeModeStore } from "./practice-store";
import { useStatisticsStore } from "./statistics-store";

function getLocalUserId() {
  return getLocalPracticeIdentity()?.id;
}

export function useTestResults() {
  const localUserId = getLocalUserId();
  const results = useQuery(api.functions.getAllTestResults, { localUserId });
  const setTestResults = useStatisticsStore((state) => state.setTestResults);

  useEffect(() => {
    if (results !== undefined) {
      setTestResults(results || []);
    }
  }, [results, setTestResults]);

  return {
    data: results,
    isLoading: results === undefined,
    error: null,
  };
}

export function useAddTestResult() {
  const mutation = useMutation(api.functions.addTestResult);
  const localUserId = getLocalUserId();

  return async (args: {
    mode: "practice" | "algorithm";
    wpm: number;
    accuracy: number;
    timeElapsed: number;
    correctChars: number;
    totalChars: number;
    errors: number;
    textPreview: string;
    algorithmName?: string;
  }) => {
    return mutation({
      ...args,
      localUserId,
    });
  };
}

export function useClearStatistics() {
  const mutation = useMutation(api.functions.clearAllStatistics);
  const localUserId = getLocalUserId();

  return async () => {
    return mutation({ localUserId });
  };
}

export function useUserSettings() {
  const localUserId = getLocalUserId();
  const settings = useQuery(api.functions.getUserSettings, { localUserId });
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
    error: null,
  };
}

export function useUpdatePracticeMode() {
  const mutation = useMutation(api.functions.updatePracticeMode);
  const setMode = usePracticeModeStore((state) => state.setMode);
  const localUserId = getLocalUserId();

  return async (mode: "practice" | "algorithm") => {
    setMode(mode);
    await mutation({ practiceMode: mode, localUserId });
  };
}

export function useUpdateTypingMode() {
  const mutation = useMutation(api.functions.updateTypingMode);
  const setTypingMode = usePracticeModeStore((state) => state.setTypingMode);
  const localUserId = getLocalUserId();

  return async (mode: "input" | "typing") => {
    setTypingMode(mode);
    await mutation({ typingMode: mode, localUserId });
  };
}
