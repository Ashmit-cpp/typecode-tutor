"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Keyboard, Code2, BarChart3, Home } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { usePracticeModeStore } from "@/lib/practice-store";

type AppPage = 'practice' | 'statistics';

interface HeaderProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
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
          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant={currentPage === 'practice' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('practice')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Practice</span>
            </Button>
            <Button
              variant={currentPage === 'statistics' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('statistics')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </Button>
          </div>
          
          {/* Mode Selection - Only show on practice page and larger screens */}
          {currentPage === 'practice' && (
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
          )}
          
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
