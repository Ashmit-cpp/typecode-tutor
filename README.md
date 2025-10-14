# Typecode Tutor

A fast, modern typing practice app built with React 19, TypeScript, and Vite. It features a focused practice experience with live stats, a dedicated statistics page, and a polished UI with dark mode.

## Features

- Practice mode with fluid typing experience
- Live WPM, accuracy, and progress in a footer during typing
- Statistics page for historical insights
- Light/dark theme with system preference support
- Accessible, keyboard-friendly UI components
- Sensible state management via Zustand
- Fast dev/build via Vite and Tailwind CSS v4

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- Zustand (state management)
- Radix UI primitives
- lucide-react icons
- next-themes for theming

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+ (recommended) or npm/yarn

### Install

```bash
pnpm install
# or
npm install
```

### Develop

```bash
pnpm dev
# or
npm run dev
```

Then open the dev server URL printed in your terminal.

### Build

```bash
pnpm build
# or
npm run build
```

The production build will be emitted to `dist/`.

### Preview Production Build

```bash
pnpm preview
# or
npm run preview
```

## Scripts

- `dev`: Start Vite dev server
- `build`: Type-check and build for production
- `lint`: Run ESLint
- `preview`: Preview the production build


## Aliases

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

## Theming

The app uses `next-themes` with a lightweight `ThemeProvider`. Default theme is dark and preference is stored under `vite-ui-theme`.

## State Management

Zustand stores provide minimal, predictable state:

- `usePracticeModeStore`: current typing mode (e.g., input vs typing)
- `useStatsStore`: live session stats surfaced to the UI
- `statistics-store`: aggregated/historical stats


## License

MIT © 2025
