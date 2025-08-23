// src/components/typing-stats.tsx
"use client";

import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  progress: number;
  currentIndex: number;
  totalChars: number;
}

export function ProgressCard({
  progress,
  currentIndex,
  totalChars,
}: ProgressCardProps) {
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
