"use client";

import { Header } from "./components/header";
import { TypingOverlay } from "./components/typing-overlay";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <Header />
        <main className="bg-gradient-to-br from-background to-muted/20 h-[calc(100vh-66px)]">
          <TypingOverlay />
        </main>
      </div>
    </ThemeProvider>
  );
}
