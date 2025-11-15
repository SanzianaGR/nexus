import { Github, Book, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#403447] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold mb-2">Made by snz 🦊</p>
            <p className="text-sm text-white/60">
              Built with React, Gemini AI, and a deep passion of connecting the
              dots
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/SanzianaGR/nexus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">Source code</span>
            </a>

            <a
              href="https://docs.nexus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Book className="w-5 h-5" />
              <span className="text-sm">Documentation</span>
            </a>

            <a
              href="https://sanzianagrecu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="text-sm">My website</span>
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-white/20 text-center">
          <p className="text-sm text-white/60">
            Based on research by Bower (1969), Collins & Loftus (1975), and
            Watts & Strogatz (1998)
          </p>
          <p className="text-xs text-white/40 mt-2">
            © 2025 Nexus • Built for the CS Girlies Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
}
