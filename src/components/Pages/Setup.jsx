import { useState } from "react";
import { ArrowLeft, Play, Sparkles } from "lucide-react";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card";
import { Loading } from "../UI/Loading";
import { useGame } from "../../context/GameContext";
import { useGemini } from "../../hooks/useGemini";
import { motion } from "framer-motion";

const LANGUAGES = [
  { code: "spanish", name: "Spanish", flag: "🇪🇸" },
  { code: "french", name: "French", flag: "🇫🇷" },
  { code: "german", name: "German", flag: "🇩🇪" },
  { code: "japanese", name: "Japanese", flag: "🇯🇵" },
  { code: "chinese", name: "Mandarin Chinese", flag: "🇨🇳" },
  { code: "dutch", name: "Dutch", flag: "🇳🇱" },
  { code: "romanian", name: "Romanian", flag: "🇷🇴" },
];

const DIFFICULTIES = [
  {
    id: "beginner",
    name: "Beginner",
    description: "5 words, 2-3 hidden",
    nodes: 5,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "7 words, 4-5 hidden",
    nodes: 7,
    color: "from-yellow-500 to-orange-600",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "10 words, 6-7 hidden",
    nodes: 10,
    color: "from-red-500 to-pink-600",
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
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedTheme,
    setSelectedTheme,
    setCurrentPage,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => setCurrentPage("landing")}
          className="mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customize Your Puzzle
          </h1>
          <p className="text-lg text-gray-600">
            Choose your settings and we'll generate a unique puzzle just for you
          </p>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Select Language
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LANGUAGES.map((lang) => (
              <Card
                key={lang.code}
                hoverable
                selected={selectedLanguage === lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className="p-4 text-center cursor-pointer"
              >
                <div className="text-4xl mb-2">{lang.flag}</div>
                <div className="font-semibold text-gray-900">{lang.name}</div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Select Difficulty
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIFFICULTIES.map((diff) => (
              <Card
                key={diff.id}
                hoverable
                selected={selectedDifficulty === diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className="p-6 text-center cursor-pointer"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${diff.color} flex items-center justify-center text-white font-bold text-2xl`}
                >
                  {diff.nodes}
                </div>
                <div className="font-bold text-lg text-gray-900 mb-1">
                  {diff.name}
                </div>
                <div className="text-sm text-gray-600">{diff.description}</div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Choose Theme (Optional)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {THEMES.map((theme) => (
              <Card
                key={theme.id}
                hoverable
                selected={selectedTheme === theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className="p-4 text-center cursor-pointer"
              >
                <div className="text-3xl mb-2">{theme.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">
                  {theme.name}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Error Display */}
        {(error || localError) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-xl text-yellow-800"
          >
            <p className="font-medium">{error || localError}</p>
            {error && (
              <p className="text-sm mt-1">
                Don't worry, we'll use a pre-made puzzle instead!
              </p>
            )}
          </motion.div>
        )}

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button size="lg" onClick={handleGenerate} disabled={loading}>
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Puzzle
              <Play className="w-5 h-5" />
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
