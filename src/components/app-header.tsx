import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Terminal, Code2, BarChart3, Swords, Menu, Keyboard } from "lucide-react";

export function AppHeader() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { to: "/practice", label: "Practice", icon: Keyboard },
    { to: "/algorithm", label: "Algorithm", icon: Code2 },
    ...(isSignedIn ? [{ to: "/statistics", label: "Stats", icon: BarChart3 }] : []),
    { to: "/duels", label: "Duels", icon: Swords, badge: true },

  ];

  const NavButton = ({ to, label, icon: Icon, badge, className = "" }: {
    to: string;
    label: string;
    icon: React.ComponentType<any>;
    badge?: boolean;
    className?: string;
  }) => (
    <Link to={to}>
      <Button
        variant={isActive(to) ? "default" : "ghost"}
        size="sm"
        className={`gap-2 ${className}`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
        {badge && (
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        )}
      </Button>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Logo/Brand Section */}
        <Link
          to="/"
          aria-label="Go to home"
          className="flex items-center gap-2 rounded-md p-1 ml-5"
        >
          <div className="relative">
            <Terminal className="size-6 text-primary" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
              KeyClash
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavButton key={item.to} {...item} />
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Auth Section */}
          {isLoaded && (
            <>
              {isSignedIn ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="default" size="sm" className="hidden sm:flex">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </>
              )}
            </>
          )}

          {/* Theme Toggle */}
          {/* <ModeToggle /> */}

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-4 h-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* Mobile Navigation */}
              {navItems.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}

              {/* Mobile Auth */}
              {isLoaded && !isSignedIn && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SignInButton mode="modal">
                      <div className="flex items-center gap-2 w-full">
                        <span>Sign In</span>
                      </div>
                    </SignInButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SignUpButton mode="modal">
                      <div className="flex items-center gap-2 w-full">
                        <span>Sign Up</span>
                      </div>
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

