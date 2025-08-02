// src/components/typing-text-area.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Play, RotateCcw, Trash2, CheckCircle } from "lucide-react";
import type { TypingStats } from "./typing-stats";
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
  const renderWithCursor = () => {
    const nodes: React.ReactNode[] = [];
    const chars = referenceText.split("");

    chars.forEach((char, idx) => {
      // Add cursor before the current character
      if (idx === currentIndex && !isCompleted) {
        nodes.push(
          <span
            key={`cursor-${idx}`}
            className="inline-block align-text-bottom border-l-2 border-primary"
            style={{
              height: "1.2em",
              animation: "blink 1s step-end infinite",
              marginRight: "1px",
            }}
          />
        );
      }

      // Handle different character types
      let className = "text-muted-foreground";
      if (idx < typedText.length) {
        className =
          typedText[idx] === char
            ? "text-primary"
            : "text-destructive bg-destructive/10 rounded-sm";
      }

      // Preserve all whitespace characters
      let displayChar: React.ReactNode = char;
      if (char === " ") {
        displayChar = "\u00A0"; // Non-breaking space
      } else if (char === "\t") {
        displayChar = "\u00A0\u00A0"; // Tab as 2 non-breaking spaces
      } else if (char === "\n") {
        // Handle newlines by adding a line break
        nodes.push(<br key={`br-${idx}`} />);
        return; // Skip adding the span for newline
      }

      nodes.push(
        <span
          key={idx}
          className={cn("font-mono tracking-wide transition-colors", className)}
          style={{ whiteSpace: "pre" }} // Preserve whitespace
        >
          {displayChar}
        </span>
      );
    });

    // Add cursor at the end if we've reached the end
    if (currentIndex >= referenceText.length && !isCompleted) {
      nodes.push(
        <span
          key="cursor-end"
          className="inline-block align-text-bottom border-l-2 border-primary"
          style={{
            height: "1.2em",
            animation: "blink 1s step-end infinite",
            marginRight: "1px",
          }}
        />
      );
    }

    if (isCompleted) {
      nodes.push(
        <span key="completed" className="ml-2 text-primary">
          <CheckCircle className="inline-block w-4 h-4" />
        </span>
      );
    }

    return nodes;
  };

  return (
    <Card>
      <CardContent className="px-4 sm:px-6">
        {mode === "input" ? (
          <>
            <Textarea
              placeholder="Paste your text or code here to practice typing..."
              className="font-mono resize-none h-[350px] tracking-wide"
              value={referenceText}
              style={{ scrollbarWidth: "none" }}
              spellCheck={false}
              onChange={(e) => onReferenceTextChange(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                type="button"
                onClick={onStartTyping}
                disabled={!referenceText.trim()}
                className="flex items-center gap-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90"
              >
                <Play className="w-4 h-4" />
                Start Typing
              </Button>

              {referenceText && (
                <Button
                  type="button"
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
              <ScrollArea
                className={cn(
                  // Base textarea styles from shadcn
                  "h-[350px] border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                  // Typing-specific overrides
                  "font-mono resize-none select-none overflow-auto break-words leading-relaxed focus-within:border-primary/50"
                )}
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {renderWithCursor()}
              </ScrollArea>

              {isCompleted && (
                <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center p-6 bg-background/80 rounded-lg border shadow-lg">
                    <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">
                      Congratulations!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You completed the typing exercise
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Badge variant="secondary">{stats.wpm} WPM</Badge>
                      <Badge variant="secondary">
                        {stats.accuracy}% Accuracy
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onResetTyping}
                className="flex items-center gap-2 flex-1 sm:flex-none"
              >
                <RotateCcw className="w-4 h-4" />
                Reset / Change Text
              </Button>

              {isCompleted && (
                <Button
                  type="button"
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
    </Card>
  );
}
