"use client";

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { useClearStatistics, useTestResults } from "@/lib/convex-hooks";
import { glassCardClassName, glassGhostButton, glassPrimaryButton } from "@/lib/glass-styles";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Target,
  Clock,
  Trophy,
  Code,
  FileText,
  Calendar,
  Trash2,
  BarChart3,
  Timer,
  ArrowLeft,
} from "lucide-react";

export function StatisticsPage() {
  const clearStatistics = useClearStatistics();
  const { data: testResults, isLoading, error } = useTestResults();

  // Compute statistics directly from the fetched data
  const summary = useMemo(() => {
    if (!testResults || testResults.length === 0) {
      return {
        totalTests: 0,
        averageWpm: 0,
        highestWpm: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        practiceTests: {
          count: 0,
          averageWpm: 0,
          highestWpm: 0,
          averageAccuracy: 0,
        },
        algorithmTests: {
          count: 0,
          averageWpm: 0,
          highestWpm: 0,
          averageAccuracy: 0,
          algorithmsCompleted: [],
        },
      };
    }

    const practiceResults = testResults.filter(r => r.mode === 'practice');
    const algorithmResults = testResults.filter(r => r.mode === 'algorithm');

    const calculateStats = (tests: typeof testResults) => {
      if (tests.length === 0) return { averageWpm: 0, highestWpm: 0, averageAccuracy: 0 };

      const avgWpm = tests.reduce((sum, test) => sum + test.wpm, 0) / tests.length;
      const highestWpm = Math.max(...tests.map(test => test.wpm));
      const avgAccuracy = tests.reduce((sum, test) => sum + test.accuracy, 0) / tests.length;

      return {
        averageWpm: Math.round(avgWpm),
        highestWpm,
        averageAccuracy: Math.round(avgAccuracy),
      };
    };

    const overallStats = calculateStats(testResults);
    const practiceStats = calculateStats(practiceResults);
    const algorithmStats = calculateStats(algorithmResults);

    const uniqueAlgorithms = [...new Set(
      algorithmResults
        .filter(r => r.algorithmName)
        .map(r => r.algorithmName!)
    )];

    return {
      totalTests: testResults.length,
      averageWpm: overallStats.averageWpm,
      highestWpm: overallStats.highestWpm,
      averageAccuracy: overallStats.averageAccuracy,
      totalTimeSpent: Math.round(testResults.reduce((sum, test) => sum + test.timeElapsed, 0)),
      practiceTests: {
        count: practiceResults.length,
        ...practiceStats,
      },
      algorithmTests: {
        count: algorithmResults.length,
        ...algorithmStats,
        algorithmsCompleted: uniqueAlgorithms,
      },
    };
  }, [testResults]);

  const recentTests = useMemo(() => {
    if (!testResults) return [];
    return testResults
      .slice()
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 20);
  }, [testResults]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = +(seconds % 60).toFixed(2);
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (timestamp: number): string => {
    const d = new Date(timestamp);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleClearStatistics = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all statistics? This action cannot be undone."
      )
    ) {
      clearStatistics().catch((error) => {
        console.error("Failed to clear statistics:", error);
        // TODO: Add user-friendly error notification
      });
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex min-h-[50vh] w-full flex-1 items-center justify-center">
          <LoadingState
            label="Loading statistics…"
            helperText="Fetching your typing progress data"
          />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-[var(--radius)] border border-destructive/30 bg-destructive/5 px-4 py-8 text-center font-mono text-sm text-destructive">
          Failed to load statistics. Please try refreshing the page.
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
            <BarChart3 className="kc-page-hero-icon size-5" />
          </div>
          <div>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Typing Statistics
            </h1>
            <p className="kc-page-hero-subtitle mt-1 font-mono text-sm">
              Track your typing progress and performance.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="outline"
            asChild
            className={cn(
              "w-full shrink-0 rounded-[var(--radius)] font-mono text-xs uppercase tracking-widest sm:w-auto",
              glassGhostButton,
            )}
          >
            <Link to="/practice" className="inline-flex items-center justify-center gap-2">
              <ArrowLeft className="size-4" />
              Practice
            </Link>
          </Button>
          {summary.totalTests > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearStatistics}
              className={cn(
                "w-full rounded-[var(--radius)] font-mono text-xs uppercase tracking-widest sm:w-auto",
                glassGhostButton,
                "text-destructive hover:text-destructive",
              )}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all data
            </Button>
          )}
        </div>
      </div>

      {summary.totalTests === 0 ? (
        <Card className={glassCardClassName()}>
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <BarChart3 className="size-12 text-muted-foreground/50" aria-hidden />
            <div>
              <p className="font-medium text-foreground">No statistics yet</p>
              <p className="mt-1 max-w-sm font-mono text-sm text-muted-foreground">
                Complete some typing tests to see your stats here.
              </p>
            </div>
            <Button
              asChild
              className={cn(
                "rounded-[var(--radius)] font-mono text-xs uppercase tracking-widest",
                glassPrimaryButton,
              )}
            >
              <Link to="/practice">Go to practice</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={glassCardClassName()}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tests
                </CardTitle>
                <Trophy className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalTests}</div>
                <p className="text-xs text-muted-foreground">Tests completed</p>
              </CardContent>
            </Card>

            <Card className={glassCardClassName()}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average WPM
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-page-chalk" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.averageWpm}</div>
                <p className="text-xs text-muted-foreground">
                  Words per minute
                </p>
              </CardContent>
            </Card>

            <Card className={glassCardClassName()}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Highest WPM
                </CardTitle>
                <Target className="h-4 w-4 text-chart-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-4">
                  {summary.highestWpm}
                </div>
                <p className="text-xs text-muted-foreground">Personal best</p>
              </CardContent>
            </Card>

            <Card className={glassCardClassName()}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Time Spent
                </CardTitle>
                <Clock className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTime(summary.totalTimeSpent)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total practice time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mode-specific Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Practice Mode Stats */}
            <Card className={glassCardClassName()}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-chart-4" />
                  Practice Mode Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {summary.practiceTests.count}
                    </div>
                    <p className="text-sm text-muted-foreground">Tests</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {summary.practiceTests.averageWpm}
                    </div>
                    <p className="text-sm text-muted-foreground">Avg WPM</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-4">
                      {summary.practiceTests.highestWpm}
                    </div>
                    <p className="text-sm text-muted-foreground">Best WPM</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {summary.practiceTests.averageAccuracy}%
                    </div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Mode Stats */}
            <Card className={glassCardClassName()}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-chart-2" />
                  Algorithm Mode Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {summary.algorithmTests.count}
                    </div>
                    <p className="text-sm text-muted-foreground">Tests</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {summary.algorithmTests.averageWpm}
                    </div>
                    <p className="text-sm text-muted-foreground">Avg WPM</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-2">
                      {summary.algorithmTests.highestWpm}
                    </div>
                    <p className="text-sm text-muted-foreground">Best WPM</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {summary.algorithmTests.averageAccuracy}%
                    </div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Algorithms Completed (
                    {summary.algorithmTests.algorithmsCompleted.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {summary.algorithmTests.algorithmsCompleted
                      .slice(0, 6)
                      .map((algo, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {algo.replace(/^\d+\.\s*/, "")}
                        </Badge>
                      ))}
                    {summary.algorithmTests.algorithmsCompleted.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{summary.algorithmTests.algorithmsCompleted.length - 6}{" "}
                        more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tests */}
          <Card className={glassCardClassName("p-3")}>
            <CardHeader >
              <CardTitle className="flex items-center gap-2 p-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Recent Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTests.map((test) => (
                  <div
                    key={test._id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {test.mode === "algorithm" ? (
                          <Code className="w-4 h-4 text-chart-2" />
                        ) : (
                          <FileText className="w-4 h-4 text-chart-4" />
                        )}
                        <Badge
                          variant={
                            test.mode === "algorithm" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {test.mode === "algorithm" ? "Algorithm" : "Practice"}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">
                          {test.algorithmName
                            ? test.algorithmName.replace(/^\d+\.\s*/, "")
                            : `${test.textPreview}${test.textPreview.length >= 50 ? "..." : ""}`}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {formatDate(test.completedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-medium">{test.wpm} WPM</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        <span>{test.accuracy}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        <span>{formatTime(test.timeElapsed)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
