import {
  CheckCircle,
  Circle,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import { Card } from "../UI/Card";
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
    <aside className="w-80 bg-white border-l-2 border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Progress</h3>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-600 text-center">
            {totalCompleted} of {totalHidden} complete
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Stats</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Hints Used:</span>
              <span className="font-semibold text-gray-900">
                {totalHintsUsed}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mistakes:</span>
              <span className="font-semibold text-gray-900">
                {score.mistakes}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-semibold text-gray-900">
                {score.getAccuracy()}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Tasks</h3>
          </div>

          <div className="space-y-2">
            {hiddenNodes.map((node) => {
              const isComplete = validateAnswer(
                userAnswers.nodes[node.id] || "",
                node.answer
              ).isCorrect;
              return (
                <div key={node.id} className="flex items-center gap-2">
                  {isComplete ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      isComplete
                        ? "text-green-700 line-through"
                        : "text-gray-700"
                    }`}
                  >
                    Fill node: {node.translation}
                  </span>
                </div>
              );
            })}

            {hiddenEdges.map((edge) => {
              const isComplete = validateAnswer(
                userAnswers.edges[edge.id] || "",
                edge.answer
              ).isCorrect;
              return (
                <div key={edge.id} className="flex items-center gap-2">
                  {isComplete ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      isComplete
                        ? "text-green-700 line-through"
                        : "text-gray-700"
                    }`}
                  >
                    Label relationship
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-4 bg-indigo-50 border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-indigo-900">How to Play</h3>
          </div>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Click on ??? nodes to fill in words</li>
            <li>• Click on ??? edges to label relationships</li>
            <li>• Use hints if you get stuck (-10 pts each)</li>
            <li>• Complete all hidden elements to win!</li>
          </ul>
        </Card>
      </div>
    </aside>
  );
}
