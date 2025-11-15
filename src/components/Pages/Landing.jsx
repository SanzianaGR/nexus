import {
  Brain,
  Network,
  Globe,
  ArrowRight,
  Sparkles,
  Link2,
  Book,
  Github,
  ExternalLink,
  Check,
  Zap,
  Star,
  MessageCircle,
} from "lucide-react";
import { Button } from "../UI/Button";
import { useGame } from "../../context/GameContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Landing() {
  const { setCurrentPage } = useGame();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#403447] overflow-hidden">
      {/* Animated Background Network */}
      <AnimatedNetwork mousePosition={mousePosition} />

      {/* Hero - Split Screen - KEEP EXACTLY AS IS */}
      <section className="min-h-screen flex items-center relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-6 border-2 border-[#FFB5D6]"
              >
                <Sparkles className="w-5 h-5 text-[#E84393]" />
                <span className="text-sm font-semibold text-[#403447]">
                  Built in 48 hours • Live now
                </span>
              </motion.div>

              <h1 className="text-6xl md:text-7xl font-bold text-[#403447] mb-6 leading-tight">
                Your brain is a <span className="text-[#E84393]">network</span>.
                <br />
                Why isn't your learning?
              </h1>

              <p className="text-xl text-[#403447]/70 mb-8 leading-relaxed">
                Forget flashcards. Forget lists. Learn languages the way your
                mind actually works— through{" "}
                <strong className="text-[#E84393]">connections</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => setCurrentPage("setup")}
                  className="bg-[#E84393] hover:bg-[#d63884] text-white px-8 py-6 text-lg rounded-full font-semibold shadow-2xl hover:shadow-[#E84393]/50 hover:scale-105 transition-all group"
                >
                  <span className="flex items-center gap-3">
                    Start for free
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>

                <Button
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("story")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-white hover:bg-[#FFB5D6]/20 text-[#403447] px-8 py-6 text-lg rounded-full font-semibold border-2 border-[#FFB5D6] shadow-lg transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#E84393]" />
                    See how it works
                  </span>
                </Button>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 mt-12"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB5D6] to-[#E84393] border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#403447]/60">7 languages</span>
                </div>
                <div className="h-6 w-px bg-[#403447]/20" />
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#E84393]" />
                  <span className="text-sm text-[#403447]/60">
                    Science-backed
                  </span>
                </div>
                <div className="h-6 w-px bg-[#403447]/20" />
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#E84393] fill-[#E84393]" />
                  <span className="text-sm text-[#403447]/60">
                    Free forever
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Interactive Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[600px] hidden lg:block"
            >
              <FloatingWordCards />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Is This Section - YOUR AUTHENTIC TEXT */}
      <section id="story" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#403447] mb-8">
              What is this?
            </h2>

            <div className="space-y-6 text-lg text-[#403447]/80 leading-relaxed">
              <p>
                Nexus is a language learning app built on a simple idea:{" "}
                <strong className="text-[#E84393]">
                  words don't exist in isolation
                </strong>
                .
              </p>

              <p>
                When you think "cat," your brain doesn't just retrieve a
                definition. It triggers a cascade—
                <em className="text-[#E84393]">
                  {" "}
                  whiskers, meow, pet, mammal, fluffy
                </em>
                . A whole network lights up.
              </p>

              <p>
                Traditional apps ignore this. They give you flashcards. Lists.
                Isolated vocabulary floating in a void. But that's not how
                memory works.
              </p>

              <p className="font-semibold text-[#403447]">
                So I built an app that teaches through semantic networks
                instead.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo - FULL FEATURED */}
      <section
        id="demo"
        className="py-32 px-6 bg-gradient-to-br from-[#FFB5D6]/10 via-[#F5F1E8] to-[#E84393]/10 relative overflow-hidden"
      >
        <InteractiveGraphDemo />
      </section>

      {/* Science Section - YOUR TEXT */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#403447] mb-8">
              Why does this work?
            </h2>

            <div className="space-y-10">
              <div className="border-l-4 border-[#FFB5D6] pl-6 py-2">
                <h3 className="text-2xl font-bold text-[#403447] mb-3">
                  Semantic clustering
                </h3>
                <p className="text-lg text-[#403447]/80 leading-relaxed mb-2">
                  Research from the 1960s (Bower et al., 1969) showed that
                  people remember organized information{" "}
                  <strong className="text-[#E84393]">3x better</strong> than
                  random lists. Your brain naturally groups things by meaning.
                </p>
                <p className="text-sm text-[#403447]/50 italic">
                  We're just working with how you're wired.
                </p>
              </div>

              <div className="border-l-4 border-[#E84393] pl-6 py-2">
                <h3 className="text-2xl font-bold text-[#403447] mb-3">
                  Small-world networks
                </h3>
                <p className="text-lg text-[#403447]/80 leading-relaxed mb-2">
                  You know the "six degrees of separation" idea? Your mental
                  lexicon works the same way (Watts & Strogatz, 1998). Any word
                  connects to any other through surprisingly short paths.
                </p>
                <p className="text-sm text-[#403447]/50 italic">
                  Language is a web, not a list.
                </p>
              </div>

              <div className="border-l-4 border-[#403447] pl-6 py-2">
                <h3 className="text-2xl font-bold text-[#403447] mb-3">
                  Spreading activation
                </h3>
                <p className="text-lg text-[#403447]/80 leading-relaxed mb-2">
                  Collins & Loftus (1975) proved that when you think of one
                  word, related concepts automatically activate. That's why
                  "cat" makes you think of "whiskers" without trying.
                </p>
                <p className="text-sm text-[#403447]/50 italic">
                  We're teaching your brain to do this across languages.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features - YOUR TEXT */}
      <section className="py-24 px-6 bg-[#F5F1E8]">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-[#403447] mb-16 text-center"
          >
            What you get
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI-generated puzzles"
              description="Every puzzle is unique. Gemini creates semantic networks on the fly, tailored to your level and interests."
              delay={0}
            />
            <FeatureCard
              icon={Globe}
              title="7 languages (for now)"
              description="Spanish, French, German, Japanese, Chinese, Dutch, Romanian. More coming soon."
              delay={0.1}
            />
            <FeatureCard
              icon={Link2}
              title="Hints when you're stuck"
              description="Can't figure out a word? Use hints to get progressively clearer clues. No penalty, just learning."
              delay={0.2}
            />
            <FeatureCard
              icon={Sparkles}
              title="Actually fun"
              description="It feels like solving a puzzle, not studying. Because it is a puzzle."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Personal Note - YOUR TEXT */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#FFB5D6]/30 to-[#E84393]/20">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#403447] mb-6">
              A personal note
            </h2>

            <p className="text-lg text-[#403447]/80 leading-relaxed mb-6">
              I built this for a hackathon in 48 hours. It's scrappy. It's
              imperfect. But it works, and I think it's genuinely useful.
            </p>

            <p className="text-lg text-[#403447]/80 leading-relaxed mb-8">
              If you find bugs (you will), or have ideas (please do), I'd love
              to hear from you. This is just the beginning.
            </p>

            <Button
              size="lg"
              onClick={() => setCurrentPage("setup")}
              className="bg-[#403447] hover:bg-[#403447]/90 text-white px-12 py-6 text-lg rounded-full font-medium shadow-2xl hover:shadow-[#403447]/50 hover:scale-105 transition-all mb-4"
            >
              <span className="flex items-center gap-3">
                Start learning
                <ArrowRight className="w-6 h-6" />
              </span>
            </Button>

            <p className="text-sm text-[#403447]/50">
              No signup. No payment. Just learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#403447] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold mb-2">Made by snz🦊</p>
              <p className="text-sm text-white/60">
                Built with React, Gemini AI, and a deep passion to connect the
                dots
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/yourusername/nexus"
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
              © 2024 Nexus • Built for the CS Girlies Hackathon
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Animated Background Network
function AnimatedNetwork({ mousePosition }) {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-30">
      <svg className="w-full h-full">
        <defs>
          <radialGradient id="glow">
            <stop offset="0%" stopColor="#E84393" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFB5D6" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[...Array(20)].map((_, i) => (
          <motion.circle
            key={i}
            cx={`${(i * 123) % 100}%`}
            cy={`${(i * 456) % 100}%`}
            r="2"
            fill="url(#glow)"
            animate={{
              cx: `${(((i * 123) % 100) + mousePosition.x * 0.01) % 100}%`,
              cy: `${(((i * 456) % 100) + mousePosition.y * 0.01) % 100}%`,
            }}
            transition={{ duration: 2 }}
          />
        ))}
      </svg>
    </div>
  );
}

