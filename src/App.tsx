"use client";

import { useState } from "react";
import { Header } from "./components/header";
import { TypingOverlay } from "./components/typing-overlay";
import { StatisticsPage } from "./components/statistics-page";
import { ThemeProvider } from "./components/theme-provider";
import { TypingTipsFooter } from "./components/typing-tips-footer";
import { LiveStatsFooter } from "./components/live-stats-footer";
import { usePracticeModeStore } from "./lib/practice-store";
import { useStatsStore } from "./lib/stats-store";

type AppPage = 'practice' | 'statistics';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('practice');
  const { typingMode } = usePracticeModeStore();
  const { stats } = useStatsStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'statistics':
        return <StatisticsPage />;
      case 'practice':
      default:
        return <TypingOverlay />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <Header currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="bg-gradient-to-br from-background to-muted/20 min-h-[calc(100vh-66px)] relative">
          {renderPage()}
        </main>
        {currentPage === 'practice' && (
          <>
            {typingMode === "input" && <TypingTipsFooter show={true} />}
            {typingMode === "typing" && stats && <LiveStatsFooter stats={stats} show={true} />}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}
