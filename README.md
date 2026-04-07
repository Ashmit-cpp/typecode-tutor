# KeyClash

KeyClash is a typing practice app with real-time 1v1 duels. It is built with React 19, TypeScript, Vite, and a Convex backend. Users can drill on prose or algorithm snippets, review statistics, queue for matches, and race opponents in shared games.

## Features

- **Solo practice** (`/practice`): Switch between plain-text passages and algorithm-style code snippets; live WPM, accuracy, and progress.
- **Statistics** (`/statistics`): Historical tests, charts, and per-mode breakdowns backed by Convex.
- **Duels**: Landing at `/` and `/duels` with matchmaking; signed-in users join the queue and are routed to `/game/:gameId` for live head-to-head typing.
- **Duel history** (`/duels/history`): Finished games and outcomes.
- **Auth**: [Clerk](https://clerk.com/) for sign-in and user identity, wired to Convex via `ConvexProviderWithClerk`.
- **Theming**: Light/dark mode (`next-themes`, default dark) with preference stored under `vite-ui-theme`.
- **Responsive UI**: Mobile-first layouts, glass-style panels, and keyboard-friendly controls.

## Tech stack

| Area | Libraries |
|------|-----------|
| App | React 19, TypeScript, Vite 7, React Router 7 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`), `tw-animate-css` |
| Backend | Convex (queries, mutations, real-time sync, matchmaking) |
| Auth | `@clerk/clerk-react`, `@clerk/themes` (shadcn appearance) |
| State | Zustand |
| UI | Radix primitives, Lucide icons, Sonner toasts, Recharts |
| Motion / 3D (landing) | Framer Motion, GSAP, React Three Fiber, Three.js |

## Prerequisites

- **Node.js** 18 or newer (20+ recommended for tooling)
- **pnpm** 9+ (the repo pins a version in `packageManager`; use `corepack enable` if needed)
- **Convex** account for backend deployment and local dev
- **Clerk** application with a publishable key (required at startup; see below)

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values. The app **requires** at least:

- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key (the app throws if this is missing).
- `VITE_CONVEX_URL` — Convex deployment URL (from `convex dev` or the Convex dashboard).

For authenticated Convex functions, configure Clerk JWT with Convex per [Convex + Clerk](https://docs.convex.dev/auth/clerk): set `CLERK_JWT_ISSUER_DOMAIN` (and mirror `VITE_CLERK_JWT_ISSUER_DOMAIN` where your tooling expects it). Server-side Convex env vars (for example `CLERK_SECRET_KEY` during deploy) belong in the Convex dashboard or local Convex env as documented in Convex setup guides.

### 3. Run the stack

Run the Vite app and Convex in two terminals:

```bash
pnpm convex:dev
```

```bash
pnpm dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Vite development server |
| `pnpm build` | Deploys Convex and runs `build:vite` (codegen, `tsc`, Vite production build) |
| `pnpm build:vite` | Convex codegen, TypeScript build, then Vite build (used inside deploy) |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | ESLint |
| `pnpm convex:dev` | Convex dev server (sync, codegen, local backend) |
| `pnpm convex:deploy` | Deploy Convex functions |
| `pnpm convex:codegen` | Generate Convex client types |

## Routes

| Path | Description |
|------|-------------|
| `/`, `/duels` | KeyClash landing; queue for a duel when signed in |
| `/practice` | Solo typing (text + algorithm modes) |
| `/statistics` | Stats and history for practice tests |
| `/game/:gameId` | Live duel session |
| `/duels/history` | Finished duel history |

There is no separate `/algorithm` route: **algorithm** practice is a mode inside `/practice` (same overlay, different content).

## Project structure

```
src/
├── routes/
│   └── app-routes.tsx       # Lazy-loaded routes, duel queue wrapper
├── layouts/
│   ├── MainLayout.tsx       # Duels, game, history shells
│   └── PracticeLayout.tsx   # Practice + statistics shells
├── pages/
│   ├── keyclash-page.tsx    # Landing sections + navigation into queue/practice
│   ├── practice-page.tsx
│   ├── game-page.tsx
│   └── duels-history-page.tsx
├── components/
│   ├── typing-overlay.tsx   # Core solo typing UI
│   ├── statistics-page.tsx
│   ├── landing/             # Marketing / hero sections
│   ├── app-header.tsx
│   └── ui/                    # Shared primitives (buttons, cards, etc.)
├── lib/
│   ├── practice-store.ts, stats-store.ts, statistics-store.ts
│   ├── convex-hooks.ts      # Convex React hooks
│   ├── game-hooks.ts        # Matchmaking / game helpers
│   └── ...
├── App.tsx                  # Theme, toaster, global Convex user settings
└── main.tsx                 # Clerk + Convex providers

convex/
├── schema.ts                # testResults, userSettings, games, texts
├── matchmaking.ts, game.ts, history.ts, functions.ts
└── auth.config.ts           # Clerk JWT issuer for Convex auth
```

## Path alias

Vite resolves `@` to `src/`:

```ts
import { AppRoutes } from "@/routes/app-routes";
```

## State and data

- **Zustand**: Practice mode, live session stats, and statistics UI state.
- **Convex**: Persists test results, user settings, game/matchmaking documents, and duel history; subscriptions keep the UI in sync where used.

## Contributing

Pull requests are welcome. Please run `pnpm lint` and ensure the app builds (`pnpm build` or at least `pnpm build:vite` when not deploying) before submitting.

## License

MIT © 2026
