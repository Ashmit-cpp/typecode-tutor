import { TerminalIcon } from "lucide-react";

/**
 * Shown by Suspense while a lazy route chunk is loading.
 * Mirrors the visual chrome (gradient background + header shell) so the
 * layout doesn't flash or feel jarring between navigations.
 * Intentionally has zero hooks/async dependencies.
 */
export function PageShellFallback() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Background gradients — identical to MainLayout */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
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

      {/* Static header shell */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-background/30 backdrop-blur-md">
          <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 font-mono font-bold text-primary tracking-tight">
              <TerminalIcon className="size-6" />
              <span className="text-lg">KeyClash</span>
            </div>
          </div>
        </header>

        {/* Empty content — NavigationProgress bar provides visual feedback */}
        <main className="flex min-h-0 flex-1 flex-col" />
      </div>
    </div>
  );
}
