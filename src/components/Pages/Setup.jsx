import { useState } from "react";
import {
  ArrowLeft,
  Play,
  Globe,
  Zap,
  Github,
  Book,
  ExternalLink,
} from "lucide-react";
import { Button } from "../UI/Button";
import { Loading } from "../UI/Loading";
import { useGame } from "../../context/GameContext";
import { useGemini } from "../../hooks/useGemini";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Footer } from "../UI/Footer";

const LANGUAGES = [
  { code: "romanian", name: "Romanian", flag: "🇷🇴" },
  { code: "dutch", name: "Dutch", flag: "🇳🇱" },
  { code: "english", name: "English", flag: "🇬🇧" },
  { code: "spanish", name: "Spanish", flag: "🇪🇸" },
  { code: "french", name: "French", flag: "🇫🇷" },
];

const DIFFICULTIES = [
  {
    id: "beginner",
    name: "Beginner",
    description: "5 words, easier connections",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "7 words, moderate challenge",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "10 words, complex networks",
  },
];

const THEMES = [
  { id: "", name: "Surprise me", icon: "✨" },
  { id: "animals", name: "Animals", icon: "🦁" },
  { id: "food", name: "Food", icon: "🍕" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "emotions", name: "Emotions", icon: "😊" },
  { id: "nature", name: "Nature", icon: "🌳" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦" },
];

export function Setup() {
  const navigate = useNavigate();
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedTheme,
    setSelectedTheme,
    startNewGame,
  } = useGame();

  const { generatePuzzle, loading, error } = useGemini();
  const [localError, setLocalError] = useState(null);

  useState(() => {
    if (!selectedLanguage) {
      setSelectedLanguage("romanian");
    }
  });

  const handleGenerate = async () => {
    setLocalError(null);

    try {
      const puzzle = await generatePuzzle(
        selectedLanguage,
        selectedDifficulty,
        selectedTheme || "general vocabulary"
      );

      if (puzzle) {
        startNewGame(puzzle);
        navigate("/game");
      } else {
        setLocalError("Failed to generate puzzle. Please try again.");
      }
    } catch (err) {
      console.error("Setup error:", err);
      setLocalError("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return <Loading text="Generating your puzzle..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="container mx-auto px-6 max-w-4xl py-12">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="mb-12 flex items-center gap-2 text-[#403447] hover:text-[#E84393] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[#403447] mb-4">
            Create your puzzle
          </h1>
          <p className="text-xl text-[#403447]/70">
            Choose your language, difficulty, and theme. Every puzzle is unique.
          </p>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-[#E84393]" />
            <h2 className="text-2xl font-bold text-[#403447]">Language</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-4 rounded-xl transition-all text-center ${
                  selectedLanguage === lang.code
                    ? "bg-[#E84393] text-white shadow-lg"
                    : "bg-white text-[#403447] border-2 border-[#FFB5D6]/50 hover:border-[#E84393]"
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="text-sm font-semibold">{lang.name}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-[#E84393]" />
            <h2 className="text-2xl font-bold text-[#403447]">Difficulty</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`p-6 rounded-xl transition-all text-left ${
                  selectedDifficulty === diff.id
                    ? "bg-[#E84393] text-white shadow-lg"
                    : "bg-white text-[#403447] border-2 border-[#FFB5D6]/50 hover:border-[#E84393]"
                }`}
              >
                <div className="font-bold text-lg mb-2">{diff.name}</div>
                <div
                  className={`text-sm ${
                    selectedDifficulty === diff.id
                      ? "text-white/80"
                      : "text-[#403447]/70"
                  }`}
                >
                  {diff.description}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-[#403447] mb-2">
            Theme{" "}
            <span className="text-base text-[#403447]/50 font-normal">
              (optional)
            </span>
          </h2>
          <p className="text-sm text-[#403447]/60 mb-6">
            Leave blank for a random topic, or pick something you're interested
            in
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-xl transition-all text-center ${
                  selectedTheme === theme.id
                    ? "bg-[#E84393] text-white shadow-lg"
                    : "bg-white text-[#403447] border-2 border-[#FFB5D6]/50 hover:border-[#E84393]"
                }`}
              >
                <div className="text-2xl mb-2">{theme.icon}</div>
                <div className="text-sm font-medium">{theme.name}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error Display */}
        {(error || localError) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-r-xl"
          >
            <p className="text-red-800 font-medium">{error || localError}</p>
          </motion.div>
        )}

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t-2 border-[#FFB5D6]/30"
        >
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#E84393] hover:bg-[#d63884] text-white py-6 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <span className="flex items-center justify-center gap-3">
              Generate puzzle
              <Play className="w-5 h-5" />
            </span>
          </Button>
          <p className="text-center text-sm text-[#403447]/50 mt-4">
            Powered by Gemini AI
          </p>
        </motion.div>
      </div>

      {/* Footer - Same as Landing Page */}
      <Footer />
    </div>
  );
}
