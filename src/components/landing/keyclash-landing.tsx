import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { glass } from "@/lib/glass-styles";
import { FEATURES, MOCK_LEADERBOARD } from "./constants";
import { STEPS } from "./constants";
import { motion, useReducedMotion } from "framer-motion";

// ─── Shared animation variants ────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Stagger container — children animate in sequence */
const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Viewport trigger defaults shared across sections */
const inView = { once: true, amount: 0.18 } as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Wrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/85 mb-3 sm:mb-4",
        className,
      )}
    >
      {children}
    </p>
  );
}

function SectionTitle({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h2
      className={cn(
        "font-sans text-[clamp(30px,4.2vw,48px)] font-bold tracking-tight text-foreground leading-[1.06]",
        className,
      )}
      style={style}
    >
      {children}
    </h2>
  );
}

function LiveTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-primary",
        "rounded-sm border border-primary/25 bg-primary/[0.08] px-3 py-1.5 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]",
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-[kc-cursor-blink_1.4s_step-end_infinite] shadow-[0_0_8px_var(--primary)]" />
      {children}
    </span>
  );
}

/* ─────────────────────────── HERO ───────────────────────────────────────── */
const SNIPPET = `function mergeSort<T>(arr: T[]): T[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(
    mergeSort(arr.slice(0, mid)),
    mergeSort(arr.slice(mid))
  );
}`;

