/* ─────────────────────────── HOW IT WORKS ──────────────────────────────── */
export const STEPS = [
  {
    n: "01",
    title: "Enter the arena",
    body: "Queue for a ranked duel or invite a rival with a single link. ELO-based matchmaking pairs you in seconds.",
    accentVar: "--chalk-indigo",
  },
  {
    n: "02",
    title: "Type the same snippet",
    body: "Both players receive identical code — byte for byte, language for language. No home-field advantage.",
    accentVar: "--chalk-teal",
  },
  {
    n: "03",
    title: "First to finish wins",
    body: "Accuracy gates apply. Fastest clean compile takes the round, your ELO, and the bragging rights.",
    accentVar: "--chalk-mauve",
  },
];

export const FEATURES = [
  {
    symbol: "1v1",
    label: "Real-time head-to-head",
    desc: "See your opponent's live progress. Every keystroke, every mistake — no lag, no illusion.",
    accentVar: "--chalk-indigo",
  },
  {
    symbol: "{ }",
    label: "Real code, real syntax",
    desc: "Snippets pulled from actual production repos across TS, Go, Rust, C++, Python and more.",
    accentVar: "--chalk-teal",
  },
  {
    symbol: "ELO",
    label: "Ranked seasons",
    desc: "Skill-based ELO matchmaking with seasonal ladders, placement matches, and rank decay.",
    accentVar: "--chalk-amber",
  },
  {
    symbol: "⚡",
    label: "Sub-20ms latency",
    desc: "Input paths tuned so close, nothing sits between your fingers and the leaderboard.",
    accentVar: "--chalk-coral",
  },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, user: "void_ptr", wpm: 186, win: "68%", lang: "TS", elo: 2841 },
  {
    rank: 2,
    user: "stack_smash",
    wpm: 179,
    win: "61%",
    lang: "Rust",
    elo: 2790,
  },
  { rank: 3, user: "lambda_labs", wpm: 174, win: "59%", lang: "Go", elo: 2744 },
  {
    rank: 4,
    user: "segment_fault",
    wpm: 168,
    win: "55%",
    lang: "C++",
    elo: 2688,
  },
  { rank: 5, user: "async_await", wpm: 162, win: "52%", lang: "TS", elo: 2621 },
  { rank: 6, user: "null_ref_ex", wpm: 157, win: "49%", lang: "Go", elo: 2558 },
];
