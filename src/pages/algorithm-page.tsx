import { useEffect } from "react";
import { TypingOverlay } from "@/components/typing-overlay";
import { usePracticeModeStore } from "@/lib/practice-store";
import { useUpdatePracticeMode } from "@/lib/convex-hooks";

export function AlgorithmPage() {
  const { mode } = usePracticeModeStore();
  const updatePracticeMode = useUpdatePracticeMode();

  useEffect(() => {
    if (mode !== 'algorithm') {
      updatePracticeMode('algorithm').catch((error) => {
        console.error("Failed to update practice mode:", error);
      });
    }
  }, [mode, updatePracticeMode]);

  return <TypingOverlay />;
}

