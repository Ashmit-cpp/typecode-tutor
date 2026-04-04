import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import type { Id } from "../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Trophy, Swords, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGame,
  useUpdateGameProgress,
  useSurrender,
  useLeaveGame,
} from "@/lib/game-hooks";
import {
  glassCardClassName,
  glassGhostButton,
  glassPrimaryButton,
} from "@/lib/glass-styles";
import { cn } from "@/lib/utils";

interface TypingStats {
  wpm: number;
  accuracy: number;
  errorCount: number;
  progress: number;
}

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const gameConvexId = gameId ? (gameId as Id<"games">) : undefined;
  const game = useGame(gameConvexId);
  const updateProgress = useUpdateGameProgress();
  const leaveGame = useLeaveGame();
  const surrender = useSurrender();

  // Typing state
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const referenceText = game?.text ?? "";
  const isPlayer1 = game?.player1.id === user?.id;
  const isPlayer2 = game?.player2?.id === user?.id;
  const currentPlayer = isPlayer1 ? game?.player1 : game?.player2;
  const opponent = isPlayer1 ? game?.player2 : game?.player1;

  // Calculate typing statistics
  const stats = useMemo((): TypingStats => {
    const correctChars = typedText
      .split("")
      .filter((char, idx) => char === referenceText[idx]).length;
    const totalChars = typedText.length;
    const errors = totalChars - correctChars;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;

    const timeElapsed = startTime
      ? (Date.now() - startTime.getTime()) / 1000 / 60
      : 0;
    const wpm = timeElapsed > 0 ? Math.round(correctChars / 5 / timeElapsed) : 0;

    const progress = referenceText.length > 0 
      ? (currentIndex / referenceText.length) * 100 
      : 0;

    return {
      wpm,
      accuracy: Math.round(accuracy),
      errorCount: errors,
      progress: Math.min(100, Math.round(progress)),
    };
  }, [typedText, referenceText, startTime, currentIndex]);

  // Send progress updates to backend
  useEffect(() => {
    if (
      !gameConvexId ||
      game?.status !== "active" ||
      !user ||
      !(isPlayer1 || isPlayer2) ||
      !startTime
    ) {
      return;
    }

    const interval = setInterval(() => {
      updateProgress({
        gameId: gameConvexId,
        userId: user.id,
        currentPosition: currentIndex,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errorCount: stats.errorCount,
        completed: isCompleted,
      }).catch((error) => {
        console.error("Failed to update progress:", error);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [
    gameConvexId,
    game?.status,
    user,
    isPlayer1,
    isPlayer2,
    currentIndex,
    stats,
    isCompleted,
    startTime,
    updateProgress,
  ]);

  // Handle typing when game is active
  useEffect(() => {
    if (game?.status !== "active" || isCompleted) return;

    const handleKey = (e: KeyboardEvent) => {
      // Start timer on first keypress
      if (!startTime) {
        setStartTime(new Date());
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        setTypedText((t) => t.slice(0, -1));
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        setTypedText((t) => t + "\n");
        setCurrentIndex((i) => i + 1);
      } else if (e.key === "Tab") {
        e.preventDefault();
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
  }, [game?.status, isCompleted, startTime]);

  // Check for completion
  useEffect(() => {
    if (
      currentIndex >= referenceText.length &&
      referenceText.length > 0 &&
      game?.status === "active" &&
      !isCompleted
    ) {
      setIsCompleted(true);
    }
  }, [currentIndex, referenceText.length, game?.status, isCompleted]);

  async function handleLeaveGame() {
    if (!gameConvexId) return;
    try {
      await leaveGame({ gameId: gameConvexId });
      navigate("/duels");
    } catch (error) {
      console.error("Failed to leave game:", error);
    }
  }

  async function handleSurrender() {
    if (!gameConvexId || !user) return;
    try {
      await surrender({ gameId: gameConvexId, userId: user.id });
      navigate("/duels");
    } catch (error) {
      console.error("Failed to surrender:", error);
    }
  }

  if (!gameId) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-6 sm:p-6">
        <Card className={glassCardClassName("w-full max-w-md")}>
          <CardHeader>
            <CardTitle>Invalid game link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This URL does not include a valid game id.
            </p>
            <Button
              className={cn("rounded-[var(--radius)]", glassPrimaryButton)}
              onClick={() => navigate("/duels")}
            >
              Back to Duels
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (game === undefined) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-6">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  // Game not found
  if (game === null) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-6 sm:p-6">
        <Card className={glassCardClassName("w-full max-w-md")}>
          <CardHeader>
            <CardTitle>Game Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This game does not exist or has been deleted.
            </p>
            <Button
              className={cn("rounded-[var(--radius)]", glassPrimaryButton)}
              onClick={() => navigate("/duels")}
            >
              Back to Duels
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Waiting for opponent
  if (game.status === "waiting") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-6 sm:p-6">
        <Card className={glassCardClassName("w-full max-w-2xl p-4")}>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Waiting for Opponent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <Swords className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            </div>

            <div className="space-y-2 text-center">
              <p className="text-muted-foreground">
                Finding a worthy opponent...
              </p>
              <p className="text-sm text-muted-foreground">
                Player:{" "}
                <span className="font-mono text-foreground">
                  {game.player1.name}
                </span>
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                Text Preview
              </h3>
              <div className="max-h-40 overflow-y-auto rounded bg-muted p-4 font-mono text-sm">
                {referenceText}
              </div>
            </div>

            <Button
              variant="outline"
              className={cn("w-full rounded-[var(--radius)]", glassGhostButton)}
              onClick={handleLeaveGame}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game finished
  if (game.status === "finished") {
    const won = game.winnerId === user?.id;
    const player1Stats = game.player1;
    const player2Stats = game.player2!;

    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-6 sm:p-6">
        <Card className={glassCardClassName("w-full max-w-3xl p-8")}>
          <CardHeader>
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1">
                <Trophy
                  className={`h-5 w-5 ${won ? "text-yellow-500" : "text-muted-foreground"}`}
                />
                <span className="text-lg font-bold">
                  {won ? "VICTORY!" : "DEFEAT"}
                </span>
              </div>
              <CardTitle className="text-3xl">
                {won ? "Congratulations!" : "Better luck next time!"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Player Stats Comparison */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Player 1 */}
              <Card
                className={cn(
                  glassCardClassName("shadow-none"),
                  player1Stats.id === game.winnerId && "border-primary/50",
                )}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{player1Stats.name}</span>
                    {player1Stats.id === game.winnerId && (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WPM:</span>
                    <span className="font-mono font-bold">{player1Stats.wpm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="font-mono">{player1Stats.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Errors:</span>
                    <span className="font-mono">{player1Stats.errorCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-mono">{player1Stats.progress}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Player 2 */}
              <Card
                className={cn(
                  glassCardClassName("shadow-none"),
                  player2Stats.id === game.winnerId && "border-primary/50",
                )}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{player2Stats.name}</span>
                    {player2Stats.id === game.winnerId && (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WPM:</span>
                    <span className="font-mono font-bold">{player2Stats.wpm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="font-mono">{player2Stats.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Errors:</span>
                    <span className="font-mono">{player2Stats.errorCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-mono">{player2Stats.progress}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button
                className={cn("flex-1 rounded-[var(--radius)]", glassPrimaryButton)}
                onClick={() => navigate("/duels")}
              >
                Find Another Match
              </Button>
              <Button
                variant="outline"
                className={cn("rounded-[var(--radius)]", glassGhostButton)}
                onClick={() => navigate("/statistics")}
              >
                View Statistics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active game
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Player Progress Bars */}
        <Card className={glassCardClassName()}>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Current Player */}
              <div>
                <div className="mb-2 flex justify-between font-mono text-sm">
                  <span className="font-bold text-primary">
                    YOU ({currentPlayer?.name})
                  </span>
                  <span className="text-muted-foreground">
                    {stats.wpm} WPM • {stats.accuracy}% • {stats.progress}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-border bg-background/40">
                  <motion.div
                    className="h-full bg-primary"
                    style={{ width: `${stats.progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>

              <Separator />

              {/* Opponent */}
              <div>
                <div className="mb-2 flex justify-between font-mono text-sm">
                  <span className="font-bold text-destructive">
                    OPPONENT ({opponent?.name})
                  </span>
                  <span className="text-muted-foreground">
                    {opponent?.wpm ?? 0} WPM • {opponent?.accuracy ?? 100}% •{" "}
                    {opponent?.progress ?? 0}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-border bg-background/40">
                  <motion.div
                    className="h-full bg-destructive"
                    style={{ width: `${opponent?.progress ?? 0}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typing Area */}
        <Card className={glassCardClassName()}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono text-sm uppercase text-muted-foreground">
                Type the text below
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className={cn("rounded-[var(--radius)]", glassGhostButton)}
                onClick={handleSurrender}
              >
                Surrender
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[400px] rounded bg-muted p-6 font-mono text-base leading-relaxed whitespace-pre-wrap">
              {referenceText.split("").map((char: string, idx: number) => {
                let className = "text-muted-foreground";
                
                if (idx < typedText.length) {
                  className =
                    typedText[idx] === char
                      ? "text-foreground"
                      : "text-destructive bg-destructive/20";
                }
                
                if (idx === currentIndex) {
                  className += " relative";
                }

                return (
                  <span key={idx} className={className}>
                    {char}
                    {idx === currentIndex && (
                      <span className="absolute left-0 top-0 w-0.5 h-full bg-primary animate-pulse" />
                    )}
                  </span>
                );
              })}
            </div>

            {isCompleted && (
              <div className="mt-4 rounded border border-primary bg-primary/10 p-4 text-center">
                <p className="font-semibold text-primary">
                  ✓ Completed! Waiting for opponent...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

