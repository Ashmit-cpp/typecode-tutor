"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { useClearStatistics, useTestResults } from "@/lib/convex-hooks";
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <LoadingState 
          label="Loading statistics..." 
          helperText="Fetching your typing progress data"
        />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="text-destructive">Failed to load statistics. Please try refreshing the page.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Typing Statistics</h1>
          <p className="text-muted-foreground">
            Track your typing progress and performance
          </p>
        </div>
        {summary.totalTests > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearStatistics}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
        )}
      </div>

      {summary.totalTests === 0 ? (
        <Card className="bg-transparent backdrop-blur-sm flex items-center justify-center h-[calc(100vh-20rem)]">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Statistics Yet</h3>
            <p className="text-muted-foreground">Complete some typing tests to see your statistics here</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-transparent backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tests
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalTests}</div>
                <p className="text-xs text-muted-foreground">Tests completed</p>
              </CardContent>
            </Card>

            <Card className="bg-transparent backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average WPM
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.averageWpm}</div>
                <p className="text-xs text-muted-foreground">
                  Words per minute
                </p>
              </CardContent>
            </Card>

            <Card className="bg-transparent backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Highest WPM
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {summary.highestWpm}
                </div>
                <p className="text-xs text-muted-foreground">Personal best</p>
              </CardContent>
            </Card>

            <Card className="bg-transparent backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Time Spent
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
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
            <Card className="bg-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
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
                    <div className="text-2xl font-bold text-green-600">
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
            <Card className="bg-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-500" />
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
                    <div className="text-2xl font-bold text-blue-600">
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
          <Card className="bg-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
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
                          <Code className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FileText className="w-4 h-4 text-green-500" />
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
