import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Swords,
  ShieldCheck,
  Zap,
  Globe,
  GitCommit,
  Trophy,
} from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface DuelsLandingProps {
  onEnterQueue: () => void
}

const DuelSimulation: React.FC = () => {
  const [p1Progress, setP1Progress] = useState(0)
  const [p2Progress, setP2Progress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setP1Progress((prev) => (prev >= 100 ? 0 : prev + Math.random() * 2 + 0.5))
      setP2Progress((prev) => (prev >= 100 ? 0 : prev + Math.random() * 2 + 0.2))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto bg-background/60 border border-border p-6 relative overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-6">
          {/* Player 1 */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-primary">YOU (US-EAST)</span>
              <span className="text-muted-foreground">{Math.min(100, Math.floor(p1Progress))}%</span>
            </div>

            <div className="h-2 bg-background/40 rounded-full overflow-hidden border border-border">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${Math.min(100, p1Progress)}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            <div className="mt-2 font-mono text-[10px] text-muted-foreground truncate">
              const [state, dispatch] = useReducer(reducer, initialState);
            </div>
          </div>

          {/* Divider with VS */}
          <div className="relative flex items-center justify-center">
            <Separator className="w-full" />
            <div className="absolute px-2 bg-background text-xs font-mono text-muted-foreground">VS</div>
          </div>

          {/* Player 2 */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-destructive">OPPONENT (EU-WEST)</span>
              <span className="text-muted-foreground">{Math.min(100, Math.floor(p2Progress))}%</span>
            </div>

            <div className="h-2 bg-background/40 rounded-full overflow-hidden border border-border">
              <motion.div
                className="h-full bg-destructive"
                style={{ width: `${Math.min(100, p2Progress)}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            <div className="mt-2 font-mono text-[10px] text-muted-foreground truncate">
              const [state, dispatch] = useReducer(reducer, initialState);
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const DuelsLanding: React.FC<DuelsLandingProps> = ({ onEnterQueue }) => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/20 bg-destructive/6 text-xs font-mono text-destructive mb-8">
          <Swords className="w-3 h-3" />
          <span>RANKED SEASON 1 LIVE</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
          RUNTIME{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/70">
            RIVALS
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Real-time 1v1 typing battles. Identical code snippets.
          <br className="hidden md:block" />
          Zero latency. The faster compiler wins.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" onClick={onEnterQueue} className="gap-2 font-bold">
            <Swords className="w-4 h-4" />
            ENTER QUEUE
          </Button>
        </div>

        <DuelSimulation />
      </section>

      {/* Mechanics Grid */}
      <section className="max-w-6xl mx-auto mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 bg-transparent backdrop-blur-sm border border-border hover:border-border/60 transition-colors">
          <CardHeader className="p-0">
            <div className="w-12 h-12 bg-background rounded flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Global Matchmaking</h3>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground leading-relaxed">
              Face developers from around the world. ELO-based pairing ensures you compete against your skill bracket.
            </p>
          </CardContent>
        </Card>

        <Card className="p-8 bg-transparent backdrop-blur-sm border border-border hover:border-border/60 transition-colors">
          <CardHeader className="p-0">
            <div className="w-12 h-12 bg-background rounded flex items-center justify-center mb-6">
              <GitCommit className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Deterministic Sync</h3>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground leading-relaxed">
              Both players receive the exact same code seed. No RNG. No luck. Just input bandwidth.
            </p>
          </CardContent>
        </Card>

        <Card className="p-8 bg-background/60 border border-border hover:border-border/60 transition-colors">
          <CardHeader className="p-0">
            <div className="w-12 h-12 bg-background rounded flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Live Feedback</h3>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground leading-relaxed">
              See your opponent's cursor progress in real-time. Feel the pressure of their pace.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Fairness & Stats */}
      <section className="max-w-4xl mx-auto bg-background/70 border border-border overflow-hidden mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              Competitively Fair
            </h3>

            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-background/40 mt-2" />
                <span>Strict anti-cheat heuristics monitoring keystroke timing variance.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-background/40 mt-2" />
                <span>Penalties for accuracy drops. 95% minimum to qualify.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-background/40 mt-2" />
                <span>Server-authoritative state. No client-side trust.</span>
              </li>
            </ul>
          </div>

          <div className="bg-background p-10 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border">
            <div className="flex justify-between items-end mb-8">
              <div>
                <div className="text-xs font-mono text-muted-foreground mb-1">VICTORY</div>
                <div className="text-3xl font-bold text-foreground">MATCH_0492</div>
              </div>
              <Trophy className="w-8 h-8 text-warning" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">WPM Differential</span>
                <span className="font-mono text-primary">+12</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-mono text-foreground">99.4%</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Rating Change</span>
                <span className="font-mono text-primary">+24</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Ready to prove your syntax?</h2>
        <Button variant="link" onClick={onEnterQueue} className="font-mono text-sm text-primary">
          FIND_OPPONENT -&gt;
        </Button>
      </div>
    </div>
  )
}

export default DuelsLanding
