import { cn } from "@/lib/utils";

/** Liquid-glass surfaces: blur, translucent fill, soft edge light, depth shadow */
export const glass = {
  panel:
    "rounded-[var(--radius)] border border-white/[0.12] bg-card/25 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_12px_48px_-12px_rgba(0,0,0,0.45)]",
  panelSubtle:
    "rounded-[var(--radius)] border border-white/[0.08] bg-card/20 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_32px_-8px_rgba(0,0,0,0.35)]",
  divider: "border-white/[0.08]",
  /** Full-width header strip */
  header:
    "border-b border-white/[0.08] bg-background/50 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  /** Full-width footer strip */
  footer:
    "border-t border-white/[0.08] bg-background/50 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  /** Menus / popovers */
  popover:
    "border border-white/[0.1] bg-popover/75 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_40px_-8px_rgba(0,0,0,0.45)]",
} as const;

/** Primary CTA — matches landing hero primary */
export const glassPrimaryButton =
  "border border-white/15 bg-primary/85 text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),var(--shadow-primary-glow)] backdrop-blur-md hover:bg-primary/95 hover:brightness-105";

/** Secondary / ghost — frosted neutral */
export const glassGhostButton =
  "border border-white/[0.12] bg-white/[0.04] text-muted-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl hover:border-primary/35 hover:bg-primary/[0.08] hover:text-foreground";

export function glassCardClassName(...extra: (string | undefined)[]) {
  return cn("p-2 gap-0 overflow-hidden rounded-[var(--radius)] shadow-none", glass.panel, ...extra);
}