// Floating Word Cards
function FloatingWordCards() {
  const words = [
    { word: "pisica", translation: "cat", color: "#FFB5D6" },
    { word: "mamifer", translation: "mammal", color: "#E84393" },
    { word: "animal", translation: "animal", color: "#403447" },
  ];

  return (
    <div className="relative w-full h-full">
      {words.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${i * 30}%`,
            left: `${i * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="bg-white px-8 py-6 rounded-2xl shadow-2xl border-2 cursor-pointer hover:scale-110 transition-transform"
            style={{ borderColor: item.color }}
          >
            <div className="text-2xl font-bold" style={{ color: item.color }}>
              {item.word}
            </div>
            <div className="text-sm text-gray-600 mt-1">{item.translation}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Interactive Graph Demo
function InteractiveGraphDemo() {
  const [revealed, setRevealed] = useState({ node2: false, edge2: false });
  const [hints, setHints] = useState({ node2: 0, edge2: 0 });

  const hintTexts = {
    node2: [
      "Click for a hint!",
      "Warm-blooded vertebrate",
      "Starts with 'm'",
      "mamifer",
    ],
    edge2: ["Click for a hint!", "Shows relationship", "Two words", "este un"],
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-bold text-[#403447] mb-4">
          Try it right now
        </h2>
        <p className="text-2xl text-[#403447]/70">
          Click the ??? to reveal. This is how every puzzle works.
        </p>
      </motion.div>

      <div className="bg-white border-4 border-[#E84393] rounded-3xl p-12 md:p-16 shadow-2xl">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-12">
          <InteractiveNode word="pisica" translation="cat" revealed />
          <InteractiveEdge label="este un" revealed />
          <InteractiveNode
            word={revealed.node2 ? "mamifer" : "???"}
            translation={revealed.node2 ? "mammal" : null}
            hint={!revealed.node2 ? hintTexts.node2[hints.node2] : null}
            revealed={revealed.node2}
            onClick={() =>
              !revealed.node2 && setRevealed((r) => ({ ...r, node2: true }))
            }
            onHint={() =>
              setHints((h) => ({ ...h, node2: Math.min(h.node2 + 1, 3) }))
            }
          />
          <InteractiveEdge
            label={revealed.edge2 ? "este un" : "???"}
            revealed={revealed.edge2}
            onClick={() =>
              !revealed.edge2 && setRevealed((r) => ({ ...r, edge2: true }))
            }
          />
          <InteractiveNode word="animal" translation="animal" revealed />
        </div>

        {revealed.node2 && revealed.edge2 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-3 bg-green-100 px-8 py-4 rounded-full">
              <Check className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold text-green-800">
                Perfect! You discovered the semantic network!
              </span>
            </div>
            <p className="text-[#403447]/60">
              Romanian • Beginner Level • cat → mammal → animal
            </p>
          </motion.div>
        ) : (
          <p className="text-center text-[#E84393] font-medium">
            👆 Click ??? to reveal • Click 💡 for hints
          </p>
        )}
      </div>
    </div>
  );
}

// Interactive Node
function InteractiveNode({
  word,
  translation,
  hint,
  revealed,
  onClick,
  onHint,
}) {
  return (
    <motion.div
      whileHover={{ scale: revealed ? 1.02 : 1.1, y: revealed ? 0 : -5 }}
      onClick={onClick}
      className={`relative px-10 py-8 rounded-2xl border-3 min-w-[180px] transition-all ${
        revealed
          ? "bg-green-50 border-green-400 shadow-xl"
          : "bg-[#FFB5D6]/20 border-dashed border-[#E84393] cursor-pointer hover:bg-[#FFB5D6]/40 shadow-lg"
      }`}
    >
      <div className="text-center">
        <div className="text-3xl font-bold text-[#403447] mb-2">{word}</div>
        {translation && (
          <div className="text-sm text-[#403447]/60">{translation}</div>
        )}
      </div>

      {!revealed && onHint && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHint();
          }}
          className="absolute -top-3 -right-3 bg-[#E84393] hover:bg-[#d63884] text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}

      {hint && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-[#403447] text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap">
          💡 {hint}
        </div>
      )}
    </motion.div>
  );
}

// Interactive Edge
function InteractiveEdge({ label, revealed, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: revealed ? 1 : 1.1 }}
      onClick={onClick}
      className={`flex items-center gap-3 ${!revealed && "cursor-pointer"}`}
    >
      <div
        className={`w-16 h-1.5 rounded-full ${
          revealed ? "bg-[#E84393]" : "border-2 border-dashed border-[#E84393]"
        }`}
      />
      <div
        className={`px-6 py-3 text-sm font-bold rounded-full transition-all ${
          revealed
            ? "bg-[#E84393] text-white shadow-lg"
            : "bg-white border-2 border-dashed border-[#E84393] text-[#E84393] hover:bg-[#FFB5D6]/20"
        }`}
      >
        {label}
      </div>
      <div
        className={`w-16 h-1.5 rounded-full ${
          revealed ? "bg-[#E84393]" : "border-2 border-dashed border-[#E84393]"
        }`}
      />
    </motion.div>
  );
}

// Feature Card
function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="p-8 bg-white border-2 border-[#FFB5D6]/50 rounded-2xl hover:border-[#E84393] hover:shadow-2xl hover:shadow-[#E84393]/10 transition-all group"
    >
      <div className="inline-block p-3 bg-[#FFB5D6]/20 rounded-2xl mb-4 group-hover:bg-[#E84393]/20 transition-all">
        <Icon className="w-10 h-10 text-[#E84393]" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-[#403447] mb-3">{title}</h3>
      <p className="text-[#403447]/70 leading-relaxed">{description}</p>
    </motion.div>
  );
}
