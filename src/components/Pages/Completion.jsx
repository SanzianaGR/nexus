import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Clock,
  Lightbulb,
  Target,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card";
import { useGame } from "../../context/GameContext";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export function Completion() {
  const navigate = useNavigate();
  const { timer, score, resetGame } = useGame();
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  const finalScore = score.calculateScore();
  const accuracy = score.getAccuracy();

  useEffect(() => {
    if (!hasTriggeredConfetti) {
      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      setHasTriggeredConfetti(true);
    }
  }, [hasTriggeredConfetti]);

  const handlePlayAgain = () => {
    resetGame();
    navigate("/setup");
  };

  const handleShare = () => {
    const text = `I scored ${finalScore} points on Nexus! 🎉\n\nTime: ${timer.formatTime()}\nAccuracy: ${accuracy}%\n\nLearn languages through connections at nexus-app.com`;

    if (navigator.share) {
      navigator
        .share({
          title: "Nexus - Language Learning",
          text: text,
        })
        .catch(() => {
          // Fallback to clipboard
          navigator.clipboard.writeText(text);
          alert("Score copied to clipboard!");
        });
    } else {
      navigator.clipboard.writeText(text);
      alert("Score copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Victory Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          </motion.div>

          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Congratulations!
          </h1>
          <p className="text-xl text-gray-600">You completed the puzzle!</p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 mb-6 bg-gradient-to-br from-white to-indigo-50">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {finalScore}
              </div>
              <p className="text-gray-600 font-medium">Final Score</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="font-bold text-gray-900">
                  {timer.formatTime()}
                </div>
                <div className="text-xs text-gray-600">Time</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div className="font-bold text-gray-900">{accuracy}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="font-bold text-gray-900">{score.hintsUsed}</div>
                <div className="text-xs text-gray-600">Hints</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div className="font-bold text-gray-900">{score.mistakes}</div>
                <div className="text-xs text-gray-600">Mistakes</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-center">
              Achievements
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {accuracy === 100 && (
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  🎯 Perfect Accuracy
                </div>
              )}
              {score.hintsUsed === 0 && (
                <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  🧠 No Hints Used
                </div>
              )}
              {timer.seconds < 120 && (
                <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  ⚡ Speed Master
                </div>
              )}
              {finalScore >= 950 && (
                <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  👑 High Score
                </div>
              )}
              {/* Always show at least one badge */}
              {accuracy < 100 &&
                score.hintsUsed > 0 &&
                timer.seconds >= 120 &&
                finalScore < 950 && (
                  <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                    🎉 Puzzle Completed
                  </div>
                )}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" onClick={handlePlayAgain} className="flex-1">
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
