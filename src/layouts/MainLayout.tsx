import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/*
        Viewport-locked layer: canvas + vignette must both match the visible viewport.
        (Previously the vignette was `absolute` on the scroll-growing root while Squares was
        `fixed`, so long pages stretched the gradient and the two layers disagreed.)
      */}
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
      <div className="relative z-10 flex min-h-screen flex-col">
        <AppHeader />

        <main className="flex min-h-0 flex-1 flex-col">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
