"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Keyboard, Code2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { usePracticeModeStore } from "@/lib/practice-store";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { mode, setMode } = usePracticeModeStore();

  // avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  const handleLogoClick = () => {
    // Refresh the page to reset the typing practice
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo/Brand Section */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1 -m-1"
          aria-label="Reset typing practice"
        >
          <div className="relative">
            <Keyboard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <Code2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary/70 absolute -bottom-0.5 -right-0.5" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              TypeCode Tutor
            </h1>
            <span className="text-xs text-muted-foreground hidden sm:block font-medium">
              Practice • Learn • Improve
            </span>
          </div>
        </button>

        {/* Right Section - Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mode Selection - Only show on larger screens */}
          <Select value={mode} onValueChange={(value) => setMode(value as 'practice' | 'algorithm')}>
            <SelectTrigger className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-xs font-medium text-muted-foreground">
              <div className={`w-2 h-2 rounded-full animate-pulse ${mode === 'practice' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
              {mode === 'practice' ? 'Practice Mode' : 'Algorithm Mode'}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="practice">Practice Mode</SelectItem>
              <SelectItem value="algorithm">Algorithm Mode</SelectItem>
            </SelectContent>
          </Select>
          
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
