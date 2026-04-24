import { type ReactNode, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { STEPS } from "./constants";
import TextType from "../TextType";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const sectionInView = { once: true, amount: 0.22 } as const;

const stagger = (delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren } },
});

const display = "font-serif uppercase";
const label = "font-mono text-xs font-semibold uppercase text-secondary";
const body = "text-base leading-7 text-muted-foreground";

type CodeTone =
  | "plain"
  | "keyword"
  | "string"
  | "comment"
  | "fn"
  | "prop"
  | "punct";

const syntaxClass: Record<CodeTone, string> = {
  plain: "text-syn-plain",
  keyword: "text-primary",
  string: "text-secondary",
  comment: "text-syn-comment",
  fn: "text-syn-fn",
  prop: "text-syn-prop",
  punct: "text-syn-punct",
};

const matchCode: Array<Array<{ text: string; tone: CodeTone }>> = [
  [
    { text: "async", tone: "keyword" },
    { text: " function ", tone: "plain" },
    { text: "race", tone: "fn" },
    { text: "(", tone: "punct" },
    { text: "lane", tone: "prop" },
    { text: ") {", tone: "punct" },
  ],
  [{ text: "  // same snippet, no excuses", tone: "comment" }],
  [
    { text: "  const", tone: "keyword" },
    { text: " start ", tone: "plain" },
    { text: "= ", tone: "punct" },
    { text: "performance", tone: "prop" },
    { text: ".", tone: "punct" },
    { text: "now", tone: "fn" },
    { text: "();", tone: "punct" },
  ],
  [
    { text: "  while", tone: "keyword" },
    { text: " (", tone: "punct" },
    { text: "lane", tone: "prop" },
    { text: ".", tone: "punct" },
    { text: "cursor", tone: "prop" },
    { text: " < ", tone: "punct" },
    { text: "snippet", tone: "prop" },
    { text: ".", tone: "punct" },
    { text: "length", tone: "prop" },
    { text: ") {", tone: "punct" },
  ],
  [
    { text: "    await", tone: "keyword" },
    { text: " lane.", tone: "plain" },
    { text: "commit", tone: "fn" },
    { text: "(", tone: "punct" },
    { text: '"clean"', tone: "string" },
    { text: ");", tone: "punct" },
  ],
  [{ text: "  }", tone: "punct" }],
  [
    { text: "  return", tone: "keyword" },
    { text: " score(", tone: "fn" },
    { text: "start", tone: "prop" },
    { text: ");", tone: "punct" },
  ],
  [{ text: "}", tone: "punct" }],
];

const featureList = [
  {
    label: "Live duels",
    copy: "Keystroke-by-keystroke pressure against a real opponent.",
  },
  {
    label: "Ranked seasons",
    copy: "ELO moves with every clean finish, streak, and collapse.",
  },
  {
    label: "No filler",
    copy: "Actual code syntax, no quotes, no word salad, no warmup theatre.",
  },
];

const leaderboardRows = [
  {
    rank: "01",
    user: "root_user",
    elo: 2444,
    wpm: 188,
    tier: "Apex",
    delta: "+24",
    rowClass: "kc-rank-scan border-kc-apex-row-bd bg-kc-apex-row-bg",
    badgeClass:
      "border-kc-apex-badge-bd bg-kc-apex-badge-bg text-kc-apex-badge-fg",
  },
  {
    rank: "02",
    user: "pxl_c0der",
    elo: 2319,
    wpm: 181,
    tier: "Elite",
    delta: "+18",
    rowClass: "border-kc-elite-row-bd bg-kc-elite-row-bg",
    badgeClass:
      "border-kc-elite-badge-bd bg-kc-elite-badge-bg text-kc-elite-badge-fg",
  },
  {
    rank: "03",
    user: "sudo_kid",
    elo: 2143,
    wpm: 174,
    tier: "Hyped",
    delta: "+09",
    rowClass: "border-kc-hyped-row-bd bg-kc-hyped-row-bg",
    badgeClass: "border-kc-hyped-badge-bd bg-kc-hyped-badge-bg text-primary",
  },
  {
    rank: "04",
    user: "v3x_on_that",
    elo: 2037,
    wpm: 169,
    tier: "Grinder",
    delta: "+05",
    rowClass: "border-kc-base-row-bd bg-kc-base-row-bg",
    badgeClass:
      "border-kc-base-badge-bd bg-kc-base-badge-bg text-kc-base-badge-fg",
  },
  {
    rank: "05",
    user: "syntax_err",
    elo: 1921,
    wpm: 163,
    tier: "Builder",
    delta: "+02",
    rowClass: "border-kc-base-row-bd bg-kc-base-row-bg",
    badgeClass:
      "border-kc-base-badge-bd bg-kc-base-badge-bg text-kc-base-badge-fg",
  },
  {
    rank: "06",
    user: "tab_out_er",
    elo: 1809,
    wpm: 158,
    tier: "Rookie",
    delta: "+01",
    rowClass: "border-kc-base-row-bd bg-kc-base-row-bg",
    badgeClass:
      "border-kc-base-badge-bd bg-kc-base-badge-bg text-kc-base-badge-fg",
  },
];

