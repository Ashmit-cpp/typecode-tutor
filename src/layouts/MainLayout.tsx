import type { ReactNode } from "react";
import Squares from "@/components/ui/Squares";
import Footer from "@/components/footer";
import { AppHeader } from "@/components/app-header";
import { useTheme } from "@/components/theme-provider";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Global Squares Background */}
      <Squares
        speed={0.4}
        squareSize={40}
        direction="down" // up, down, left, right, diagonal
        borderColor={theme.theme === "dark" ? "#201C2E" : "#E0DDDC"}
        hoverFillColor="#222"
      />

      {/* Radial vignette overlay (global) */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          z-[1]
          bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.55)_100%)]
        "
      />

      {/* App Shell */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <AppHeader />

        <main>{children}</main>

        <Footer/>
      </div>
    </div>
  );
}
