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
  Star,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "../UI/Button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../UI/Footer";

export function Landing() {
  const navigate = useNavigate();
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
      <section className="min-h-screen flex items-center relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                Forget flashcards. Forget lists. Forget impossible crosswords.
                <br />
                Learn languages the way your mind actually works—through{" "}
                <strong className="text-[#E84393]">connections</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/setup")}
                  className="bg-[#E84393] hover:bg-[#d63884] text-white px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all group"
                >
                  <span className="flex items-center gap-3">
                    Play
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>

                <button
                  onClick={() =>
                    document
                      .getElementById("story")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center justify-center gap-2 text-[#403447] hover:text-[#E84393] transition-colors px-8 py-6"
                >
                  <ChevronDown className="w-5 h-5 animate-bounce" />
                  <span className="text-lg font-medium">
                    Scroll to learn more
                  </span>
                </button>
              </div>
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
      {/* What Is This Section */}
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

            {/* Nexus Definition Box */}
            <div className="mb-10 p-8 bg-[#F5F1E8] border-l-4 border-[#E84393] rounded-r-xl">
              <h3 className="text-2xl font-bold text-[#403447] mb-3">nex·us</h3>
              <p className="text-lg text-[#403447]/80 italic mb-2">
                /ˈneksəs/ • noun
              </p>
              <p className="text-lg text-[#403447]/80 leading-relaxed">
                A connection or series of connections linking two or more
                things. A central point where things converge and interact.
              </p>
            </div>

            <div className="space-y-6 text-lg text-[#403447]/80 leading-relaxed">
              <p>
                Nexus is a language learning app built on a simple idea:{" "}
                <strong className="text-[#E84393]">
                  words don't exist in isolation
                </strong>
                .
              </p>

              <p>
                When you think "school", you don't actually think of a
                definition, right? A building pops up in your mind, or maybe
                your classmate, or your best friend you found in school, or{" "}
                <em className="text-[#E84393]">
                  your scratched-up desk from middle school
                </em>
                , or{" "}
                <em className="text-[#E84393]">
                  that feeling of dread when the teacher is about to call on you
                </em>
                , or maybe{" "}
                <em className="text-[#E84393]">your favorite subject</em>.
              </p>

              <p>
                An entire network fires up, and it's easy to traverse from one
                end to the other. That's how memory actually works.
              </p>

              <p>
                Most language apps like Duolingo, Babbel, or Memrise focus on{" "}
                <strong>repetition, flashcards, or grammar drills</strong>.
                Crossword apps, on the other hand, focus on{" "}
                <strong>trivia and word recall</strong>, not learning. Wordle is
                not for beginners.
              </p>

              <p>
                No major product combines AI-generated linguistic puzzles with
                adaptive vocabulary learning through semantic networks.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Personal Story Section */}
      <section className="py-24 px-6 bg-[#F5F1E8]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#403447] mb-8">
              Why I built this
            </h2>

            <div className="space-y-6 text-lg text-[#403447]/80 leading-relaxed">
              <p>
                I came to the Netherlands as a foreign student from Romania. I
                tried everything to learn Dutch—Duolingo, Babbel, flashcard
                apps, grammar books, I wanted to do a wordle in Dutch.
              </p>

              <p>
                Nothing worked. The traditional methods felt robotic. I was
                memorizing words but not{" "}
                <em className="text-[#E84393]">understanding</em> them.
              </p>

              <p>
                Then I realized something: the only way I was actually learning
                was by{" "}
                <strong className="text-[#E84393]">making connections</strong>.
              </p>

              <p>
                When I learned "fiets" (bike), I didn't memorize it in
                isolation. I connected it to "fietsen" (to bike), "fietsenrek"
                (bike rack), "fietsbel" (bike bell)—a whole web of related
                concepts. That's when it stuck.
              </p>

              <p className="font-semibold text-[#403447]">
                So I built Nexus for... me, or to teach the way I actually
                learn. And maybe the way you learn too. Made by a student for
                students 🤝
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Interactive Demo */}
      <section
        id="demo"
        className="py-32 px-6 bg-white relative overflow-hidden"
      >
        <InteractiveGraphDemo />
      </section>
      {/* Science Section */}
      <section className="py-24 px-6 bg-[#F5F1E8]">
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
                  This is how we're wired
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
                  "school" makes you think of "teacher" without trying.
                </p>
                <p className="text-sm text-[#403447]/50 italic">
                  Nexus is teaching your brain to do this across languages.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Features - Simplified */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <SimpleFeatureCard
              icon={Brain}
              title="AI-generated puzzles"
              delay={0}
            />
            <SimpleFeatureCard icon={Globe} title="5 languages" delay={0.1} />
            <SimpleFeatureCard
              icon={Link2}
              title="Hints when stuck"
              delay={0.2}
            />
            <SimpleFeatureCard
              icon={Sparkles}
              title="Actually fun"
              delay={0.3}
            />
          </div>
        </div>
      </section>
      {/* Personal Note - Simplified */}
      <section className="py-16 px-6 bg-[#F5F1E8]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-[#403447]/80 leading-relaxed mb-8">
              Built in 48 hours. Scrappy, imperfect, but genuinely useful.
              <br />
              If you find bugs or have ideas, I'd love to hear from you.
              <br />
              This is just the beginning.
            </p>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-[#403447] hover:text-[#E84393] transition-colors group"
            >
              <ChevronDown className="w-5 h-5 rotate-180 group-hover:-translate-y-1 transition-transform" />
              <span className="text-sm font-medium">Back to top</span>
            </button>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
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
        {[...Array(20)].map((_, i) => {
          const baseCx = (i * 123) % 100;
          const baseCy = (i * 456) % 100;

          return (
            <circle
              key={i}
              cx={`${baseCx}%`}
              cy={`${baseCy}%`}
              r="2"
              fill="url(#glow)"
            >
              <animate
                attributeName="cx"
                values={`${baseCx}%;${(baseCx + 5) % 100}%;${baseCx}%`}
                dur="10s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${baseCy}%;${(baseCy + 5) % 100}%;${baseCy}%`}
                dur="12s"
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>
    </div>
  );
}

// Floating Word Cards
function FloatingWordCards() {
  const words = [
    { word: "pisică", translation: "cat", color: "#FFB5D6" },
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
          <InteractiveNode word="pisică" translation="cat" revealed />
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
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-[#403447] text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap z-10">
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

// Simple Feature Card
function SimpleFeatureCard({ icon: Icon, title, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="p-6 bg-white border-2 border-[#FFB5D6]/50 rounded-2xl hover:border-[#E84393] hover:shadow-lg transition-all group text-center"
    >
      <div className="inline-block p-3 bg-[#FFB5D6]/20 rounded-2xl mb-3 group-hover:bg-[#E84393]/20 transition-all">
        <Icon className="w-8 h-8 text-[#E84393]" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold text-[#403447]">{title}</h3>
    </motion.div>
  );
}
