import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";

interface PracticeLayoutProps {
  children: ReactNode;
}

export default function PracticeLayout({ children }: PracticeLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% -10%, oklch(0.80 0.124 305 / 0.28) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 110%, oklch(0.88 0.102 213 / 0.22) 0%, transparent 55%),
              radial-gradient(ellipse 40% 30% at 60% 50%, oklch(0.80 0.124 305 / 0.10) 0%, transparent 70%)
            `,
          }}
        />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.30)_100%)]" />
      </div>

      {/* App Shell */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <AppHeader />

        <main>{children}</main>

        <div className="p-4 px-6 border-t border-border bg-transparent backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="font-mono">© 2026 KeyClash. MIT Licensed.</div>

            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
