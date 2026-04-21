import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import type { PageChalkId } from "@/lib/page-chalk";
import { pageChalkCssValue, pageChalkFgCssValue } from "@/lib/page-chalk";
import { LightRays } from "@/components/ui/light-rays";

interface MainLayoutProps {
  children: ReactNode;
  pageChalk: PageChalkId;
}

export default function MainLayout({ children, pageChalk }: MainLayoutProps) {
  return (
    <div
      className="kc-page-shell relative min-h-screen bg-background text-foreground"
      style={{
        ["--page-chalk" as string]: pageChalkCssValue(pageChalk),
        ["--page-chalk-fg" as string]: pageChalkFgCssValue(pageChalk),
      }}
    >
      {/*
        Viewport-locked layer: canvas + vignette must both match the visible viewport.
        (Previously the vignette was `absolute` on the scroll-growing root while Squares was
        `fixed`, so long pages stretched the gradient and the two layers disagreed.)
      */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="kc-app-bg-gradient absolute inset-0" />
        <div className="kc-app-bg-vignette absolute inset-0 z-[1]" />
        <LightRays color={`color-mix(in srgb, ${pageChalkCssValue(pageChalk)} 22%, black)`} />

      </div>

      {/* App Shell */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <AppHeader />

        <main className="kc-page-main flex min-h-0 flex-1 flex-col">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
