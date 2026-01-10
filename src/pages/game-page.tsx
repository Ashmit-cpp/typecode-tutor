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
  const game = useGame(gameId as Id<"games">);
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
      game?.status === "active" &&
      user &&
      (isPlayer1 || isPlayer2) &&
      startTime
    ) {
      const interval = setInterval(() => {
        updateProgress({
          gameId: gameId as Id<"games">,
          userId: user.id,
          currentPosition: currentIndex,
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          errorCount: stats.errorCount,
          completed: isCompleted,
        }).catch((error) => {
          console.error("Failed to update progress:", error);
        });
      }, 500); // Update every 500ms

      return () => clearInterval(interval);
    }
  }, [
    game?.status,
    user,
    isPlayer1,
    isPlayer2,
    gameId,
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
    if (!gameId) return;
    try {
      await leaveGame({ gameId: gameId as Id<"games"> });
      navigate("/duels");
    } catch (error) {
      console.error("Failed to leave game:", error);
    }
  }

  async function handleSurrender() {
    if (!gameId || !user) return;
    try {
      await surrender({ gameId: gameId as Id<"games">, userId: user.id });
      navigate("/duels");
    } catch (error) {
      console.error("Failed to surrender:", error);
    }
  }

  // Loading state
  if (game === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

  // Game not found
  if (game === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Game Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This game does not exist or has been deleted.
            </p>
            <Button onClick={() => navigate("/duels")}>Back to Duels</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Waiting for opponent
  if (game.status === "waiting") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Waiting for Opponent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Swords className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Finding a worthy opponent...
              </p>
              <p className="text-sm text-muted-foreground">
                Player: <span className="font-mono text-foreground">{game.player1.name}</span>
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                Text Preview
              </h3>
              <div className="p-4 rounded bg-muted font-mono text-sm max-h-40 overflow-y-auto">
                {referenceText}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleLeaveGame}
            >
              <X className="w-4 h-4 mr-2" />
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
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-3xl w-full">
          <CardHeader>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-background">
                <Trophy className={`w-5 h-5 ${won ? "text-yellow-500" : "text-muted-foreground"}`} />
                <span className="font-bold text-lg">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player 1 */}
              <Card className={player1Stats.id === game.winnerId ? "border-primary" : ""}>
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
              <Card className={player2Stats.id === game.winnerId ? "border-primary" : ""}>
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
                className="flex-1"
                onClick={() => navigate("/duels")}
              >
                Find Another Match
              </Button>
              <Button
                variant="outline"
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
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Player Progress Bars */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Current Player */}
              <div>
                <div className="flex justify-between text-sm font-mono mb-2">
                  <span className="text-primary font-bold">
                    YOU ({currentPlayer?.name})
                  </span>
                  <span className="text-muted-foreground">
                    {stats.wpm} WPM • {stats.accuracy}% • {stats.progress}%
                  </span>
                </div>
                <div className="h-3 bg-background/40 rounded-full overflow-hidden border border-border">
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
                <div className="flex justify-between text-sm font-mono mb-2">
                  <span className="text-destructive font-bold">
                    OPPONENT ({opponent?.name})
                  </span>
                  <span className="text-muted-foreground">
                    {opponent?.wpm ?? 0} WPM • {opponent?.accuracy ?? 100}% • {opponent?.progress ?? 0}%
                  </span>
                </div>
                <div className="h-3 bg-background/40 rounded-full overflow-hidden border border-border">
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-mono text-muted-foreground uppercase">
                Type the text below
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSurrender}
              >
                Surrender
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative font-mono text-base leading-relaxed p-6 rounded bg-muted min-h-[400px] whitespace-pre-wrap">
              {referenceText.split("").map((char, idx) => {
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
              <div className="mt-4 p-4 rounded bg-primary/10 border border-primary text-center">
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

