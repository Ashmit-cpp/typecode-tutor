import { Link } from "react-router-dom";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFinishedGamesForUser } from "@/lib/game-hooks";
import {
  glassCardClassName,
  glassGhostButton,
  glassPrimaryButton,
} from "@/lib/glass-styles";
import { cn } from "@/lib/utils";
import { ArrowLeft, History, Swords } from "lucide-react";

export default function DuelsHistoryPage() {
  const { user, isLoaded } = useUser();
  const rows = useFinishedGamesForUser(user?.id);

  if (!isLoaded) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex min-h-[50vh] w-full flex-1 items-center justify-center">
          <LoadingState label="Loading account…" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-lg">
        <Card className={glassCardClassName()}>
          <CardHeader>
            <CardTitle className="font-mono text-lg">Duel history</CardTitle>
            <CardDescription>
              Sign in to see your past 1v1 matches, results, and stats.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SignInButton mode="modal">
              <Button
                className={cn("rounded-[var(--radius)] font-mono text-xs uppercase tracking-widest", glassPrimaryButton)}
              >
                Sign in
              </Button>
            </SignInButton>
            <Button
              variant="ghost"
              asChild
              className={cn("rounded-[var(--radius)] font-mono text-xs uppercase tracking-widest", glassGhostButton)}
            >
              <Link to="/duels">Back to duels</Link>
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  if (rows === undefined) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex min-h-[50vh] w-full flex-1 items-center justify-center">
          <LoadingState label="Loading history…" />
        </div>
      </div>
    );
  }

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
            <History className="kc-page-hero-icon size-5" />
          </div>
          <div>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Duel history
            </h1>
            <p className="kc-page-hero-subtitle mt-1 font-mono text-sm">
              Finished matches, newest first.
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
          <Link to="/duels" className="inline-flex items-center justify-center gap-2">
            <ArrowLeft className="size-4" />
            Duels
          </Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card className={glassCardClassName()}>
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <Swords className="size-12 text-muted-foreground/50" aria-hidden />
            <div>
              <p className="font-medium text-foreground">No duels yet</p>
              <p className="mt-1 max-w-sm font-mono text-sm text-muted-foreground">
                Queue up from the home page — your finished matches will show here.
              </p>
            </div>
            <Button
              asChild
              className={cn("rounded-[var(--radius)] font-mono text-xs uppercase tracking-widest", glassPrimaryButton)}
            >
              <Link to="/duels">Find a match</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-3 md:hidden">
            {rows.map((row) => (
              <Card key={row.gameId} className={glassCardClassName()}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground" title={row.opponentName}>
                        vs {row.opponentName}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {row.endedAt
                          ? new Date(row.endedAt).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </p>
                    </div>
                    <Badge
                      variant={row.didWin ? "default" : "secondary"}
                      className={cn(
                        "shrink-0 font-mono text-[10px] uppercase tracking-widest",
                        row.didWin && "bg-page-chalk text-page-chalk-fg",
                      )}
                    >
                      {row.didWin ? "Win" : "Loss"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs tabular-nums text-muted-foreground">
                    <span>
                      You: <span className="text-foreground">{row.myWpm} wpm</span> · {row.myAccuracy}%
                    </span>
                    <span>
                      Them: {row.theirWpm} wpm · {row.theirAccuracy}%
                    </span>
                  </div>
                  <Link
                    to={`/game/${row.gameId}`}
                    className="inline-block text-xs font-medium text-page-chalk underline-offset-4 hover:underline"
                  >
                    Match details
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className={glassCardClassName("hidden overflow-hidden p-0 md:block")}>
            <ScrollArea className="h-[min(60vh,520px)] w-full lg:h-[min(65vh,640px)]">
              <table className="w-full border-collapse text-left font-mono text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-widest text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Opponent</th>
                    <th className="px-4 py-3 font-medium">Result</th>
                    <th className="px-4 py-3 font-medium">You</th>
                    <th className="px-4 py-3 font-medium">Them</th>
                    <th className="px-4 py-3 text-right font-medium"> </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.gameId}
                      className="border-b border-border/60 transition-colors hover:bg-muted/20"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {row.endedAt
                          ? new Date(row.endedAt).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                      <td className="max-w-[180px] truncate px-4 py-3 text-foreground" title={row.opponentName}>
                        {row.opponentName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={row.didWin ? "default" : "secondary"}
                          className={cn(
                            "font-mono text-[10px] uppercase tracking-widest",
                            row.didWin && "bg-page-chalk text-page-chalk-fg",
                          )}
                        >
                          {row.didWin ? "Win" : "Loss"}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-foreground">
                        {row.myWpm} wpm · {row.myAccuracy}%
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-muted-foreground">
                        {row.theirWpm} wpm · {row.theirAccuracy}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/game/${row.gameId}`}
                          className="text-xs font-medium text-page-chalk underline-offset-4 hover:underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </Card>
        </>
      )}
    </div>
  );
}
