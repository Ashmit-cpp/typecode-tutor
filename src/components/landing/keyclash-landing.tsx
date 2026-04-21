import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { KeyClashWordmark } from "@/components/keyclash-wordmark";
import { glass } from "@/lib/glass-styles";
import { FEATURES, MOCK_LEADERBOARD } from "./constants";
import { STEPS } from "./constants";
import { motion, useReducedMotion } from "framer-motion";
import TextType from "../TextType";

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

const typography = {
  eyebrow:
    "font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground/82 sm:text-[0.74rem]",
  micro:
    "font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/88",
  body: "font-sans text-base leading-[1.72] tracking-[-0.012em] text-muted-foreground",
  bodyCompact:
    "font-sans text-[0.95rem] leading-[1.66] tracking-[-0.01em] text-muted-foreground",
  button: "font-mono text-[0.79rem] font-semibold uppercase tracking-[0.18em]",
} as const;

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
        "mx-auto w-full min-w-0 max-w-[88rem] px-4 sm:px-6 lg:px-8 xl:px-10",
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
    <p className={cn("mb-3 sm:mb-4", typography.eyebrow, className)}>
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
        "max-w-[11ch] text-balance font-serif text-[clamp(2.2rem,4.2vw,3.65rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-foreground",
        className,
      )}
      style={style}
    >
      {children}
    </h2>
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
        "w-full min-w-0 max-w-[min(100%,730px)] overflow-hidden",
        glass.panel,
      )}
    >
      {/* Title bar */}
      <div
        className={cn(
          "flex items-center gap-2 border-b px-3 py-3 sm:px-4 sm:py-3.5",
          glass.divider,
          "bg-white/[0.03] backdrop-blur-md",
        )}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/50 shadow-[var(--shadow-destructive-dot)]" />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--landing-terminal-dot-warn)" }}
        />
        <span className="h-2.5 w-2.5 rounded-full bg-secondary/55 shadow-[0_0_6px_color-mix(in_oklch,var(--secondary)_40%,transparent)]" />
        <span className="flex-1" />
        <span className={cn(typography.micro, "text-muted-foreground/90")}>
          match_arena.ts
        </span>
      </div>

      {/* Code */}
      <div
        className={cn(
          "overflow-x-auto whitespace-pre border-b px-4 py-5 font-mono text-[0.82rem] leading-[1.82] tracking-[-0.02em] backdrop-blur-sm sm:px-6 sm:py-6 sm:text-[0.95rem]",
          glass.divider,
        )}
        style={{
          background: "var(--landing-demo-code-gradient)",
          minHeight: 188,
        }}
      >
        <span style={{ color: "var(--syntax-typed)" }}>{typed}</span>
        <span className="kc-cursor" />
        <span style={{ color: "var(--syntax-untyped)" }}>{untyped}</span>
      </div>

      {/* Players */}
      <div className="space-y-4 bg-gradient-to-b from-card/15 to-card/5 p-4 text-base backdrop-blur-md sm:space-y-5 sm:p-6">
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
            <div className="mb-2 flex items-baseline justify-between">
              <span
                className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.72rem]"
                style={{ color: `var(${pl.colorVar})` }}
              >
                {pl.label}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="font-mono text-[clamp(2rem,5vw,2.65rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums"
                  style={{ color: `var(${pl.colorVar})` }}
                >
                  {pl.wpm}
                </span>
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground">
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

