"use client";

import { Target, Timer, TrendingUp, XCircle } from "lucide-react";

export interface TypingStats {
  accuracy: number;
  wpm: number;
  timeElapsed: number;
  correctChars: number;
  totalChars: number;
  errors: number;
}

interface LiveStatsFooterProps {
  stats: TypingStats;
  show?: boolean;
}

export function LiveStatsFooter({ stats, show = true }: LiveStatsFooterProps) {
  if (!show) return null;

  return (
    <footer className="h-16 sticky bottom-0 z-50 w-full border-t bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex gap-4">

          <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 w-1/4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">WPM</span>
            </div>
            <div className="text-lg font-bold text-blue-400">{stats.wpm}</div>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 w-1/4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <div className="text-lg font-bold text-green-400">
              {stats.accuracy}%
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 w-1/4">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {Math.floor(stats.timeElapsed)}s
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 w-1/4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium">Errors</span>
            </div>
            <div className="text-lg font-bold text-destructive">
              {stats.errors}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
