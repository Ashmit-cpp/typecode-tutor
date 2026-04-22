// src/components/typing-overlay.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { glass, glassCardClassName, glassGhostButton, glassPrimaryButton } from "@/lib/glass-styles";
import { cn } from "@/lib/utils";
import { SAMPLE_TEXTS } from "@/lib/sample-text";
import { ArrowLeft, Keyboard, Shuffle } from "lucide-react";
import { TypingTextArea } from "./typing-text-area";
import { ProgressCard } from "./typing-stats";
import { usePracticeModeStore } from "@/lib/practice-store";
import { getRandomAlgorithm } from "@/lib/algo-helper";
import { useStatsStore } from "@/lib/stats-store";
import type { TypingStats } from "@/lib/stats-store";
import { useAddTestResult, useUpdateTypingMode } from "@/lib/convex-hooks";
import { useCreateBotPracticeGame } from "@/lib/game-hooks";
import { getLocalPracticeIdentity } from "@/lib/local-practice-identity";

export function TypingOverlay() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [referenceText, setReferenceText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentAlgorithmName, setCurrentAlgorithmName] = useState<string | null>(null);
  const { mode: practiceMode, typingMode, setMode } = usePracticeModeStore();
  const addTestResult = useAddTestResult();
  const createBotPracticeGame = useCreateBotPracticeGame();
  const updateTypingMode = useUpdateTypingMode();
  const { setStats } = useStatsStore();
  const localPracticeIdentity = useMemo(() => getLocalPracticeIdentity(), []);

  const practicePlayerId = user?.id ?? localPracticeIdentity?.id;
  const practicePlayerName =
    user?.fullName ??
    user?.firstName ??
    localPracticeIdentity?.name ??
    "Local Runner";

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

  // Update stats store whenever stats change
  useEffect(() => {
    setStats(stats);
  }, [stats, setStats]);

  useEffect(() => {
    if (typingMode === "typing") {
      (document.activeElement as HTMLElement)?.blur();
      if (!startTime) {
        setStartTime(new Date());
      }
    }
  }, [typingMode, startTime]);

  useEffect(() => {
    if (
      currentIndex >= referenceText.length &&
      referenceText.length > 0 &&
      typingMode === "typing" &&
      !isCompleted
    ) {
      setIsCompleted(true);
      
      // Save test result to Convex
      const textPreview = referenceText.slice(0, 50);
      addTestResult({
        mode: practiceMode,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        timeElapsed: stats.timeElapsed,
        correctChars: stats.correctChars,
        totalChars: stats.totalChars,
        errors: stats.errors,
        textPreview,
        algorithmName: practiceMode === 'algorithm' ? currentAlgorithmName || undefined : undefined,
      }).catch((error) => {
        console.error("Failed to save test result:", error);
      });
    }
  }, [currentIndex, referenceText.length, typingMode, isCompleted, practiceMode, currentAlgorithmName, stats, addTestResult, referenceText]);

  useEffect(() => {
    if (typingMode !== "typing") return;

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
  }, [typingMode, isCompleted]);

  const pickRandom = () => {
    if (practiceMode === 'algorithm') {
      const algorithmResult = getRandomAlgorithm();
      setReferenceText(algorithmResult.code);
      setCurrentAlgorithmName(algorithmResult.name);
    } else {
      const randomText =
        SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
      setReferenceText(randomText);
      setCurrentAlgorithmName(null);
    }
  };

  const clearText = () => {
    setReferenceText("");
    setCurrentAlgorithmName(null);
  };

  const resetTyping = () => {
    updateTypingMode("input").catch((error) => {
      console.error("Failed to update typing mode:", error);
    });
    setTypedText("");
    setCurrentIndex(0);
    setStartTime(null);
    setIsCompleted(false);
    setCurrentAlgorithmName(null);
    setStats(null);
  };

  const startTyping = () => {
    if (referenceText.trim()) {
      setTypedText("");
      setCurrentIndex(0);
      setStartTime(null);
      setIsCompleted(false);
      updateTypingMode("typing").catch((error) => {
        console.error("Failed to update typing mode:", error);
      });
    }
  };

  const tryAgain = () => {
    setTypedText("");
    setCurrentIndex(0);
    setStartTime(null);
    setIsCompleted(false);
    updateTypingMode("input").catch((error) => {
      console.error("Failed to update typing mode:", error);
    });
    setStats(null);
  };

  const startBotPractice = async () => {
    if (!referenceText.trim() || !practicePlayerId) {
      return;
    }

    try {
      const { gameId } = await createBotPracticeGame({
        playerId: practicePlayerId,
        playerName: practicePlayerName,
        text: referenceText,
        practiceMode,
        algorithmName:
          practiceMode === "algorithm"
            ? currentAlgorithmName ?? undefined
            : undefined,
      });

      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Failed to create bot practice game:", error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "kc-page-hero-icon-wrap mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[var(--radius)] border",
            )}
            aria-hidden
          >
            <Keyboard className="kc-page-hero-icon size-5" />
          </div>
          <div>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Practice
            </h1>
            <p className="kc-page-hero-subtitle mt-1 font-mono text-sm">
              Solo typing drills, text or algorithm snippets.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          asChild
          className={cn(
            "w-full shrink-0 rounded-[var(--radius)] font-mono text-xs uppercase tracking-widest sm:w-auto",
            glassGhostButton,
          )}
        >
          <Link to="/statistics" className="inline-flex items-center justify-center gap-2">
            <ArrowLeft className="size-4" />
            Statistics
          </Link>
        </Button>
      </div>

      <Card className={glassCardClassName()}>
          {typingMode === "input" ? (
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              <CardHeader className="flex-1">
                <div>
                  <CardTitle className="mb-3 block font-sans text-lg font-semibold tracking-tight text-foreground">
                    Mode
                  </CardTitle>
                  <Select value={practiceMode} onValueChange={(value: 'practice' | 'algorithm') => setMode(value)}>
                    <SelectTrigger
                      className={cn("w-full max-w-xs", glass.panelSubtle)}
                    >
                      <SelectValue placeholder="Select practice mode" />
                    </SelectTrigger>
                    <SelectContent
                      className={cn("rounded-[var(--radius)] border-0 shadow-none", glass.popover)}
                    >
                      <SelectItem value="practice">Practice Text</SelectItem>
                      <SelectItem value="algorithm">Algorithm Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription className="mt-2 text-sm sm:text-base">
                  {practiceMode === "algorithm"
                    ? "Generate algorithm code or enter your own to practice typing programming concepts."
                    : "Enter your text or generate random content to start practicing."}
                </CardDescription>
              </CardHeader>
              <CardContent className="lg:self-center">
                <h3 className="mb-3 font-sans text-sm font-semibold text-muted-foreground">
                  Quick start
                </h3>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    onClick={pickRandom}
                    className={cn(
                      "w-full justify-start rounded-[var(--radius)]",
                      glassPrimaryButton,
                    )}
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
          mode={typingMode}
          referenceText={referenceText}
          typedText={typedText}
          currentIndex={currentIndex}
          isCompleted={isCompleted}
          stats={stats}
          onReferenceTextChange={setReferenceText}
          onStartTyping={startTyping}
          onStartBotMatch={startBotPractice}
          onResetTyping={resetTyping}
          onClearText={clearText}
          onTryAgain={tryAgain}
        />
      </Card>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
