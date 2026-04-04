import { getLeaderboardPathname, scrollToLeaderboard } from "@/lib/leaderboard-nav";
import { glass } from "@/lib/glass-styles";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto px-4 sm:px-6">{children}</div>;
}

export function Footer() {
  const location = useLocation();
  const leaderboardBase = getLeaderboardPathname(location.pathname);

  return (
    <footer className={cn("w-full py-6", glass.footer)}>
      <Wrap>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[13px] font-bold text-primary tracking-tight">KeyClash</span>
            <span className="font-mono text-[9px] text-muted-foreground tracking-[0.15em]">· The faster compiler wins.</span>
          </div>

          <div className="flex gap-6">
            <Link
              to="/practice"
              className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
            >
              Practice
            </Link>
            <Link
              to={{ pathname: leaderboardBase, hash: "leaderboard" }}
              onClick={(e) => {
                if (location.pathname === "/" || location.pathname === "/duels") {
                  e.preventDefault();
                  scrollToLeaderboard(location.pathname);
                }
              }}
              className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
            >
              Leaderboard
            </Link>
          </div>

          <p className="font-mono text-[9px] text-muted-foreground tracking-[0.12em]">
            <span className="text-primary">■</span> you &nbsp;
            <span className="text-secondary">■</span> opponent
          </p>
        </div>
      </Wrap>
    </footer>
  );
} 