# KeyClash

A modern typing practice and competitive platform built with React 19, TypeScript, and Vite. Practice typing, master algorithms, and prepare for real-time 1v1 typing duels.

## 🎯 Features

### Core Modes
- **Practice Mode**: Improve typing speed with curated text passages
- **Algorithm Mode**: Practice typing code and common algorithms
- **KeyClash Mode**: Real-time 1v1 typing duels (Coming Soon)

### Features
- ⚡ Live WPM, accuracy, and progress tracking
- 📊 Comprehensive statistics and analytics page
- 🎨 Light/dark theme with system preference support
- 📱 Fully responsive design
- ⌨️ Keyboard-friendly UI
- 🔄 Real-time data sync with Convex
- 🎯 Separate pages for each mode with routing
- 🔐 Auth-ready header (prepared for Clerk integration)

## 🛠️ Tech Stack

### Core
- React 19 + TypeScript
- Vite 7
- React Router v7
- Tailwind CSS v4

### State & Data
- Zustand (state management)
- Convex (backend & real-time sync)

### UI Components
- Radix UI primitives
- ShadcnUI components
- Lucide React icons
- next-themes for theming

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+ (recommended) or npm/yarn

### Installation

```bash
pnpm install
```

### Development

```bash
# Start the dev server
pnpm dev

# Start Convex development (in a separate terminal)
pnpm convex:dev
```

Then open the dev server URL printed in your terminal (usually `http://localhost:5173`).

### Build for Production

```bash
pnpm build
```

The production build will be emitted to `dist/`.

### Preview Production Build

```bash
pnpm preview
```

## 📜 Scripts

- `dev`: Start Vite dev server
- `build`: Type-check and build for production
- `lint`: Run ESLint
- `preview`: Preview the production build
- `convex:dev`: Start Convex development server
- `convex:deploy`: Deploy Convex functions

## 🗂️ Project Structure

```
src/
├── pages/                      # Page components
│   ├── landing-page.tsx        # Home/landing page
│   ├── practice-page.tsx       # Practice mode
│   ├── algorithm-page.tsx      # Algorithm mode
│   └── keyclash-page.tsx       # KeyClash (placeholder)
├── components/                 # Reusable components
│   ├── app-header.tsx          # Auth-aware header
│   ├── typing-overlay.tsx      # Main typing interface
│   ├── statistics-page.tsx     # Stats & analytics
│   └── ui/                     # ShadcnUI components
├── lib/                        # Utilities & stores
│   ├── practice-store.ts       # Practice mode state
│   ├── stats-store.ts          # Live stats state
│   ├── statistics-store.ts     # Historical stats
│   └── convex-hooks.ts         # Convex integration
├── App.tsx                     # Main app with routing
└── main.tsx                    # Entry point
```

## 🎨 Routing Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Home page with feature overview |
| `/practice` | PracticePage | Practice typing mode |
| `/algorithm` | AlgorithmPage | Algorithm coding mode |
| `/keyclash` | KeyClashPage | 1v1 duel mode (coming soon) |
| `/statistics` | StatisticsPage | View stats & history |

## 🔧 Aliases

Vite alias `@` points to `src`.

```ts
// vite.config.ts
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
}
```

Example import:

```ts
import { TypingOverlay } from '@/components/typing-overlay';
```

## 🎨 Theming

The app uses `next-themes` with a lightweight `ThemeProvider`. Default theme is dark and preference is stored under `vite-ui-theme`. Toggle between light/dark mode using the theme switcher in the header.

## 📦 State Management

Zustand stores provide minimal, predictable state:

- `usePracticeModeStore`: Current mode (practice/algorithm) and typing state
- `useStatsStore`: Live session stats surfaced to the UI
- `useStatisticsStore`: Aggregated/historical statistics

## 🔮 Upcoming Features

### KeyClash Mode (Coming Soon)
- Real-time 1v1 typing duels
- Matchmaking system
- Global leaderboards
- ELO ranking system
- Live opponent progress tracking

### Authentication (Planned)
- Clerk authentication integration
- User profiles and progress tracking
- Cross-device sync
- Social features

## 🛠️ Adding Authentication (Clerk)

The header is already prepared for Clerk integration:

1. Install Clerk:
```bash
pnpm add @clerk/clerk-react
```

2. Update `main.tsx`:
```tsx
import { ClerkProvider } from '@clerk/clerk-react';

// Wrap app with ClerkProvider
<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
  <App />
</ClerkProvider>
```

3. Update `app-header.tsx`:
```tsx
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';

// Replace the placeholder auth section
{user ? <UserButton /> : <SignInButton />}
```

## 📝 Environment Variables

Create a `.env.local` file:

```env
# Convex
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud

# Clerk (when ready)
# VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © 2025

---

Built with ❤️ using React, TypeScript, and modern web technologies.
