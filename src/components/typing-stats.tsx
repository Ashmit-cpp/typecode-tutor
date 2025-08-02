// src/components/typing-stats.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Timer,
  TrendingUp,
  XCircle,
} from "lucide-react";

export interface TypingStats {
  accuracy: number;
  wpm: number;
  timeElapsed: number;
  correctChars: number;
  totalChars: number;
  errors: number;
}

interface TypingStatsProps {
  stats: TypingStats;
  mode: "input" | "typing";
  progress: number;
  currentIndex: number;
  totalChars: number;
  isCompleted: boolean;
}

export function TypingStatsDisplay({ 
  stats, 
  mode, 
}: TypingStatsProps) {
  if (mode === "typing") {
    return (
      <Card>
        <CardContent className="px-4">
          <h3 className="text-sm font-medium mb-3">Live Stats</h3>
          <div className="flex gap-4">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 w-1/4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">WPM</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {stats.wpm}
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 w-1/4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Accuracy</span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {stats.accuracy}%
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 w-1/4">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <div className="text-lg font-bold text-primary">
                {Math.floor(stats.timeElapsed)}s
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 w-1/4">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">Errors</span>
              </div>
              <div className="text-lg font-bold text-destructive">
                {stats.errors}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="px-4">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
          <Target className="w-4 h-4 text-primary" />
          Typing Tips
        </h3>
        <div className="flex flex-row gap-8 text-sm text-muted-foreground px-4">
          <ul className="space-y-1 list-disc [&>li]:mt-2">
            <li>Keep your fingers on home row</li>
            <li>Don't look at the keyboard</li>
          </ul>
          <ul className="space-y-1 list-disc [&>li]:mt-2">
            <li>Focus on accuracy over speed</li>
            <li>Take breaks to avoid fatigue</li>
          </ul>
          <ul className="space-y-1 list-disc [&>li]:mt-2">
            <li>Use Tab key for 2 spaces</li>
            <li>Practice regularly for improvement</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProgressCardProps {
  progress: number;
  currentIndex: number;
  totalChars: number;
}

export function ProgressCard({ progress, currentIndex, totalChars }: ProgressCardProps) {
  return (
    <CardContent className="w-full">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-xs text-muted-foreground">
            {currentIndex} / {totalChars}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-xs text-muted-foreground text-center">
          {Math.round(progress)}% Complete
        </div>
      </div>
    </CardContent>
  );
}