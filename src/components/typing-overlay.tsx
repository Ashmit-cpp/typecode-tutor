// src/components/typing-overlay.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SAMPLE_TEXTS } from "@/lib/sample-text";
import { Target, Shuffle } from "lucide-react";
import { TypingTextArea } from "./typing-text-area";
import { TypingStatsDisplay, ProgressCard } from "./typing-stats";
import type { TypingStats } from "./typing-stats";
import { usePracticeModeStore } from "@/lib/practice-store";
import { getRandomAlgorithm } from "@/lib/algo-helper";

type Mode = "input" | "typing";

export function TypingOverlay() {
  const [mode, setMode] = useState<Mode>("input");
  const [referenceText, setReferenceText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { mode: practiceMode } = usePracticeModeStore();

  // Calculate typing statistics
  const stats = useMemo((): TypingStats => {
    const correctChars = typedText
      .split("")
      .filter((char, idx) => char === referenceText[idx]).length;
    const totalChars = typedText.length;
    const errors = totalChars - correctChars;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;

    const timeElapsed = startTime
      ? (Date.now() - startTime.getTime()) / 1000 / 60
      : 0; // in minutes
    const wpm =
      timeElapsed > 0 ? Math.round(correctChars / 5 / timeElapsed) : 0;

    return {
      accuracy: Math.round(accuracy),
      wpm,
      timeElapsed: timeElapsed * 60, // convert back to seconds for display
      correctChars,
      totalChars,
      errors,
    };
  }, [typedText, referenceText, startTime]);

  const progress =
    referenceText.length > 0 ? (currentIndex / referenceText.length) * 100 : 0;

  useEffect(() => {
    if (mode === "typing") {
      (document.activeElement as HTMLElement)?.blur();
      if (!startTime) {
        setStartTime(new Date());
      }
    }
  }, [mode, startTime]);

  useEffect(() => {
    if (
      currentIndex >= referenceText.length &&
      referenceText.length > 0 &&
      mode === "typing"
    ) {
      setIsCompleted(true);
    }
  }, [currentIndex, referenceText.length, mode]);

  useEffect(() => {
    if (mode !== "typing") return;

    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();

      if (isCompleted) return;

      if (e.key === "Backspace") {
        setTypedText((t) => t.slice(0, -1));
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        setTypedText((t) => t + "\n");
        setCurrentIndex((i) => i + 1);
      } else if (e.key === "Tab") {
        // Convert Tab to 2 spaces (IDE-like behavior)
        const spaces = "  ";
        setTypedText((t) => t + spaces);
        setCurrentIndex((i) => i + spaces.length);
      } else if (e.key.length === 1) {
        setTypedText((t) => t + e.key);
        setCurrentIndex((i) => i + 1);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, isCompleted]);

  const pickRandom = () => {
    if (practiceMode === 'algorithm') {
      const algorithmText = getRandomAlgorithm();
      setReferenceText(algorithmText);
    } else {
      const randomText =
        SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
      setReferenceText(randomText);
    }
  };

  const clearText = () => setReferenceText("");

  const resetTyping = () => {
    setMode("input");
    setTypedText("");
    setCurrentIndex(0);
    setStartTime(null);
    setIsCompleted(false);
  };

  const startTyping = () => {
    if (referenceText.trim()) {
      setTypedText("");
      setCurrentIndex(0);
      setStartTime(null);
      setIsCompleted(false);
      setMode("typing");
    }
  };

  const tryAgain = () => {
    setTypedText("");
    setCurrentIndex(0);
    setStartTime(null);
    setIsCompleted(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <div className="max-w-9/12 mx-auto space-y-6">
        {/* Header Card */}
        <Card className="" >
          {mode === "input" ? (
            <div className="flex flex-col lg:flex-row justify-between w-full items-center py-2">
              <CardHeader className="flex flex-row justify-between w-full">
                <CardTitle className="flex flex-col items-start gap-0 text-lg sm:text-xl">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Setup Your {practiceMode === 'algorithm' ? 'Algorithm' : 'Practice'} Session
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {practiceMode === 'algorithm' 
                        ? 'Generate algorithm code or enter your own to practice typing programming concepts'
                        : 'Enter your text or generate random content to start practicing'
                      }
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-md font-semibold mb-1">Quick Start</h3>
                <div className="space-y-1">
                  <Button
                    size="sm"
                    onClick={pickRandom}
                    className="w-full justify-start"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    {practiceMode === 'algorithm' ? 'Generate Algorithm Code' : 'Generate Sample Text'}
                  </Button>
                </div>
              </CardContent>
            </div>
          ) : (
            <ProgressCard
              progress={progress}
              currentIndex={currentIndex}
              totalChars={referenceText.length}
            />
          )}

        {/* Text Area */}
        <TypingTextArea
          mode={mode}
          referenceText={referenceText}
          typedText={typedText}
          currentIndex={currentIndex}
          isCompleted={isCompleted}
          stats={stats}
          onReferenceTextChange={setReferenceText}
          onStartTyping={startTyping}
          onResetTyping={resetTyping}
          onClearText={clearText}
          onTryAgain={tryAgain}
        />
        </Card>

        {/* Stats Display */}
        <TypingStatsDisplay
          stats={stats}
          mode={mode}
          progress={progress}
          currentIndex={currentIndex}
          totalChars={referenceText.length}
          isCompleted={isCompleted}
        />
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}