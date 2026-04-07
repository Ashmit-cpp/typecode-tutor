import { cn } from "@/lib/utils";

interface KeyClashWordmarkProps {
  className?: string;
}

/** Single brand color; use secondary accents in UI (tags, links) instead of splitting the name. */
export function KeyClashWordmark({ className }: KeyClashWordmarkProps) {
  return <span className={cn("text-primary", className)}>KeyClash</span>;
}
