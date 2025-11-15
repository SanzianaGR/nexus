import { useState } from "react";
import {
  ArrowLeft,
  Play,
  Sparkles,
  Globe,
  Brain,
  Zap,
  Check,
} from "lucide-react";
import { Button } from "../UI/Button";
import { Loading } from "../UI/Loading";
import { useGame } from "../../context/GameContext";
import { useGemini } from "../../hooks/useGemini";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
    description: "5 words, 2-3 hidden",
    nodes: 5,
    color: "#FFB5D6",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "7 words, 4-5 hidden",
    nodes: 7,
    color: "#E84393",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "10 words, 6-7 hidden",
    nodes: 10,
    color: "#403447",
  },
];

const THEMES = [
  { id: "", name: "Surprise Me!", icon: "✨" },
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
    <div className="min-h-screen bg-[#F5F1E8] py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Back button */}
        <Button
          onClick={() => navigate("/")}
          className="mb-8 bg-white hover:bg-[#FFB5D6]/20 text-[#403447] px-6 py-3 rounded-full font-semibold border-2 border-[#FFB5D6] shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-6 border-2 border-[#FFB5D6]"
          >
            <Brain className="w-5 h-5 text-[#E84393]" />
            <span className="text-sm font-semibold text-[#403447]">
              AI-Powered Learning
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-[#403447] mb-6">
            Design Your{" "}
            <span className="text-[#E84393]">Learning Journey</span>
          </h1>
          <p className="text-xl text-[#403447]/70 max-w-2xl mx-auto">
            Each puzzle is uniquely generated just for you. Pick your
            preferences and let's begin.
          </p>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-[#E84393]" />
            <h2 className="text-3xl font-bold text-[#403447]">
              Choose Your Language
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {LANGUAGES.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all group ${
                  selectedLanguage === lang.code
                    ? "bg-[#E84393] shadow-2xl shadow-[#E84393]/30 scale-105"
                    : "bg-white hover:bg-[#FFB5D6]/10 border-2 border-[#FFB5D6]/50 hover:border-[#E84393] hover:shadow-xl"
                }`}
              >
                {selectedLanguage === lang.code && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                    <Check className="w-5 h-5 text-[#E84393]" />
                  </div>
                )}
                <div className="text-center">
                  <div className="text-5xl mb-3">{lang.flag}</div>
                  <div
                    className={`font-semibold ${
                      selectedLanguage === lang.code
                        ? "text-white"
                        : "text-[#403447]"
                    }`}
                  >
                    {lang.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-[#403447]/60 mt-4 text-sm">
            More languages coming soon!
          </p>
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-[#E84393]" />
            <h2 className="text-3xl font-bold text-[#403447]">
              Pick Your Challenge
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIFFICULTIES.map((diff, index) => (
              <motion.div
                key={diff.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`relative p-8 rounded-2xl cursor-pointer transition-all ${
                  selectedDifficulty === diff.id
                    ? "bg-white border-4 border-[#E84393] shadow-2xl shadow-[#E84393]/20 scale-105"
                    : "bg-white border-2 border-[#FFB5D6]/50 hover:border-[#E84393] hover:shadow-xl"
                }`}
              >
                {selectedDifficulty === diff.id && (
                  <div className="absolute -top-3 -right-3 bg-[#E84393] rounded-full p-2 shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="text-center">
                  <div
                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                    style={{ backgroundColor: diff.color }}
                  >
                    {diff.nodes}
                  </div>
                  <div className="font-bold text-xl text-[#403447] mb-2">
                    {diff.name}
                  </div>
                  <div className="text-sm text-[#403447]/70">
                    {diff.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-[#E84393]" />
            <h2 className="text-3xl font-bold text-[#403447]">
              Choose a Theme{" "}
              <span className="text-lg text-[#403447]/60 font-normal">
                (Optional)
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {THEMES.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all text-center ${
                  selectedTheme === theme.id
                    ? "bg-[#E84393] shadow-xl scale-105"
                    : "bg-white hover:bg-[#FFB5D6]/10 border-2 border-[#FFB5D6]/50 hover:border-[#E84393]"
                }`}
              >
                <div className="text-4xl mb-2">{theme.icon}</div>
                <div
                  className={`font-semibold text-sm ${
                    selectedTheme === theme.id
                      ? "text-white"
                      : "text-[#403447]"
                  }`}
                >
                  {theme.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Error Display */}
        {(error || localError) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-red-50 border-2 border-red-300 rounded-2xl"
          >
            <p className="font-semibold text-red-800 text-center">
              {error || localError}
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Don't worry, we'll try again!
              </p>
            )}
          </motion.div>
        )}

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={loading}
            className="bg-[#E84393] hover:bg-[#d63884] text-white px-16 py-6 text-xl rounded-full font-semibold shadow-2xl hover:shadow-[#E84393]/50 hover:scale-105 transition-all group"
          >
            <span className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Generate My Puzzle
              <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          <p className="text-sm text-[#403447]/60 mt-4">
            ✨ Every puzzle is unique and AI-generated
          </p>
        </motion.div>
      </div>
    </div>
  );
}
