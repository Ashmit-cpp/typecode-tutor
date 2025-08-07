"use client";

import { useState } from "react";
import { Header } from "./components/header";
import { TypingOverlay } from "./components/typing-overlay";
import { StatisticsPage } from "./components/statistics-page";
import { ThemeProvider } from "./components/theme-provider";

type AppPage = 'practice' | 'statistics';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('practice');

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
        <main className="bg-gradient-to-br from-background to-muted/20 min-h-[calc(100vh-66px)]">
          {renderPage()}
        </main>
      </div>
    </ThemeProvider>
  );
}
