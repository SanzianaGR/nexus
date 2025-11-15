import {
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import { validateAnswer } from "../../utils/validation";

export function Sidebar() {
  const { currentPuzzle, userAnswers, score, hintsUsedMap } = useGame();

  if (!currentPuzzle) return null;

  const hiddenNodes = currentPuzzle.nodes.filter((n) => n.hidden);
  const completedNodes = hiddenNodes.filter(
    (n) => validateAnswer(userAnswers.nodes[n.id] || "", n.answer).isCorrect
  );

  const hiddenEdges = currentPuzzle.edges.filter((e) => e.hidden);
  const completedEdges = hiddenEdges.filter(
    (e) => validateAnswer(userAnswers.edges[e.id] || "", e.answer).isCorrect
  );

  const totalHidden = hiddenNodes.length + hiddenEdges.length;
  const totalCompleted = completedNodes.length + completedEdges.length;
  const progress = totalHidden > 0 ? (totalCompleted / totalHidden) * 100 : 0;

  const totalHintsUsed = Object.values(hintsUsedMap).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <aside className="w-72 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Progress Card */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-slate-600" strokeWidth={2} />
            <h3 className="font-semibold text-sm text-slate-900">Progress</h3>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 text-center font-medium">
            {totalCompleted} of {totalHidden} complete
          </p>
        </div>

        {/* Stats Card */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-slate-600" strokeWidth={2} />
            <h3 className="font-semibold text-sm text-slate-900">Statistics</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Hints Used</span>
              <span className="font-semibold text-slate-900">
                {totalHintsUsed}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Mistakes</span>
              <span className="font-semibold text-slate-900">
                {score.mistakes}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Accuracy</span>
              <span className="font-semibold text-slate-900">
                {score.getAccuracy()}%
              </span>
            </div>
          </div>
        </div>

        {/* How to Play Card */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-600" strokeWidth={2} />
            <h3 className="font-semibold text-sm text-blue-900">How to Play</h3>
          </div>
          <ul className="text-xs text-blue-800 space-y-1 leading-relaxed">
            <li>• Click ??? nodes to fill in words</li>
            <li>• Click ??? edges to label relationships</li>
            <li>• Use hints if stuck (-10 pts each)</li>
            <li>• Complete all to win!</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
