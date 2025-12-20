import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TextType from "../TextType";

const CodeSnippet = () => (
  <div className="font-mono text-xs sm:text-sm text-muted-foreground bg-transparent backdrop-blur-sm p-4 rounded border w-full max-w-md mx-auto select-none pointer-events-none">
    <div className="flex gap-2 mb-2">
      <div className="w-3 h-3 rounded-full bg-primary/50"></div>
      <div className="w-3 h-3 rounded-full bg-primary/50"></div>
      <div className="w-3 h-3 rounded-full bg-primary/50"></div>
    </div>
    <p>
      <span className="text-purple-400">const</span>{" "}
      <span className="text-blue-400">accelerate</span> ={" "}
      <span className="text-yellow-300">async</span> (){" "}
      <span className="text-purple-400">=&gt;</span> {"{"}
    </p>
    <p className="pl-4">
      <span className="text-purple-400">await</span>{" "}
      <span className="text-blue-400">typing</span>.
      <span className="text-yellow-300">upgrade</span>({"{"}
    </p>
    <p className="pl-8">
      speed: <span className="text-emerald-400">Infinity</span>,
    </p>
    <p className="pl-8">
      errors: <span className="text-emerald-400">0</span>
    </p>
    <p className="pl-4">{"}"});</p>
    <p>{"};"}</p>
  </div>
);

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative mt-10 py-12 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <Badge
            variant="outline"
            className="gap-2 font-mono text-xs text-primary border-border bg-background/60"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            v2.0 is live. Key bindings unlocked.
          </Badge>
        </motion.div>

        {/* Heading */}
        <h1 className="relative text-5xl sm:text-7xl font-mono font-bold -tracking-tighter text-foreground mb-6">
          {/* Invisible placeholder */}
          <span className="invisible block">Code at the speed of thought</span>

          {/* Animated text */}
          <span className="absolute inset-0">
            <TextType
              text={["Code at the speed of thought"]}
              typingSpeed={75}
              pauseDuration={1500}
              loop={false}
              showCursor={true}
              cursorCharacter="_"
            />
          </span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed"
        >
          Stop hunting for keys. Build muscle memory for real syntax.
          <br className="hidden sm:block" />
          Brackets, braces, and logic flow—mastered.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            className="gap-2 font-bold"
            onClick={() => navigate("/practice")}
          >
            Start Practice <ArrowRight className="w-4 h-4" />
          </Button>

          <Button size="lg" variant="outline" className="font-medium">
            View Leaderboard
          </Button>
        </motion.div>

        {/* Code snippet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.7 }}
        >
          <CodeSnippet />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
