import { KeyClashWordmark } from "@/components/keyclash-wordmark";
import {
  getPageChalkIdFromPathname,
  pageChalkCssValue,
  pageChalkFgCssValue,
} from "@/lib/page-chalk";
import { TerminalIcon } from "lucide-react";

/**
 * Shown by Suspense while a lazy route chunk is loading.
 * Mirrors the visual chrome (gradient background + header shell) so the
 * layout doesn't flash or feel jarring between navigations.
 * Intentionally has zero hooks/async dependencies.
 */
export function PageShellFallback() {
  const chalkId =
    typeof window !== "undefined"
      ? getPageChalkIdFromPathname(window.location.pathname)
      : "duel";

  return (
    <div
      className="kc-page-shell relative min-h-screen bg-background text-foreground"
      style={{
        ["--page-chalk" as string]: pageChalkCssValue(chalkId),
        ["--page-chalk-fg" as string]: pageChalkFgCssValue(chalkId),
      }}
    >
      {/* Background gradients — identical to MainLayout */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="kc-app-bg-gradient absolute inset-0" />
        <div className="kc-app-bg-vignette absolute inset-0 z-[1]" />
      </div>

      {/* Static header shell */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-background/30 backdrop-blur-md">
          <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 font-mono font-bold tracking-tight">
              <TerminalIcon className="size-6 text-secondary" />
              <KeyClashWordmark className="font-mono text-lg" />
            </div>
          </div>
        </header>

        {/* Empty content — NavigationProgress bar provides visual feedback */}
        <main className="kc-page-main flex min-h-0 flex-1 flex-col" />
      </div>
    </div>
  );
}