function Wrap({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}

function RaceButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { y: 0, scale: 0.99 }}
      transition={{ duration: 0.14 }}
      className={cn(
        "kc-race-cta relative inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-sm px-4 py-3 font-mono text-sm font-semibold uppercase text-primary-foreground sm:min-h-14 sm:w-auto sm:px-6 sm:py-4 sm:text-base",
        className,
      )}
    >
      <span className="relative z-10 flex items-center gap-2 sm:gap-3">
        {children}
        <ArrowRight className="size-3.5 sm:size-4" aria-hidden />
      </span>
    </motion.button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-sm border border-border bg-background px-4 py-3 font-mono text-sm font-semibold uppercase text-syn-plain transition-colors hover:border-secondary/40 hover:text-foreground sm:min-h-14 sm:w-auto sm:px-6 sm:py-4 sm:text-base"
    >
      {children}
    </button>
  );
}

function LiveMatchPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [opponentWpm, setOpponentWpm] = useState(176);
  const [progress, setProgress] = useState(68);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const timer = window.setInterval(() => {
      setOpponentWpm((wpm) => {
        const next = wpm + Math.round(Math.random() * 6 - 2);
        return Math.max(168, Math.min(194, next));
      });
      setProgress((current) =>
        current > 93 ? 62 : current + 2 + Math.random() * 4,
      );
    }, 680);

    return () => window.clearInterval(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="relative border border-border backdrop-blur-sm">
      <div
        className="kc-scan-surface/20 absolute inset-0 pointer-events-none"
        aria-hidden
      />

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-background/20">
        <div className="min-w-0 px-3 py-4 sm:px-5">
          <p className="truncate font-mono text-sm font-semibold uppercase text-foreground">
            local_runner
          </p>
          <p className="mt-1 font-mono text-xs text-syn-punct">
            <span className="text-accent">ready</span> / lane A
          </p>
        </div>

        <div
          className={cn(display, "px-4 text-3xl font-black text-foreground")}
        >
          VS
        </div>

        <div className="min-w-0 px-3 py-4 text-right sm:px-5">
          <p className="truncate font-mono text-sm font-semibold uppercase text-foreground">
            stack_raid
          </p>
          <p className="mt-1 font-mono text-xs text-syn-punct">
            <span className="tabular-nums text-primary">{opponentWpm}</span> wpm
            / lane B
          </p>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-[7rem_minmax(0,1fr)_7rem]">
        <aside className="hidden border-r border-border bg-background/20 p-4 lg:block">
          <Metric label="WPM" value="169" caption="+12 climb" />
          <Metric label="ACC" value="99%" caption="clean" />
          <Metric label="ERR" value="1" caption="recover" />
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-syn-punct">
                Match buffer
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                auth_gate.tsx
              </p>
            </div>
            <span className="font-mono text-xs font-semibold uppercase text-secondary">
              live
            </span>
          </div>

          <ol className="overflow-hidden p-3 font-mono text-xs leading-6 sm:p-5 sm:text-sm">
            {matchCode.map((line, lineIndex) => (
              <li
                key={lineIndex}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3"
              >
                <span className="select-none text-right text-syn-linenum">
                  {String(lineIndex + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 whitespace-pre overflow-hidden">
                  {line.map((token, tokenIndex) => (
                    <span
                      key={`${lineIndex}-${tokenIndex}`}
                      className={syntaxClass[token.tone]}
                    >
                      {token.text}
                    </span>
                  ))}
                  {lineIndex === 4 && <span className="kc-cursor ml-1" />}
                </span>
              </li>
            ))}
          </ol>

          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center justify-between font-mono text-xs uppercase text-syn-punct">
              <span>pressure</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden bg-kc-progress-track">
              <div
                className="h-full bg-secondary transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <aside className="hidden border-l border-border bg-background/20 p-4 lg:block">
          <Metric
            label="WPM"
            value={String(opponentWpm)}
            caption="+18 lead"
            accent
          />
          <Metric label="ACC" value="96%" caption="stable" />
          <Metric label="ERR" value="3" caption="risky" accent />
        </aside>
      </div>

      <div className="relative grid grid-cols-2 border-t border-border lg:hidden">
        <MiniMetric label="You" value="169 WPM" />
        <MiniMetric label="Opponent" value={`${opponentWpm} WPM`} accent />
      </div>
    </div>
  );
}

function Metric({
  label: metricLabel,
  value,
  caption,
  accent,
}: {
  label: string;
  value: string;
  caption: string;
  accent?: boolean;
}) {
  return (
    <div className="mb-7 last:mb-0">
      <p className="font-mono text-xs font-semibold uppercase text-syn-punct">
        {metricLabel}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-3xl font-semibold tabular-nums",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-1 font-mono text-xs uppercase text-secondary">
        {caption}
      </p>
    </div>
  );
}

function MiniMetric({
  label: metricLabel,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border-r border-border p-4 last:border-r-0">
      <p className="font-mono text-xs uppercase text-syn-punct">
        {metricLabel}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-lg font-semibold",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
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
  const motionProps = shouldReduceMotion
    ? { initial: "visible", animate: "visible" }
    : { initial: "hidden", animate: "visible" };

  return (
    <section className="w-full overflow-x-hidden bg-transparent text-foreground">
      <Wrap className="w-full h-[100dvh] lg:h-[90dvh] flex items-center justify-center">
        <div className="py-12  w-full grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center h-full">
          <motion.div
            variants={stagger(0.04)}
            {...motionProps}
            className="max-w-xl lg:max-w-none"
          >
            <motion.p variants={fadeUp} className={label}>
              live match / ranked lane / real code
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className={cn(
                display,
                "mt-5 text-6xl font-black leading-none text-foreground sm:text-7xl lg:text-8xl",
              )}
            >
              Real
              <span className="block text-primary">
                <TextType
                  as="span"
                  className="block"
                  text={["Syntax", "Time", "Snippets", "Players"]}
                  typingSpeed={115}
                  deletingSpeed={110}
                  pauseDuration={1000}
                  showCursor
                  cursorCharacter="_"
                />
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className={cn("mt-6 max-w-md", body)}>
              Head-to-head code typing where speed only counts if your syntax
              survives.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <RaceButton onClick={onFindMatch}>Enter queue</RaceButton>
              <GhostButton onClick={onPracticeSolo}>Practice lane</GhostButton>
            </motion.div>
          </motion.div>

          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="min-w-0 lg:-mr-10 xl:-mr-20"
          >
            <LiveMatchPreview />
          </motion.div>
        </div>
      </Wrap>

      <Wrap className="py-20">
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={sectionInView}
          variants={stagger()}
          className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]"
        >
          <div>
            <p className={label}>match countdown</p>
            <h2
              className={cn(
                display,
                "mt-4 text-5xl font-black leading-none sm:text-6xl",
              )}
            >
              Three beats.
              <span className="block text-secondary">One lane.</span>
            </h2>
          </div>

          <div className="relative border-l-4 border-primary pl-6 sm:pl-9">
            {STEPS.map((step, index) => (
              <motion.article
                key={step.n}
                variants={fadeUp}
                className={cn("relative pb-12 last:pb-0", index > 0 && "pt-2")}
              >
                <span
                  className={cn(
                    display,
                    "pointer-events-none absolute -left-3 top-0 text-8xl font-black leading-none text-foreground/[0.06] sm:text-9xl",
                  )}
                >
                  {step.n}
                </span>
                <div className="relative">
                  <p className="font-mono text-sm font-semibold uppercase text-primary">
                    Stage {index + 1}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className={cn("mt-3 max-w-2xl", body)}>{step.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </Wrap>

      <Wrap className="py-14 sm:py-20">
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={sectionInView}
          variants={stagger()}
        >
          <div className="grid gap-10 border-y border-border py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div variants={fadeUp}>
              <p className={label}>why it earns attention</p>
              <h2
                className={cn(
                  display,
                  "mt-4 text-5xl font-black leading-none sm:text-6xl",
                )}
              >
                Real code.
                <span className="block text-secondary">Race pressure.</span>
              </h2>
              <p className={cn("mt-6 max-w-xl", body)}>
                KeyClash turns typing into a timing event: same snippet, visible
                pace, ranked consequences, no decorative practice wheels.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="bg-background/20 backdrop-blur-sm p-4 font-mono text-sm"
            >
              <div className="border-b border-border pb-3 text-xs uppercase text-syn-punct">
                race_control.rs
              </div>
              <pre className="mt-4 overflow-x-auto leading-7">
                <code>
                  <span className="text-primary">match</span>
                  <span className="text-syn-plain"> lane.pressure() </span>
                  <span className="text-syn-punct">{"{"}</span>
                  {"\n  "}
                  <span className="text-secondary">Clean</span>
                  <span className="text-syn-plain"> =&gt; rank.commit(),</span>
                  {"\n  "}
                  <span className="text-secondary">Panic</span>
                  <span className="text-syn-plain"> =&gt; elo.bleed(),</span>
                  {"\n"}
                  <span className="text-syn-punct">{"}"}</span>
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-8">
            {featureList.map((feature) => (
              <motion.div
                key={feature.label}
                variants={fadeUp}
                className="grid gap-3 border-b border-border py-6 sm:grid-cols-[14rem_minmax(0,1fr)]"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.label}
                </h3>
                <p className={body}>{feature.copy}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </Wrap>

      <Wrap className="py-14 sm:py-20">
        <motion.section
          id="leaderboard"
          initial="hidden"
          whileInView="visible"
          viewport={sectionInView}
          variants={stagger()}
          className="border border-border bg-kc-surface-deep p-4 sm:p-6 lg:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={cn(label, "flex items-center gap-2")}>
                <span className="kc-live-pulse size-2 rounded-full bg-accent" />
                Live rankings
              </p>
              <h2
                className={cn(
                  display,
                  "mt-3 text-5xl font-black leading-none sm:text-6xl",
                )}
              >
                Timing board
              </h2>
            </div>
            <p className="max-w-sm font-mono text-sm text-syn-punct">
              Updated every 30s across active ranked regions.
            </p>
          </div>

          <div className="mt-8 space-y-2">
            {leaderboardRows.map((row) => (
              <motion.article
                key={row.user}
                variants={fadeUp}
                className={cn(
                  "relative grid grid-cols-[2.5rem_minmax(0,1fr)_4rem] items-center gap-3 overflow-hidden border px-3 py-4 font-mono sm:grid-cols-[3rem_minmax(0,1fr)_5rem_5rem_6rem_3rem] sm:px-5",
                  row.rowClass,
                )}
              >
                <span className="font-semibold tabular-nums text-secondary">
                  {row.rank}
                </span>
                <span className="min-w-0 truncate font-semibold text-foreground">
                  {row.user}
                </span>
                <span className="text-right font-semibold tabular-nums text-foreground">
                  {row.elo}
                </span>
                <span className="hidden text-right tabular-nums text-muted-foreground sm:block">
                  {row.wpm}
                </span>
                <span
                  className={cn(
                    "hidden justify-self-end border px-3 py-1 text-xs font-semibold uppercase sm:inline-flex",
                    row.badgeClass,
                  )}
                >
                  {row.tier}
                </span>
                <span className="hidden text-right font-semibold text-accent sm:block">
                  {row.delta}
                </span>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </Wrap>

      <section className="border-y border-border bg-card py-16 sm:py-20 lg:py-24">
        <Wrap>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={sectionInView}
            variants={stagger()}
            className="mx-auto max-w-5xl text-center"
          >
            <motion.h2
              variants={fadeUp}
              className={cn(
                display,
                "text-6xl font-black leading-none text-foreground sm:text-7xl lg:text-8xl",
              )}
            >
              Start on green.
            </motion.h2>

            <motion.div variants={fadeUp} className="mt-8 flex justify-center">
              <RaceButton onClick={onStartDueling} className="sm:min-w-96">
                Start dueling
              </RaceButton>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap justify-center gap-5 font-mono text-xs font-semibold uppercase text-muted-foreground"
            >
              <span>
                <span className="text-accent">●</span> Live matches
              </span>
              <span>
                <span className="text-secondary">●</span> Real code
              </span>
              <span>
                <span className="text-primary">●</span> No bots
              </span>
            </motion.div>
          </motion.div>
        </Wrap>
      </section>
    </section>
  );
}