function KeyClashLandingHeroContent({
  onFindMatch,
  onPracticeSolo,
  wrapClassName,
}: KeyClashLandingHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Wrap className={cn("z-10 flex flex-1 items-center", wrapClassName)}>
      <div className="grid w-full items-center gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(400px,32rem)] lg:gap-x-[clamp(3rem,6vw,6rem)]">
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-0"
          >
            <KeyClashWordmark className="font-serif text-[1.12rem] font-semibold tracking-[-0.05em] text-foreground" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-[8ch] text-balance font-serif text-[clamp(3.45rem,8vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-foreground"
          >
            <span className="block text-page-chalk">Real</span>
            <TextType
              as="span"
              className="block text-white"
              text={["Syntax", "Time", "Snippets", "Players"]}
              typingSpeed={115}
              deletingSpeed={110}
              pauseDuration={1000}
              showCursor
              cursorCharacter="_"
            />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
              "mt-6 max-w-[34ch] text-balance sm:max-w-[38ch]",
              typography.body,
              "sm:text-[1.0625rem]",
            )}
          >
            Competitive 1v1 typing on identical code snippets. Fast queue, live
            progress, clean finishes.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-9 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <motion.button
                onClick={onFindMatch}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : { y: -1, filter: "brightness(1.05)" }
                }
                whileTap={shouldReduceMotion ? {} : { y: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "inline-flex w-full cursor-pointer items-center justify-center rounded-[var(--radius)] px-7 py-3.5 text-page-chalk-fg transition-colors duration-200 sm:w-auto",
                  typography.button,
                  "border border-white/15 bg-page-chalk/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_0_28px_-6px_color-mix(in_oklch,var(--page-chalk)_42%,transparent)] backdrop-blur-md",
                )}
              >
                Find a match
              </motion.button>
              <button
                onClick={onPracticeSolo}
                className={cn(
                  "inline-flex w-full cursor-pointer items-center justify-center rounded-[var(--radius)] border px-7 py-3.5 text-muted-foreground transition-all duration-200 sm:w-auto",
                  typography.button,
                  "border-white/[0.12] bg-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl",
                  "hover:border-secondary/40 hover:bg-secondary/[0.06] hover:text-foreground",
                )}
              >
                Practice solo
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-10 grid gap-4 border-t border-white/[0.08] pt-6 sm:grid-cols-3 sm:pt-8"
          >
            {[
              ["24k+", "duels today", "always-on queue pressure"],
              ["142", "avg wpm", "serious hands only"],
              ["98", "countries", "global bragging rights"],
            ].map(([v, l, detail], i) => (
              <motion.div
                key={l}
                variants={fadeUp}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: i * 0.07,
                }}
                className={cn(
                  "py-1",
                  i > 0 && "sm:border-l sm:border-white/[0.08] sm:pl-6",
                )}
              >
                <div className="font-mono text-[clamp(1.8rem,3.5vw,2.35rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums text-foreground">
                  {v}
                </div>
                <div className={cn("mt-2", typography.micro)}>{l}</div>
                <div
                  className={cn("mt-2 max-w-[22ch]", typography.bodyCompact)}
                >
                  {detail}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.25 }}
        >
          <div className="w-full space-y-3">
            <TerminalPreview />
            <p className={cn("text-center", typography.micro)}>
              Identical snippet. No home-field advantage.
            </p>
          </div>
        </motion.div>
      </div>
    </Wrap>
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
    <section className="mx-auto w-full min-w-0 max-w-[92rem] overflow-x-hidden">
      <div className=" px-4 py-14 sm:px-6 sm:pt-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="h-full lg:h-[calc(100svh-5rem)] border-b border-white/[0.08] flex justify-center align-center">
          <KeyClashLandingHeroContent
            onFindMatch={onFindMatch}
            onPracticeSolo={onPracticeSolo}
          />
        </div>

        <div className="mt-[clamp(3rem,6vw,5.5rem)] grid gap-y-[clamp(3.5rem,7vw,6rem)] xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-x-[clamp(2rem,4vw,4rem)]">
          <div className="space-y-[clamp(4rem,7vw,7rem)]">
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={staggerContainer(0.05)}
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-10">
                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <SectionLabel>How it works</SectionLabel>
                  <SectionTitle className="max-w-[9ch]">
                    Three rounds.
                    <br />
                    One winner.
                  </SectionTitle>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="border-t border-white/[0.08]"
                >
                  {STEPS.map((s) => (
                    <motion.div
                      key={s.n}
                      variants={fadeUp}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="grid gap-4 border-b border-white/[0.08] py-6 sm:py-8 lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-x-6"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: `var(${s.accentVar})` }}
                        />
                        <span className={typography.eyebrow}>{s.n}</span>
                      </div>

                      <div className="grid gap-2 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-x-6">
                        <h3 className="max-w-[12ch] text-balance font-serif text-[clamp(1.45rem,2.1vw,1.9rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-foreground">
                          {s.title}
                        </h3>
                        <p className={cn("max-w-[46ch]", typography.body)}>
                          {s.body}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>

            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={staggerContainer(0.06)}
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-10">
                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <SectionLabel>What makes it different</SectionLabel>
                  <SectionTitle className="max-w-[10ch]">
                    Built for speed.
                    <br />
                    Designed for devs.
                  </SectionTitle>
                </motion.div>

                <div className="grid gap-3 md:grid-cols-2">
                  {FEATURES.map((f) => (
                    <motion.article
                      key={f.label}
                      variants={fadeUp}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="border-t border-white/[0.08] pt-4 sm:pt-5"
                    >
                      <div
                        className="font-mono text-[0.74rem] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: `var(${f.accentVar})` }}
                      >
                        {f.symbol}
                      </div>

                      <h3 className="mt-3 max-w-[14ch] text-balance font-serif text-[clamp(1.3rem,2vw,1.65rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-foreground">
                        {f.label}
                      </h3>
                      <p
                        className={cn(
                          "mt-3 max-w-[32ch]",
                          typography.bodyCompact,
                        )}
                      >
                        {f.desc}
                      </p>
                    </motion.article>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          <div className="space-y-5 xl:sticky xl:top-20 xl:self-start">
            <motion.section
              id="leaderboard"
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={staggerContainer(0.04)}
              className="overflow-hidden rounded-[var(--radius)] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
            >
              <div className="border-b border-white/[0.08] px-4 py-4 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <SectionLabel className="mb-2">Global ranking</SectionLabel>
                    <h3 className="max-w-[10ch] text-balance font-serif text-[clamp(1.9rem,3vw,2.45rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-foreground">
                      Live leaderboard
                    </h3>
                  </div>
                </div>
              </div>

              <div className="px-3 py-3 sm:px-4">
                <div className="grid grid-cols-[22px_minmax(0,1fr)_46px_40px_34px] gap-x-2 px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <span>#</span>
                  <span>User</span>
                  <span className="text-right">ELO</span>
                  <span className="text-right">WPM</span>
                  <span className="text-right">Lang</span>
                </div>

                <div className="mt-2 space-y-1.5">
                  {MOCK_LEADERBOARD.map((row, i) => (
                    <motion.div
                      key={row.user}
                      variants={fadeUp}
                      transition={{
                        duration: 0.32,
                        ease: "easeOut",
                        delay: i * 0.04,
                      }}
                      className="grid grid-cols-[22px_minmax(0,1fr)_46px_40px_34px] items-center gap-x-2 rounded-[var(--radius)] border border-white/[0.04] bg-white/[0.02] px-3 py-3 font-mono text-[0.79rem] tracking-[-0.015em] transition-colors duration-150 hover:bg-white/[0.04]"
                      style={
                        row.rank === 1
                          ? {
                              borderColor:
                                "color-mix(in oklch, var(--chalk-amber) 34%, transparent)",
                              backgroundColor:
                                "color-mix(in oklch, var(--chalk-amber) 10%, transparent)",
                            }
                          : undefined
                      }
                    >
                      <span
                        className={cn(
                          "font-bold tabular-nums",
                          row.rank === 1
                            ? "text-chalk-amber"
                            : "text-muted-foreground",
                        )}
                      >
                        {row.rank}
                      </span>
                      <span
                        className={cn(
                          "truncate",
                          row.rank === 1 && "font-bold text-foreground",
                        )}
                      >
                        {row.user}
                      </span>
                      <span className="text-right font-bold tabular-nums text-foreground">
                        {row.elo}
                      </span>
                      <span className="text-right tabular-nums text-muted-foreground">
                        {row.wpm}
                      </span>
                      <span className="text-right text-[0.68rem] text-muted-foreground">
                        {row.lang}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.p
                  variants={fadeIn}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mt-4 max-w-[34ch] font-mono text-[0.68rem] font-medium uppercase leading-[1.6] tracking-[0.14em] text-muted-foreground"
                >
                  Illustrative only. Live ranks sync when season one opens.
                </motion.p>
              </div>
            </motion.section>
            <motion.section
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={inView}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[var(--radius)] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-7"
            >
              <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-page-chalk/65 to-transparent" />
              <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-[clamp(2.15rem,4vw,3rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-foreground">
                Queue for the next duel.
              </h2>

              <p className={cn("mt-4 max-w-[24ch]", typography.body)}>
                Ranked matchmaking, identical code, instant pressure.
              </p>

              <motion.button
                onClick={onStartDueling}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : { y: -1, filter: "brightness(1.05)" }
                }
                whileTap={shouldReduceMotion ? {} : { scale: 0.985, y: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "mt-6 w-full rounded-[var(--radius)] py-4 text-page-chalk-fg",
                  typography.button,
                  "border border-white/15 bg-page-chalk/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_0_28px_-6px_color-mix(in_oklch,var(--page-chalk)_42%,transparent)] backdrop-blur-md",
                )}
              >
                Start dueling
              </motion.button>

              <div
                className={cn(
                  "mt-5 grid gap-2 border-t border-white/[0.08] pt-4",
                  typography.micro,
                )}
              >
                <span>Sign in required · Matchmaking &lt;10s</span>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </section>
  );
}
