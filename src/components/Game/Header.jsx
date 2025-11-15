import { Network, Clock, Trophy, RotateCcw, Home } from "lucide-react";
import { useGame } from "../../context/GameContext";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { timer, score, currentPuzzle, resetPuzzle } = useGame();
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm("Restart this puzzle? All progress will be lost.")) {
      resetPuzzle();
    }
  };

  const handleHome = () => {
    if (window.confirm("Return to home? All progress will be lost.")) {
      navigate("/");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-slate-700" strokeWidth={2} />
            <h1 className="text-xl font-semibold text-slate-900">
              Nexus
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleHome}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Home"
            >
              <Home className="w-4 h-4" strokeWidth={2} />
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2} />
              Restart
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <Clock className="w-4 h-4 text-slate-500" strokeWidth={2} />
            <span className="font-mono text-sm font-medium text-slate-700">
              {timer.formatTime()}
            </span>
          </div>

          {/* Current Score */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <Trophy className="w-4 h-4 text-emerald-600" strokeWidth={2} />
            <span className="text-sm font-semibold text-emerald-700">
              {score.calculateScore()} pts
            </span>
          </div>

          {/* Language/Difficulty Badge */}
          {currentPuzzle && (
            <div className="hidden md:block px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-sm font-medium text-slate-700 capitalize">
                {currentPuzzle.difficulty || "Beginner"}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
