"use client";

import { useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Play, RotateCcw, Trash2, CheckCircle } from "lucide-react";
import type { TypingStats } from "./typing-stats";
import { CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface TypingTextAreaProps {
  mode: "input" | "typing";
  referenceText: string;
  typedText: string;
  currentIndex: number;
  isCompleted: boolean;
  stats: TypingStats;
  onReferenceTextChange: (text: string) => void;
  onStartTyping: () => void;
  onResetTyping: () => void;
  onClearText: () => void;
  onTryAgain: () => void;
}

export function TypingTextArea({
  mode,
  referenceText,
  typedText,
  currentIndex,
  isCompleted,
  stats,
  onReferenceTextChange,
  onStartTyping,
  onResetTyping,
  onClearText,
  onTryAgain,
}: TypingTextAreaProps) {
  // Simple refs for container and cursor
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Simple auto-scroll to keep cursor centered
  useLayoutEffect(() => {
    if (!containerRef.current || !cursorRef.current || mode !== "typing") return;

    const container = containerRef.current;
    const cursor = cursorRef.current;

    // Get positions
    const containerHeight = 400; // We know this is 400px
    const containerCenter = containerHeight / 2; // 200px
    
    const cursorRect = cursor.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate cursor position relative to container
    const cursorRelativeTop = cursorRect.top - containerRect.top + container.scrollTop;
    
    // Calculate where cursor currently appears in the viewport
    const cursorViewportPosition = cursorRelativeTop - container.scrollTop;
    
    // If cursor is not in the center zone (150px to 250px), scroll to center it
    if (cursorViewportPosition < 150 || cursorViewportPosition > 250) {
      const targetScrollTop = cursorRelativeTop - containerCenter;
      container.scrollTop = Math.max(0, targetScrollTop);
    }
  }, [currentIndex, mode]);

  // Render text with cursor
  const renderWithCursor = () => {
    const nodes: React.ReactNode[] = [];
    const chars = referenceText.split("");

    chars.forEach((char, idx) => {
      // Add cursor at current position
      if (idx === currentIndex && !isCompleted) {
        nodes.push(
          <span
            key={`cursor-${idx}`}
            ref={cursorRef}
            className="inline-block align-text-bottom border-l-2 border-primary animate-pulse"
            style={{
              height: "1.2em",
              marginRight: "1px",
            }}
          />
        );
      }

      // Determine character styling
      let className = "text-muted-foreground";
      if (idx < typedText.length) {
        className = typedText[idx] === char
          ? "text-primary"
          : "text-red-400 bg-red-400/10 rounded-sm px-0.5";
      }

      // Handle special characters
      let displayChar: React.ReactNode = char;
      if (char === " ") {
        displayChar = "\u00A0"; // Non-breaking space
      } else if (char === "\t") {
        displayChar = "\u00A0\u00A0"; // Two spaces for tab
      } else if (char === "\n") {
        nodes.push(<br key={`br-${idx}`} />);
        return;
      }

      nodes.push(
        <span
          key={idx}
          className={cn(
            "font-mono tracking-wide transition-colors duration-150 text-lg",
            className
          )}
        >
          {displayChar}
        </span>
      );
    });

    // Add cursor at end if we've reached the end
    if (currentIndex >= referenceText.length && !isCompleted) {
      nodes.push(
        <span
          key="cursor-end"
          ref={cursorRef}
          className="inline-block align-text-bottom border-l-2 border-primary animate-pulse"
          style={{
            height: "1.2em",
            marginRight: "1px",
          }}
        />
      );
    }

    // Add completion indicator
    if (isCompleted) {
      nodes.push(
        <span key="completed" className="ml-2 text-green-500">
          <CheckCircle className="inline-block w-5 h-5" />
        </span>
      );
    }

    return nodes;
  };

  return (
    <CardContent className="px-4 sm:px-6 flex flex-col gap-4">
      {mode === "input" ? (
        <>
          <Textarea
            placeholder="Paste your text or code here to practice typing..."
            className="font-mono resize-none h-[400px] tracking-wide text-lg"
            value={referenceText}
            style={{ scrollbarWidth: "none" }}
            spellCheck={false}
            onChange={(e) => onReferenceTextChange(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onStartTyping}
              disabled={!referenceText.trim()}
              className="flex items-center gap-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4" />
              Start Typing
            </Button>
            {referenceText && (
              <Button
                variant="outline"
                onClick={onClearText}
                className="flex items-center gap-2 flex-1 sm:flex-none"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <div
              ref={containerRef}
              className={cn(
                "h-[400px] w-full rounded-md border border-input bg-transparent px-4 py-3",
                "font-mono text-lg leading-relaxed overflow-auto",
                "focus-within:border-primary/50 transition-colors",
              )}
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                scrollBehavior: "smooth",
                scrollbarWidth: "none"
              }}
            >
              {renderWithCursor()}
            </div>

            {isCompleted && (
              <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <div className="text-center p-6 bg-background/90 rounded-lg border shadow-lg">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">
                    Excellent Work!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You completed the typing exercise
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {stats.wpm} WPM
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {stats.accuracy}% Accuracy
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onResetTyping}
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <RotateCcw className="w-4 h-4" />
              Reset / Change Text
            </Button>
            {isCompleted && (
              <Button
                onClick={onTryAgain}
                className="flex items-center gap-2 flex-1 sm:flex-none"
              >
                <Play className="w-4 h-4" />
                Try Again
              </Button>
            )}
          </div>
        </>
      )}
    </CardContent>
  );
}