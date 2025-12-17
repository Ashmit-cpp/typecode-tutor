import { useState } from "react"
import clsx from "clsx"
import { motion, AnimatePresence } from "framer-motion"
import type { Mode } from "@/lib/types"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const modes: Mode[] = [
  {
    title: "ZEN",
    tagline: "Endless Flow",
    description:
      "No timers. No scores. Just an infinite stream of real-world code snippets. Perfect for warming up before a coding session or calming down after a bug hunt.",
    tags: ["Infinite", "Relaxed", "Warmup"],
  },
  {
    title: "BLITZ",
    tagline: "Speed Drill",
    description:
      "60 seconds on the clock. High-density syntax. Push your WPM to the limit while maintaining 98%+ accuracy. Penalties for typos are severe.",
    tags: ["Timer", "High Intensity", "Ranked"],
  },
  {
    title: "DEBUG",
    tagline: "Correction Mastery",
    description:
      "A unique mode where the code is already written—but full of typos. Your goal: navigate and fix them using only keyboard shortcuts. No mouse allowed.",
    tags: ["Navigation", "Vim/Emacs", "Shortcuts"],
  },
]

const Modes: React.FC = () => {
  const [activeMode, setActiveMode] = useState(0)

  return (
    <section id="modes" className="py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Left Side */}
        <div className="lg:w-1/3">
          <p className="text-sm font-mono text-primary font-bold uppercase tracking-wider mb-2">
            Select Protocol
          </p>

          <h3 className="text-3xl font-bold text-foreground mb-6">
            Choose your challenge.
          </h3>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            Different days call for different training. Whether you need to
            enter flow state or sharpen your reflexes, we have a kernel for
            that.
          </p>

          <div className="flex flex-col gap-2">
            {modes.map((mode, idx) => {
              const isActive = activeMode === idx

              return (
                <Button
                  key={mode.title}
                  variant="ghost"
                  onClick={() => setActiveMode(idx)}
                  className={clsx(
                    "h-auto justify-start px-6 py-4 rounded-md border text-left transition-all",
                    isActive
                      ? "bg-background border-primary/50 text-foreground shadow-[0_0_16px_hsl(var(--primary)/0.15)]"
                      : "border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground"
                  )}
                >
                  <div>
                    <div className="font-mono font-bold text-lg">
                      {mode.title}
                    </div>

                    {isActive && (
                      <motion.div
                        layoutId="mode-tagline"
                        className="text-xs text-primary mt-1"
                      >
                        // {mode.tagline}
                      </motion.div>
                    )}
                  </div>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Right Side */}
        <Card className="lg:w-2/3 relative h-[400px] bg-transparent backdrop-blur-sm border border-border overflow-hidden">
          {/* Accent gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_60%)]" />

          <CardContent className="relative z-10 h-full flex items-center p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-lg"
              >
                <div className="flex gap-2 mb-6 flex-wrap">
                  {modes[activeMode].tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="font-mono text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h4 className="text-2xl font-bold text-foreground mb-4">
                  {modes[activeMode].tagline}
                </h4>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {modes[activeMode].description}
                </p>

                <div className="mt-8 pt-8 border-t border-border flex items-center gap-4">
                  <div className="h-2 flex-1 bg-background/60 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4" />
                  </div>

                  <span className="font-mono text-xs text-primary">
                    READY_TO_DEPLOY
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Modes
