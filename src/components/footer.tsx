
import { Github, Twitter, MessageCircle } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="pt-8 pb-6 px-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <div className="font-mono">
              © 2025 KeyClash. Open source typing tutor.
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted/50 transition-colors group"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted/50 transition-colors group"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted/50 transition-colors group"
              aria-label="Discord"
            >
              <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
