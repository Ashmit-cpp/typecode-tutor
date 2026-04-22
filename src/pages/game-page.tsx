import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { History, Loader2, Swords, Trophy, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGame,
  useLeaveGame,
  useSurrender,
  useUpdateGameProgress,
} from "@/lib/game-hooks";
import {
  glassCardClassName,
  glassGhostButton,
  glassPrimaryButton,
} from "@/lib/glass-styles";
import { cn } from "@/lib/utils";
import type { Id } from "../../convex/_generated/dataModel";

interface TypingStats {
  wpm: number;
  accuracy: number;
  errorCount: number;
  progress: number;
}

interface ResultPlayerStats {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  errorCount: number;
  progress: number;
}

interface CodeLine {
  number: number;
  start: number;
  end: number;
  content: string;
}

interface DuelStatBlockProps {
  label: string;
  value: string | number;
  accent?: "page" | "danger" | "neutral";
  supporting?: string;
  meterValue?: number;
}

interface CodeArenaStatsColumnProps {
  tone: "page" | "danger";
  wpm: number;
  accuracy: number;
  errorCount: number;
  progressChars: number;
  totalChars: number;
  deltaValue: number;
}

interface CodeArenaCodeViewProps {
  badge: string;
  name: string;
  tone: "page" | "danger";
  progressChars: number;
  totalChars: number;
  referenceText: string;
  typedText?: string;
}

const pageShellClassName =
  "mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10";

const arenaShellClassName =
  "mx-auto flex min-h-screen w-full max-w-[112rem] flex-col gap-4 px-3 py-4 sm:px-5 sm:py-5";

const duelButtonClassName =
  "rounded-[var(--radius)] font-mono text-xs uppercase tracking-[0.16em]";

function positionToPercent(position: number, totalChars: number) {
  if (totalChars <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((position / totalChars) * 100)));
}

