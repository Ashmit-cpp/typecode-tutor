import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import type { PageChalkId } from "@/lib/page-chalk";
import { pageChalkCssValue, pageChalkFgCssValue } from "@/lib/page-chalk";
import { LightRays } from "@/components/ui/light-rays";

interface PracticeLayoutProps {
  children: ReactNode;
  pageChalk: PageChalkId;
}

export default function PracticeLayout({ children, pageChalk }: PracticeLayoutProps) {
  return (
    <div
      className="kc-page-shell relative min-h-screen bg-background text-foreground"
      style={{
        ["--page-chalk" as string]: pageChalkCssValue(pageChalk),
        ["--page-chalk-fg" as string]: pageChalkFgCssValue(pageChalk),
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="kc-app-bg-gradient absolute inset-0" />
        <div className="kc-app-bg-vignette absolute inset-0 z-[1]" />
        <LightRays color={`color-mix(in srgb, ${pageChalkCssValue(pageChalk)} 32%, black)`} />
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
