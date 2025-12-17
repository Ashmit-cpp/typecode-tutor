import { useEffect } from "react";
import { TypingOverlay } from "@/components/typing-overlay";
import { usePracticeModeStore } from "@/lib/practice-store";
import { useUpdatePracticeMode } from "@/lib/convex-hooks";

export function PracticePage() {
  const { mode } = usePracticeModeStore();
  const updatePracticeMode = useUpdatePracticeMode();

  useEffect(() => {
    if (mode !== 'practice') {
      updatePracticeMode('practice').catch((error) => {
        console.error("Failed to update practice mode:", error);
      });
    }
  }, [mode, updatePracticeMode]);

  return <TypingOverlay />;
}

