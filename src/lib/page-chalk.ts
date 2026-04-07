/**
 * Route ↔ chalk mapping (matches app header nav).
 * Use `pageChalkCssValue(id)` for `--page-chalk` on layout shells.
 */

export const PAGE_CHALK_CSS_VAR = {
  duel: "--chalk-indigo",
  history: "--chalk-coral",
  practice: "--chalk-teal",
  stats: "--chalk-amber",
} as const;

/** Dark readable foreground paired with each chalk surface */
export const PAGE_CHALK_FG_CSS_VAR = {
  duel: "--chalk-indigo-fg",
  history: "--chalk-coral-fg",
  practice: "--chalk-teal-fg",
  stats: "--chalk-amber-fg",
} as const;

export type PageChalkId = keyof typeof PAGE_CHALK_CSS_VAR;

export function pageChalkCssValue(id: PageChalkId): string {
  return `var(${PAGE_CHALK_CSS_VAR[id]})`;
}

export function pageChalkFgCssValue(id: PageChalkId): string {
  return `var(${PAGE_CHALK_FG_CSS_VAR[id]})`;
}

/** Same rules as `AppHeader` nav active detection */
export function getPageChalkIdFromPathname(pathname: string): PageChalkId {
  if (pathname === "/duels/history") return "history";
  if (pathname === "/practice") return "practice";
  if (pathname === "/statistics") return "stats";
  if (
    pathname === "/" ||
    pathname === "/duels" ||
    pathname.startsWith("/game/")
  ) {
    return "duel";
  }
  return "duel";
}

/** Inactive nav — full class strings for Tailwind */
export const navLinkHoverChalkClass: Record<PageChalkId, string> = {
  duel: "hover:text-[color:var(--chalk-indigo)]",
  history: "hover:text-[color:var(--chalk-coral)]",
  practice: "hover:text-[color:var(--chalk-teal)]",
  stats: "hover:text-[color:var(--chalk-amber)]",
};

/** Active nav — same chalk as the current page accent */
export const navLinkActiveChalkClass: Record<PageChalkId, string> = {
  duel: "text-[color:var(--chalk-indigo)]",
  history: "text-[color:var(--chalk-coral)]",
  practice: "text-[color:var(--chalk-teal)]",
  stats: "text-[color:var(--chalk-amber)]",
};
