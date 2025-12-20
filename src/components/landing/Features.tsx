import {
  Code2,
  BrainCircuit,
  Keyboard,
  Zap,
  Hash,
  Layers,
} from "lucide-react"
import type { LucideIcon } from 'lucide-react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Metric {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface Mode {
  title: string;
  tagline: string;
  description: string;
  tags: string[];
}
import { Card, CardHeader, CardContent } from "@/components/ui/card"

const features: Feature[] = [
  {
    id: "1",
    title: "Real Syntax",
    description:
      "No prose. No 'quick brown fox'. Practice on React, Rust, Go, and Python codebases directly.",
    icon: Code2,
  },
  {
    id: "2",
    title: "Smart Learning",
    description:
      "We track your weak digrams. Struggle with `{}` or `=>`? We generate drills to fix it.",
    icon: BrainCircuit,
  },
  {
    id: "3",
    title: "Shortcuts First",
    description:
      "Learn IDE navigation commands. Ctrl+P, Alt+Shift+Down. Typing is only half the battle.",
    icon: Keyboard,
  },
  {
    id: "4",
    title: "Burst Mode",
    description:
      "High-intensity interval typing. Train for the sprints needed during crunch time.",
    icon: Zap,
  },
  {
    id: "5",
    title: "Zero Latency",
    description:
      "Local-first architecture. Every keystroke is instant. No lag, just flow.",
    icon: Layers,
  },
  {
    id: "6",
    title: "Minimal UI",
    description:
      "No distractions. No ads. Just you and the cursor. The terminal experience you love.",
    icon: Hash,
  },
]

const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="py-24 px-6 mb-16"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-mono text-primary font-bold uppercase tracking-wider mb-2">
            System Specs
          </p>

          <h3 className="text-3xl font-bold text-foreground">
            Built for the modern stack.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="group flex flex-col gap-2 bg-transparent backdrop-blur-sm border border-border transition-all duration-300 hover:bg-background/70 hover:border-primary/40"
            >
              <CardHeader className="pb-0">
                <div className="w-12 h-12 rounded-md bg-background border border-border flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="w-6 h-6 text-secondary transition-colors duration-300 group-hover:text-primary" />
                </div>

                <h4 className="text-lg font-bold text-primary transition-colors group-hover:text-primary">
                  {feature.title}
                </h4>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
