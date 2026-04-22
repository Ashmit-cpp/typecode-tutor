import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { glass, glassGhostButton, glassPrimaryButton } from "@/lib/glass-styles";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { KeyClashWordmark } from "@/components/keyclash-wordmark";
import {
  getPageChalkIdFromPathname,
  navLinkActiveChalkClass,
  navLinkHoverChalkClass,
  type PageChalkId,
} from "@/lib/page-chalk";
import { Menu, TerminalIcon } from "lucide-react";

export function AppHeader() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDuel =
    location.pathname === "/" ||
    location.pathname === "/duels" ||
    location.pathname.startsWith("/game/");
  const isDuelHistory = location.pathname === "/duels/history";
  const isPractice = location.pathname === "/practice";
  const isStats = location.pathname === "/statistics";
  const activeBrandChalkClass =
    navLinkActiveChalkClass[getPageChalkIdFromPathname(location.pathname)];

  const navLinkClass = (active: boolean, chalk: PageChalkId) =>
    cn(
      "text-xs font-sans font-medium uppercase tracking-[0.2em] transition-colors",
      active
        ? navLinkActiveChalkClass[chalk]
        : cn("text-muted-foreground/60", navLinkHoverChalkClass[chalk]),
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/30 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          aria-label="KeyClash home"
          className="flex items-center gap-2 font-mono font-bold tracking-tight"
        >
          <TerminalIcon className={cn("size-6", activeBrandChalkClass)} />
          <KeyClashWordmark className={cn("text-lg", activeBrandChalkClass)} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={navLinkClass(isDuel, "duel")}>
            Duel
          </Link>
          {isLoaded && isSignedIn && (
            <Link to="/duels/history" className={navLinkClass(isDuelHistory, "history")}>
              History
            </Link>
          )}
          <Link to="/practice" className={navLinkClass(isPractice, "practice")}>
            Practice
          </Link>
          <Link to="/statistics" className={navLinkClass(isStats, "stats")}>
            Stats
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isLoaded && (
            <>
              {isSignedIn ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-8 h-8 border-2 border-primary rounded-full ring-0 shadow-[var(--glow-primary-avatar)]",
                      userButtonPopoverCard: cn(
                        "rounded-[var(--radius)]",
                        glass.popover,
                      ),
                    },
                  }}
                />
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "hidden sm:inline-flex rounded-[var(--radius)] font-sans text-xs uppercase tracking-widest",
                        glassGhostButton,
                      )}
                    >
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      variant="default"
                      size="sm"
                      className={cn(
                        "hidden sm:inline-flex rounded-[var(--radius)] font-sans text-xs uppercase tracking-widest",
                        glassPrimaryButton,
                      )}
                    >
                      Sign up
                    </Button>
                  </SignUpButton>
                </>
              )}
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn("md:hidden rounded-[var(--radius)]", glassGhostButton)}
              >
                <Menu className="w-4 h-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn("w-48 rounded-[var(--radius)] border-0 shadow-none", glass.popover)}
            >
              <DropdownMenuItem asChild>
                <Link to="/" className={cn(navLinkClass(isDuel, "duel"), "tracking-widest")}>
                  Duel
                </Link>
              </DropdownMenuItem>
              {isLoaded && isSignedIn && (
                <DropdownMenuItem asChild>
                  <Link
                    to="/duels/history"
                    className={cn(navLinkClass(isDuelHistory, "history"), "tracking-widest")}
                  >
                    History
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/practice" className={cn(navLinkClass(isPractice, "practice"), "tracking-widest")}>
                  Practice
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/statistics" className={cn(navLinkClass(isStats, "stats"), "tracking-widest")}>
                  Stats
                </Link>
              </DropdownMenuItem>
              {isLoaded && !isSignedIn && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SignInButton mode="modal">
                      <span className="font-sans text-xs uppercase tracking-widest">Sign in</span>
                    </SignInButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SignUpButton mode="modal">
                      <span className="font-sans text-xs uppercase tracking-widest">Sign up</span>
                    </SignUpButton>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