function formatClock(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function buildCodeLines(text: string): CodeLine[] {
  const segments = text.split("\n");
  const lines: CodeLine[] = [];
  let offset = 0;

  segments.forEach((content, index) => {
    lines.push({
      number: index + 1,
      start: offset,
      end: offset + content.length,
      content,
    });
    offset += content.length + 1;
  });

  return lines.length > 0
    ? lines
    : [{ number: 1, start: 0, end: 0, content: "" }];
}

function DuelStatBlock({
  label,
  value,
  accent = "neutral",
  supporting,
  meterValue,
}: DuelStatBlockProps) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "font-mono text-[clamp(1.7rem,3vw,2.45rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums text-foreground",
          accent === "page" && "text-page-chalk",
          accent === "danger" && "text-secondary",
        )}
      >
        {value}
      </p>
      {supporting && (
        <p
          className={cn(
            "font-mono text-sm font-medium tracking-[0.02em]",
            accent === "page" && "text-page-chalk/85",
            accent === "danger" && "text-secondary/85",
            accent === "neutral" && "text-muted-foreground",
          )}
        >
          {supporting}
        </p>
      )}
      {typeof meterValue === "number" && (
        <div className="mt-3 grid grid-cols-6 gap-1">
          {Array.from({ length: 6 }).map((_, index) => {
            const threshold = ((index + 1) / 6) * 100;
            const active = meterValue >= threshold;

            return (
              <span
                key={index}
                className={cn(
                  "h-2 rounded-full bg-white/[0.06]",
                  active && accent === "page" && "bg-page-chalk",
                  active && accent === "danger" && "bg-secondary",
                  active && accent === "neutral" && "bg-foreground/60",
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function CodeArenaStatsColumn({
  tone,
  wpm,
  accuracy,
  errorCount,
  progressChars,
  totalChars,
  deltaValue,
}: CodeArenaStatsColumnProps) {
  const progressPercent = positionToPercent(progressChars, totalChars);
  const deltaLabel = `${deltaValue >= 0 ? "+" : ""}${deltaValue}`;

  return (
    <div className="bg-background/42 p-5 md:p-6">
      <div className="flex h-full flex-col gap-8">
        <DuelStatBlock
          label="WPM"
          value={wpm}
          accent={tone}
          supporting={`${deltaLabel} ${deltaValue >= 0 ? "lead" : "trail"}`}
        />
        <DuelStatBlock
          label="Accuracy"
          value={`${accuracy}%`}
          accent="neutral"
        />
        <DuelStatBlock
          label="Progress"
          value={`${progressPercent}%`}
          accent={tone}
          supporting={`${progressChars} / ${totalChars}`}
          meterValue={progressPercent}
        />
        <DuelStatBlock
          label="Errors"
          value={errorCount}
          accent={errorCount > 0 ? "danger" : "neutral"}
        />
      </div>
    </div>
  );
}

function CodeArenaCodeView({
  badge,
  name,
  tone,
  progressChars,
  totalChars,
  referenceText,
  typedText,
}: CodeArenaCodeViewProps) {
  const lines = useMemo(() => buildCodeLines(referenceText), [referenceText]);
  const cursorIndex = Math.min(referenceText.length, Math.max(0, progressChars));
  const progressPercent = positionToPercent(progressChars, totalChars);

  function renderLine(line: CodeLine) {
    const nodes: React.ReactNode[] = [];
    const isActiveLine = cursorIndex >= line.start && cursorIndex <= line.end;

    for (let index = 0; index < line.content.length; index += 1) {
      const globalIndex = line.start + index;
      const rawCharacter = line.content[index];

      if (cursorIndex === globalIndex) {
        nodes.push(
          <span
            key={`cursor-${globalIndex}`}
            className={cn(
              "mr-px inline-block h-[1.15em] w-0.5 align-text-bottom animate-pulse",
              tone === "page" ? "bg-page-chalk" : "bg-secondary",
            )}
          />,
        );
      }

      let className = "text-muted-foreground/82";

      if (typedText !== undefined) {
        if (globalIndex < typedText.length) {
          className =
            typedText[globalIndex] === rawCharacter
              ? "text-foreground"
              : "rounded-sm bg-secondary/18 text-secondary";
        }
      } else if (globalIndex < cursorIndex) {
        className = tone === "page" ? "text-page-chalk" : "text-secondary";
      }

      nodes.push(
        <span
          key={globalIndex}
          className={cn(
            "transition-colors duration-150",
            className,
            isActiveLine && globalIndex >= cursorIndex && "text-foreground/90",
          )}
        >
          {rawCharacter === " " ? "\u00A0" : rawCharacter === "\t" ? "\u00A0\u00A0" : rawCharacter}
        </span>,
      );
    }

    if (cursorIndex === line.end) {
      nodes.push(
        <span
          key={`cursor-end-${line.number}`}
          className={cn(
            "mr-px inline-block h-[1.15em] w-0.5 align-text-bottom animate-pulse",
            tone === "page" ? "bg-page-chalk" : "bg-secondary",
          )}
        />,
      );
    }

    if (nodes.length === 0) {
      nodes.push(<span key={`empty-${line.number}`}>&nbsp;</span>);
    }

    return (
      <div
        key={line.number}
        className={cn(
          "grid grid-cols-[2.2rem_minmax(0,1fr)] items-start gap-5 rounded-md px-2 py-1.5",
          isActiveLine && "bg-white/[0.025]",
        )}
      >
        <span className="pt-0.5 text-right font-mono text-[0.72rem] tabular-nums text-muted-foreground/45">
          {line.number}
        </span>
        <div className="min-w-0 overflow-hidden break-words font-mono text-[0.98rem] leading-[1.95] tracking-[-0.02em] text-foreground/92">
          {nodes}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
            Match lane
          </p>
          <p className="mt-2 font-mono text-[clamp(1rem,1.6vw,1.45rem)] font-semibold tracking-[-0.03em] text-foreground">
            {name}
          </p>
        </div>
        <span
          className={cn(
            "rounded-[calc(var(--radius)-6px)] border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.16em]",
            tone === "page"
              ? "border-page-chalk/20 bg-page-chalk/[0.12] text-page-chalk"
              : "border-secondary/24 bg-secondary/16 text-secondary",
          )}
        >
          {badge}
        </span>
      </div>

      <div className="mt-6 flex-1 space-y-1">{lines.map(renderLine)}</div>

      <div className="mt-8 flex items-center justify-between gap-4 font-mono text-sm text-muted-foreground">
        <p className="truncate">Live snippet</p>
        <p className="shrink-0 tabular-nums">
          {progressChars} / {totalChars}
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className={cn(
            "h-full rounded-full",
            tone === "page" ? "bg-page-chalk" : "bg-secondary",
          )}
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.2, ease: "linear" }}
        />
      </div>
    </div>
  );
}

function ResultPanel({
  player,
  isWinner,
  totalChars,
}: {
  player: ResultPlayerStats;
  isWinner: boolean;
  totalChars: number;
}) {
  const progressPercent = positionToPercent(player.progress, totalChars);

  return (
    <section
      className={cn(
        "rounded-[calc(var(--radius)-4px)] border p-5 sm:p-6",
        isWinner
          ? "border-page-chalk/25 bg-page-chalk/[0.08]"
          : "border-white/[0.08] bg-background/35",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
            {isWinner ? "Winner" : "Split"}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
            {player.name}
          </h3>
        </div>
        {isWinner && <Trophy className="size-5 text-page-chalk" aria-hidden />}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <DuelStatBlock label="WPM" value={player.wpm} accent={isWinner ? "page" : "neutral"} />
        <DuelStatBlock label="Accuracy" value={`${player.accuracy}%`} />
        <DuelStatBlock
          label="Errors"
          value={player.errorCount}
          accent={player.errorCount > 0 ? "danger" : "neutral"}
        />
        <DuelStatBlock
          label="Progress"
          value={`${progressPercent}%`}
          accent={isWinner ? "page" : "neutral"}
          supporting={`${player.progress} / ${totalChars}`}
        />
      </div>
    </section>
  );
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

  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [clockNow, setClockNow] = useState(() => Date.now());

  const referenceText = game?.text ?? "";
  const totalChars = referenceText.length;
  const isPlayer1 = game?.player1.id === user?.id;
  const isPlayer2 = game?.player2?.id === user?.id;
  const currentPlayer = isPlayer1 ? game?.player1 : game?.player2;
  const opponent = isPlayer1 ? game?.player2 : game?.player1;
  const opponentProgressChars = Math.min(totalChars, Math.max(0, opponent?.progress ?? 0));
  const currentProgressChars = Math.min(totalChars, currentIndex);

  const stats = useMemo((): TypingStats => {
    const correctChars = typedText
      .split("")
      .filter((char, idx) => char === referenceText[idx]).length;
    const totalTypedChars = typedText.length;
    const errors = totalTypedChars - correctChars;
    const accuracy = totalTypedChars > 0 ? (correctChars / totalTypedChars) * 100 : 100;

    const timeElapsed = startTime
      ? (Date.now() - startTime.getTime()) / 1000 / 60
      : 0;
    const wpm =
      timeElapsed > 0 ? Math.round(correctChars / 5 / timeElapsed) : 0;

    const progress = positionToPercent(currentIndex, totalChars);

    return {
      wpm,
      accuracy: Math.round(accuracy),
      errorCount: errors,
      progress,
    };
  }, [typedText, referenceText, startTime, currentIndex, totalChars]);

  const elapsedSeconds = game?.startedAt
    ? Math.floor((clockNow - game.startedAt) / 1000)
    : 0;

  useEffect(() => {
    if (game?.status !== "active" || !game?.startedAt) return;

    const timer = window.setInterval(() => {
      setClockNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [game?.status, game?.startedAt]);

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

  useEffect(() => {
    if (game?.status !== "active" || isCompleted) return;

    const handleKey = (event: KeyboardEvent) => {
      if (!startTime) {
        setStartTime(new Date());
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        setTypedText((text) => text.slice(0, -1));
        setCurrentIndex((index) => Math.max(0, index - 1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        setTypedText((text) => text + "\n");
        setCurrentIndex((index) => index + 1);
      } else if (event.key === "Tab") {
        event.preventDefault();
        const spaces = "  ";
        setTypedText((text) => text + spaces);
        setCurrentIndex((index) => index + spaces.length);
      } else if (event.key.length === 1) {
        event.preventDefault();
        setTypedText((text) => text + event.key);
        setCurrentIndex((index) => index + 1);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [game?.status, isCompleted, startTime]);

  useEffect(() => {
    if (
      currentIndex >= totalChars &&
      totalChars > 0 &&
      game?.status === "active" &&
      !isCompleted
    ) {
      setIsCompleted(true);
    }
  }, [currentIndex, totalChars, game?.status, isCompleted]);

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
              className={cn(duelButtonClassName, glassPrimaryButton)}
              onClick={() => navigate("/duels")}
            >
              Back to Duels
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (game === undefined) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-6">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 size-12 animate-spin text-page-chalk" />
          <p className="font-mono text-sm text-muted-foreground">Loading game...</p>
        </div>
      </div>
    );
  }

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
              className={cn(duelButtonClassName, glassPrimaryButton)}
              onClick={() => navigate("/duels")}
            >
              Back to Duels
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (game.status === "waiting") {
    return (
      <div className={pageShellClassName}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "kc-page-hero-icon-wrap mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[var(--radius)] border",
              )}
              aria-hidden
            >
              <Swords className="kc-page-hero-icon size-5" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Matchmaking
              </h1>
              <p className="kc-page-hero-subtitle mt-1 font-mono text-sm">
                Queue armed. Your duel text is locked and waiting for a second player.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em]">
            <span className="rounded-full border border-page-chalk/20 bg-page-chalk/[0.08] px-3 py-1 text-page-chalk">
              Queue open
            </span>
            <span className="rounded-full border border-white/[0.08] bg-background/40 px-3 py-1 text-muted-foreground">
              {totalChars} chars
            </span>
          </div>
        </div>

        <Card className={glassCardClassName("overflow-hidden")}>
          <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
            <div className="flex flex-col gap-6">
              <div className="relative flex size-20 items-center justify-center rounded-full border border-page-chalk/20 bg-page-chalk/[0.08]">
                <Swords className="size-9 text-page-chalk" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-page-chalk/70 border-t-transparent" />
              </div>

              <div className="space-y-3">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Match status
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Waiting for an opponent
                </h2>
                <p className="max-w-[28ch] font-mono text-sm leading-6 text-muted-foreground">
                  The arena is staged. As soon as another coder joins, the race goes live.
                </p>
              </div>

              <div className="rounded-[calc(var(--radius)-4px)] border border-white/[0.08] bg-background/35 p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Queued by
                </p>
                <p className="mt-2 font-mono text-sm font-semibold tracking-[0.02em] text-foreground">
                  {game.player1.name}
                </p>
              </div>

              <Button
                variant="outline"
                className={cn("w-full sm:w-auto", duelButtonClassName, glassGhostButton)}
                onClick={handleLeaveGame}
              >
                <X className="mr-2 size-4" aria-hidden />
                Cancel
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                  Text preview
                </p>
                <p className="mt-2 max-w-[52ch] font-mono text-sm leading-6 text-muted-foreground">
                  The snippet is fixed before the match starts, so both players enter with identical conditions.
                </p>
              </div>

              <div className="max-h-[30rem] overflow-y-auto rounded-[calc(var(--radius)-4px)] border border-white/[0.08] bg-background/55 p-5 font-mono text-sm leading-7 whitespace-pre-wrap text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6">
                {referenceText}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (game.status === "finished") {
    const won = game.winnerId === user?.id;
    const player1Stats = game.player1 as ResultPlayerStats;
    const player2Stats = game.player2 as ResultPlayerStats;
    const rivalName = isPlayer1 ? player2Stats.name : player1Stats.name;

    return (
      <div className={pageShellClassName}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "kc-page-hero-icon-wrap mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[var(--radius)] border",
              )}
              aria-hidden
            >
              <Trophy className="kc-page-hero-icon size-5" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Match complete
              </h1>
              <p className="kc-page-hero-subtitle mt-1 font-mono text-sm">
                Final split against {rivalName}. The result is locked and ready to review.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em]">
            <span
              className={cn(
                "rounded-full border px-3 py-1",
                won
                  ? "border-page-chalk/20 bg-page-chalk/[0.08] text-page-chalk"
                  : "border-secondary/24 bg-secondary/16 text-secondary",
              )}
            >
              {won ? "Victory" : "Defeat"}
            </span>
            <span className="rounded-full border border-white/[0.08] bg-background/40 px-3 py-1 text-muted-foreground">
              vs {rivalName}
            </span>
          </div>
        </div>

        <Card className={glassCardClassName("overflow-hidden")}>
          <CardHeader className="border-b border-white/[0.08] pb-5">
            <div className="space-y-3">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                Result
              </p>
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {won ? "Victory locked in." : "Defeat recorded."}
              </CardTitle>
              <p className="max-w-[58ch] font-mono text-sm leading-6 text-muted-foreground">
                {won
                  ? "You posted the faster clean finish. Review the split or head straight back into the queue."
                  : "The other side crossed first. The breakdown below keeps the race readable without drowning the page in chrome."}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-6 sm:pt-8">
            <div className="grid gap-4 lg:grid-cols-2">
              <ResultPanel
                player={player1Stats}
                isWinner={player1Stats.id === game.winnerId}
                totalChars={totalChars}
              />
              <ResultPanel
                player={player2Stats}
                isWinner={player2Stats.id === game.winnerId}
                totalChars={totalChars}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                className={cn(
                  "min-h-11 flex-1 sm:min-w-[180px]",
                  duelButtonClassName,
                  glassPrimaryButton,
                )}
                onClick={() => navigate("/duels")}
              >
                Find Another Match
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "min-h-11 flex-1 sm:min-w-[160px]",
                  duelButtonClassName,
                  glassGhostButton,
                )}
                onClick={() => navigate("/duels/history")}
              >
                <History className="mr-2 size-4" aria-hidden />
                Duel History
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "min-h-11 flex-1 sm:min-w-[160px]",
                  duelButtonClassName,
                  glassGhostButton,
                )}
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

  const playerName = currentPlayer?.name ?? "Current player";
  const opponentName = opponent?.name ?? "Opponent";
  const playerDelta = stats.wpm - (opponent?.wpm ?? 0);
  const opponentDelta = (opponent?.wpm ?? 0) - stats.wpm;

  return (
    <div className={arenaShellClassName}>
      <div className="grid gap-4">
        <header className="grid gap-3 rounded-[calc(var(--radius)+2px)] border border-white/[0.08] bg-card/[0.26] px-4 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] md:grid-cols-[1fr_auto_1fr] md:items-start md:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[calc(var(--radius)-6px)] border border-white/[0.08] bg-background/45 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Live duel
            </span>
            <span className="rounded-[calc(var(--radius)-6px)] border border-page-chalk/20 bg-page-chalk/[0.1] px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-page-chalk">
              {totalChars} chars
            </span>
          </div>

          <div className="text-center">
            <p className="font-mono text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.08em] text-foreground">
              {formatClock(elapsedSeconds)}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Match time
            </p>
          </div>

          <div className="flex justify-start md:justify-end">
            <Button
              variant="outline"
              className={cn(
                "min-h-11 w-full md:w-auto",
                duelButtonClassName,
                "border-white/[0.08] bg-background/45 text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
              )}
              onClick={handleSurrender}
            >
              <X className="mr-2 size-4" aria-hidden />
              Leave Match
            </Button>
          </div>
        </header>

        <section className="overflow-hidden rounded-[calc(var(--radius)+2px)] border border-white/[0.08] bg-card/[0.28] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="border-b border-white/[0.08]">
            <div className="grid gap-4 px-4 py-5 md:grid-cols-[1fr_auto_1fr] md:items-center md:px-6">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-[calc(var(--radius)-2px)] border border-page-chalk/20 bg-page-chalk/[0.08]">
                  <Swords className="size-6 text-page-chalk" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-mono text-[clamp(1.2rem,2vw,1.8rem)] font-semibold tracking-[-0.04em] text-foreground">
                    {playerName}
                  </p>
                  <div className="mt-1 flex items-center gap-2 font-mono text-sm text-muted-foreground">
                    <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
                    <span>{stats.wpm} WPM</span>
                  </div>
                </div>
              </div>

              <div className="text-center font-mono text-[clamp(2rem,3.2vw,3rem)] font-semibold tracking-[-0.08em] text-foreground">
                VS
              </div>

              <div className="flex items-center justify-start gap-4 md:justify-end">
                <div className="min-w-0 text-left md:text-right">
                  <p className="truncate font-mono text-[clamp(1.2rem,2vw,1.8rem)] font-semibold tracking-[-0.04em] text-foreground">
                    {opponentName}
                  </p>
                  <div className="mt-1 flex items-center gap-2 font-mono text-sm text-muted-foreground md:justify-end">
                    <span>{opponent?.wpm ?? 0} WPM</span>
                    <span className="size-2 rounded-full bg-secondary" aria-hidden />
                  </div>
                </div>
                <div className="flex size-14 items-center justify-center rounded-[calc(var(--radius)-2px)] border border-secondary/24 bg-secondary/16">
                  <Trophy className="size-6 text-secondary" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid border-b border-white/[0.08] md:grid-cols-[15.5rem_minmax(0,1fr)_15.5rem]">
            <div className="border-b border-white/[0.08] md:border-b-0 md:border-r md:border-white/[0.08]">
              <CodeArenaStatsColumn
                tone="page"
                wpm={stats.wpm}
                accuracy={stats.accuracy}
                errorCount={stats.errorCount}
                progressChars={currentProgressChars}
                totalChars={totalChars}
                deltaValue={playerDelta}
              />
            </div>

            <div className="min-w-0 border-b border-white/[0.08] md:border-b-0 md:border-r md:border-white/[0.08]">
              <CodeArenaCodeView
                badge="YOU"
                name={playerName}
                tone="page"
                progressChars={currentProgressChars}
                totalChars={totalChars}
                referenceText={referenceText}
                typedText={typedText}
              />
            </div>

            <CodeArenaStatsColumn
              tone="danger"
              wpm={opponent?.wpm ?? 0}
              accuracy={opponent?.accuracy ?? 100}
              errorCount={opponent?.errorCount ?? 0}
              progressChars={opponentProgressChars}
              totalChars={totalChars}
              deltaValue={opponentDelta}
            />
          </div>

          <div className="grid grid-cols-2">
            <div className="bg-page-chalk px-4 py-3 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-page-chalk-fg">
              {stats.progress}%
            </div>
            <div className="bg-secondary px-4 py-3 text-right font-mono text-sm font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
              {positionToPercent(opponentProgressChars, totalChars)}%
            </div>
          </div>
        </section>

        {isCompleted && (
          <div className="rounded-[calc(var(--radius)+2px)] border border-page-chalk/20 bg-page-chalk/[0.08] px-4 py-3">
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-page-chalk">
              Completed. Holding your result while the opponent finishes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
