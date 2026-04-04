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
import { Menu, TerminalIcon } from "lucide-react";

export function AppHeader() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDuel = location.pathname === "/" || location.pathname === "/duels";
  const isPractice = location.pathname === "/practice";
  const isStats = location.pathname === "/statistics";

  const navLinkClass = (active: boolean) =>
    `text-xs font-sans font-medium uppercase tracking-[0.2em] transition-colors ${
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/30 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          aria-label="KeyClash home"
          className="flex items-center gap-2 font-mono font-bold text-primary tracking-tight"
        >
          <TerminalIcon
            className="size-6"
          />
          <span className="text-primary text-lg">KeyClash</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={navLinkClass(isDuel)}>
            Duel
          </Link>
          <Link to="/practice" className={navLinkClass(isPractice)}>
            Practice
          </Link>
          <Link to="/statistics" className={navLinkClass(isStats)}>
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
                        "w-8 h-8 border-2 border-primary rounded-full ring-0 shadow-[0_0_12px_oklch(0.80_0.124_305_/_0.35)]",
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
                <Link to="/" className="font-sans text-xs uppercase tracking-widest">
                  Duel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/practice" className="font-sans text-xs uppercase tracking-widest">
                  Practice
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/statistics" className="font-sans text-xs uppercase tracking-widest">
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