function TerminalPreview() {
  const [typedLen, setTypedLen] = useState(0);
  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);
  const [wpm1, setWpm1] = useState(0);
  const [wpm2, setWpm2] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTypedLen((n) => {
        if (n >= SNIPPET.length) {
          setP1(0);
          setP2(0);
          setWpm1(0);
          setWpm2(0);
          return 0;
        }
        return n + 1;
      });
      setP1((p) => Math.min(100, p + 0.9 + Math.random() * 0.5));
      setP2((p) => Math.min(100, p + 0.65 + Math.random() * 0.4));
      setWpm1((w) =>
        Math.min(218, w < 10 ? w + 8 : w + 0.35 + Math.random() * 0.3),
      );
      setWpm2((w) =>
        Math.min(196, w < 10 ? w + 6 : w + 0.28 + Math.random() * 0.25),
      );
    }, 78);
    return () => clearInterval(t);
  }, []);

  const { typed, untyped } = useMemo(
    () => ({
      typed: SNIPPET.slice(0, typedLen),
      untyped: SNIPPET.slice(typedLen),
    }),
    [typedLen],
  );

  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-[min(100%,540px)] overflow-hidden",
        glass.panel,
      )}
    >
      {/* Title bar */}
      <div
        className={cn(
          "flex items-center gap-2 border-b px-3 py-2.5 sm:px-4",
          glass.divider,
          "bg-white/[0.03] backdrop-blur-md",
        )}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/50 shadow-[0_0_6px_oklch(0.58_0.195_20_/_0.5)]" />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: "oklch(0.85 0.120 80 / 0.55)" }}
        />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/50 shadow-[0_0_6px_var(--primary)]" />
        <span className="flex-1" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/90 sm:text-xs">
          match_arena.ts
        </span>
      </div>

      {/* Code */}
      <div
        className={cn(
          "border-b px-4 py-4 font-mono text-[12px] leading-[1.75] whitespace-pre overflow-x-auto backdrop-blur-sm sm:px-5 sm:py-5 sm:text-sm",
          glass.divider,
        )}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.12 0.032 282 / 0.72), oklch(0.10 0.030 282 / 0.85))",
          minHeight: 148,
        }}
      >
        <span style={{ color: "var(--syntax-typed)" }}>{typed}</span>
        <span className="kc-cursor" />
        <span style={{ color: "var(--syntax-untyped)" }}>{untyped}</span>
      </div>

      {/* Players */}
      <div className="space-y-4 bg-gradient-to-b from-card/15 to-card/5 p-4 text-base backdrop-blur-md sm:space-y-5 sm:p-5">
        {[
          {
            label: "you",
            wpm: Math.round(wpm1),
            pct: p1,
            colorVar: "--primary",
          },
          {
            label: "opponent",
            wpm: Math.round(wpm2),
            pct: p2,
            colorVar: "--secondary",
          },
        ].map((pl) => (
          <div key={pl.label}>
            <div className="flex items-baseline justify-between mb-2">
              <span
                className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em]"
                style={{ color: `var(${pl.colorVar})` }}
              >
                {pl.label}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="font-mono text-[clamp(26px,5vw,32px)] font-bold leading-none tabular-nums"
                  style={{ color: `var(${pl.colorVar})` }}
                >
                  {pl.wpm}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  wpm
                </span>
              </div>
            </div>
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width] duration-75 ease-linear"
                style={{
                  width: `${Math.min(100, pl.pct)}%`,
                  background: `var(${pl.colorVar})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface KeyClashLandingHeroProps {
  onFindMatch: () => void;
  onPracticeSolo: () => void;
  wrapClassName?: string;
}

const HERO_VIEWPORT_MIN_H = "min-h-[calc(100svh-3.5rem)]" as const;

function KeyClashLandingHeroContent({
  onFindMatch,
  onPracticeSolo,
  wrapClassName,
}: KeyClashLandingHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col justify-center">
      <Wrap className={cn("relative z-10", wrapClassName)}>
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-16">
          {/* Left — text content */}
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            animate="visible"
            className="min-w-0"
          >
            <motion.div className="mb-5 sm:mb-7" variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }}>
              <LiveTag>Season 1 · Now open</LiveTag>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="font-sans font-bold tracking-tight text-foreground leading-[0.96]"
              style={{
                fontSize: "clamp(2.25rem, 9.5vw + 0.35rem, 5.75rem)",
              }}
            >
              Key<span className="text-primary">Clash</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-mono text-muted-foreground leading-relaxed mt-4 sm:mt-6 text-[clamp(15px,1.75vw,18px)] max-w-[26rem]"
            >
              Real-time 1v1 typing battles on identical code snippets.{" "}
              <span className="text-foreground">The faster compiler wins.</span>
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
            >
              <motion.button
                onClick={onFindMatch}
                whileHover={shouldReduceMotion ? {} : { y: -1, filter: "brightness(1.05)" }}
                whileTap={shouldReduceMotion ? {} : { y: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "inline-flex w-full cursor-pointer items-center justify-center rounded-[var(--radius)] px-7 py-3.5 font-mono text-base font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors duration-200 sm:w-auto",
                  "border border-white/15 bg-primary/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_32px_-4px_oklch(0.80_0.124_305_/_0.35)] backdrop-blur-md",
                )}
              >
                Find a match
              </motion.button>
              <button
                onClick={onPracticeSolo}
                className={cn(
                  "inline-flex w-full cursor-pointer items-center justify-center rounded-[var(--radius)] border px-7 py-3.5 font-mono text-base uppercase tracking-[0.1em] text-muted-foreground transition-all duration-200 sm:w-auto",
                  "border-white/[0.12] bg-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl",
                  "hover:border-primary/35 hover:bg-primary/[0.08] hover:text-foreground",
                )}
              >
                Practice solo
              </button>
            </motion.div>

            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cn(
                "mt-8 flex flex-wrap gap-x-8 gap-y-5 border-t pt-6 sm:mt-10 sm:gap-x-10 sm:gap-y-4 sm:pt-8",
                glass.divider,
              )}
            >
              {[
                ["24k+", "duels today"],
                ["142", "avg wpm"],
                ["98", "countries"],
              ].map(([v, l], i) => (
                <motion.div
                  key={l}
                  variants={fadeUp}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.07 }}
                >
                  <div className="font-mono text-[clamp(22px,3.5vw,28px)] font-bold text-primary leading-none tabular-nums">
                    {v}
                  </div>
                  <div className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-muted-foreground mt-2">
                    {l}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — terminal preview */}
          <motion.div
            className="flex w-full min-w-0 justify-center lg:justify-end"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.25 }}
          >
            <TerminalPreview />
          </motion.div>
        </div>
      </Wrap>
    </div>
  );
}

export function KeyClashLandingHero({
  onFindMatch,
  onPracticeSolo,
}: KeyClashLandingHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-0 w-full flex-col overflow-hidden",
        HERO_VIEWPORT_MIN_H,
      )}
    >
      <KeyClashLandingHeroContent
        onFindMatch={onFindMatch}
        onPracticeSolo={onPracticeSolo}
      />
    </section>
  );
}

interface KeyClashLandingSectionsGridProps {
  onFindMatch: () => void;
  onPracticeSolo: () => void;
  onStartDueling: () => void;
}

export function KeyClashLandingSectionsGrid({
  onFindMatch,
  onPracticeSolo,
  onStartDueling,
}: KeyClashLandingSectionsGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto w-full min-w-0 max-w-7xl overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr]">
        <div
          className={cn(
            "col-span-full relative flex min-h-0 w-full min-w-0 flex-col overflow-hidden px-4 pt-4 pb-6 sm:px-5 sm:pt-6 sm:pb-8 md:px-6 lg:px-8",
            HERO_VIEWPORT_MIN_H,
          )}
        >
          <KeyClashLandingHeroContent
            onFindMatch={onFindMatch}
            onPracticeSolo={onPracticeSolo}
            wrapClassName="!px-0"
          />
        </div>

        {/* ── (1) Steps ── */}
        <div className="px-4 py-10 sm:px-5 sm:py-14 md:px-6 lg:px-8 md:py-[clamp(64px,10vw,120px)]">
          <Wrap className="!px-0">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={staggerContainer(0.05)}
            >
              <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
                <SectionLabel>How it works</SectionLabel>
                <SectionTitle className="mb-8 sm:mb-[clamp(40px,6vw,64px)]">
                  Three rounds.
                  <br />
                  One winner.
                </SectionTitle>
              </motion.div>

              <div className="flex flex-col gap-2.5">
                {STEPS.map((s) => (
                  <motion.div
                    key={s.n}
                    variants={fadeUp}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={cn(
                      "group relative flex gap-4 overflow-hidden p-5 transition-colors duration-300 sm:gap-6 sm:p-7",
                      glass.panelSubtle,
                      "hover:border-primary/25 hover:bg-primary/[0.06]",
                    )}
                  >
                    <div className="font-mono text-sm sm:text-base font-bold text-primary/40 tabular-nums pt-0.5 w-5 sm:w-6 shrink-0">
                      {s.n}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-sans text-lg sm:text-xl font-bold text-foreground mb-2.5 leading-snug tracking-tight">
                        {s.title}
                      </h3>
                      <p className="font-mono text-sm sm:text-base leading-[1.75] text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                    <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Wrap>
        </div>

        {/* ── (2) CTA ── */}
        <div className="relative flex min-w-0 items-center justify-center overflow-hidden px-4 py-10 sm:px-5 sm:py-14 md:px-6 md:py-[clamp(48px,8vw,80px)] lg:px-8">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 60% 80%, oklch(0.80 0.124 305 / 0.12) 0%, transparent 60%)",
            }}
          />

          <Wrap className="relative flex justify-center !px-0">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={inView}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn("relative w-full max-w-sm text-center", glass.panel)}
              style={{
                padding: "clamp(28px,5vw,56px) clamp(20px,4vw,48px)",
              }}
            >
              {(["tl", "tr", "bl", "br"] as const).map((c) => (
                <div
                  key={c}
                  className="absolute w-4 h-4"
                  style={{
                    top: c[0] === "t" ? -1 : "auto",
                    bottom: c[0] === "b" ? -1 : "auto",
                    left: c[1] === "l" ? -1 : "auto",
                    right: c[1] === "r" ? -1 : "auto",
                    borderTop: c[0] === "t" ? "2px solid var(--primary)" : "none",
                    borderBottom: c[0] === "b" ? "2px solid var(--primary)" : "none",
                    borderLeft: c[1] === "l" ? "2px solid var(--primary)" : "none",
                    borderRight: c[1] === "r" ? "2px solid var(--primary)" : "none",
                  }}
                />
              ))}

              <div className="mb-5">
                <LiveTag>Ready to compile?</LiveTag>
              </div>

              <h2 className="font-sans text-[clamp(26px,4.2vw,38px)] font-bold tracking-tight text-foreground leading-[1.08] mb-4">
                Enter the arena.
              </h2>

              <p className="font-mono text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
                Join 24,000+ developers
                <br />
                competing right now.
              </p>

              <motion.button
                onClick={onStartDueling}
                whileHover={shouldReduceMotion ? {} : { y: -1, filter: "brightness(1.05)" }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98, y: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "w-full rounded-[var(--radius)] py-4 font-mono text-base font-bold uppercase tracking-[0.18em] text-primary-foreground",
                  "border border-white/15 bg-primary/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_32px_-4px_oklch(0.80_0.124_305_/_0.35)] backdrop-blur-md",
                )}
              >
                Start dueling →
              </motion.button>

              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.14em] text-muted-foreground mt-6 leading-relaxed">
                Sign in required
                <br />
                Matchmaking in &lt;10s
              </p>
            </motion.div>
          </Wrap>
        </div>

        {/* ── (3) Features ── */}
        <div className="px-4 py-10 sm:px-5 sm:py-14 md:px-6 lg:px-8 md:py-[clamp(64px,10vw,120px)]">
          <Wrap className="!px-0">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={staggerContainer(0.07)}
            >
              <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
                <SectionLabel>What makes it different</SectionLabel>
                <SectionTitle className="mb-8 sm:mb-[clamp(40px,6vw,64px)]">
                  Built for speed.
                  <br />
                  Designed for devs.
                </SectionTitle>
              </motion.div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <motion.div
                    key={f.label}
                    variants={fadeUp}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={cn(
                      "group relative flex gap-4 p-4 transition-colors duration-300 sm:gap-5 sm:p-6",
                      glass.panelSubtle,
                      "hover:border-primary/25 hover:bg-primary/[0.06]",
                    )}
                  >
                    <div
                      className={cn(
                        "font-mono text-[20px] font-bold w-10 shrink-0 pt-0.5 tabular-nums",
                        f.colorClass,
                      )}
                    >
                      {f.symbol}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-sans text-base sm:text-[17px] font-bold text-foreground mb-2.5 leading-snug tracking-tight">
                        {f.label}
                      </h3>
                      <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                        {f.desc}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Wrap>
        </div>

        {/* ── (4) Leaderboard ── */}
        <div className="relative flex min-w-0 flex-col justify-center px-4 py-10 sm:px-5 sm:py-14 md:px-6 lg:px-8 md:py-[clamp(64px,10vw,120px)]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, oklch(0.80 0.124 305 / 0.1) 0%, transparent 55%)",
            }}
          />

          <Wrap className="relative !px-0">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={staggerContainer(0.04)}
            >
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3 mb-8 sm:mb-[clamp(28px,4vw,44px)]"
              >
                <div>
                  <SectionLabel>Global ranking</SectionLabel>
                  <SectionTitle style={{ fontSize: "clamp(26px,3.2vw,36px)" }}>
                    Live
                    <br />
                    leaderboard
                  </SectionTitle>
                </div>
                <div className="shrink-0 sm:pt-1">
                  <LiveTag>S1 · Live</LiveTag>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={cn("-mx-1 overflow-hidden sm:mx-0", glass.panel, "p-0")}
              >
                <div className="min-w-[min(100%,320px)] overflow-x-auto sm:min-w-0">
                  {/* Header row */}
                  <div
                    className={cn(
                      "grid gap-x-1.5 border-b px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/90 backdrop-blur-sm sm:gap-x-2 sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.14em]",
                      glass.divider,
                      "bg-white/[0.04]",
                      "grid-cols-[22px_minmax(0,1fr)_40px_36px_32px] sm:grid-cols-[28px_minmax(0,1fr)_48px_44px_40px] md:grid-cols-[32px_minmax(0,1fr)_56px_48px_44px]",
                    )}
                  >
                    <span>#</span>
                    <span>User</span>
                    <span className="text-right">ELO</span>
                    <span className="text-right">WPM</span>
                    <span className="text-right">Lang</span>
                  </div>

                  {/* Rows — each fades+slides in with a tiny stagger */}
                  <div className="divide-y divide-white/[0.06]">
                    {MOCK_LEADERBOARD.map((row, i) => (
                      <motion.div
                        key={row.user}
                        variants={fadeUp}
                        transition={{ duration: 0.32, ease: "easeOut", delay: i * 0.04 }}
                        className={cn(
                          "grid cursor-default items-center gap-x-1.5 px-3 py-3 font-mono text-xs transition-colors duration-150 sm:gap-x-2 sm:px-4 sm:py-3.5 sm:text-sm md:text-base",
                          "hover:bg-white/[0.04]",
                          "grid-cols-[22px_minmax(0,1fr)_40px_36px_32px] sm:grid-cols-[28px_minmax(0,1fr)_48px_44px_40px] md:grid-cols-[32px_minmax(0,1fr)_56px_48px_44px]",
                          row.rank === 1 &&
                            "bg-primary/[0.08] shadow-[inset_0_0_24px_-12px_oklch(0.80_0.124_305_/_0.25)]",
                        )}
                      >
                        <span
                          className={cn(
                            "font-bold tabular-nums",
                            row.rank === 1 ? "text-secondary" : "text-muted-foreground",
                          )}
                        >
                          {row.rank}
                        </span>
                        <span
                          className={cn(
                            "truncate",
                            row.rank === 1 ? "text-primary font-bold" : "text-foreground",
                          )}
                        >
                          {row.user}
                        </span>
                        <span className="text-right tabular-nums text-foreground font-bold">
                          {row.elo}
                        </span>
                        <span className="text-right tabular-nums text-muted-foreground">
                          {row.wpm}
                        </span>
                        <span className="text-right text-muted-foreground text-[10px] sm:text-xs">
                          {row.lang}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.p
                variants={fadeIn}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="font-mono text-[10px] sm:text-xs tracking-wide text-muted-foreground mt-4 leading-relaxed"
              >
                ↳ Illustrative — live ranks sync when S1 opens.
              </motion.p>
            </motion.div>
          </Wrap>
        </div>
      </div>
    </section>
  );
}