import { Network, Clock, Trophy } from "lucide-react";
import { useGame } from "../../context/GameContext";

export function Header() {
  const { timer, score, currentPuzzle } = useGame();

  return (
    <header className="bg-white border-b-2 border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Network className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Nexus
          </h1>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="font-mono font-semibold text-gray-900">
              {timer.formatTime()}
            </span>
          </div>

          {/* Current Score */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{score.calculateScore()} pts</span>
          </div>

          {/* Language/Difficulty Badge */}
          {currentPuzzle && (
            <div className="hidden md:block px-4 py-2 bg-gray-100 rounded-lg">
              <span className="font-semibold text-gray-900 capitalize">
                {currentPuzzle.difficulty || "Beginner"}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
