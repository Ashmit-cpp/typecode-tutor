"use client";

import { Lightbulb } from "lucide-react";

interface TypingTipsFooterProps {
  show?: boolean;
}

export function TypingTipsFooter({ show = true }: TypingTipsFooterProps) {
  if (!show) return null;

  return (
    <footer className="h-16 sticky bottom-0 z-50 w-full border-t bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="text-muted-foreground whitespace-nowrap">
          <ul className="flex flex-col sm:flex-row gap-2 sm:gap-8 lg:gap-12 list-disc [&>li]:mt-1 text-sm px-4 sm:px-0">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold  whitespace-nowrap">Typing Tips</h3>
            </div>
            <li>Keep your fingers on home row</li>
            <li>Don't look at the keyboard</li>
            <li>Focus on accuracy over speed</li>
            <li>Use Tab key for 2 spaces</li>
            <li>Take breaks to avoid fatigue</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
