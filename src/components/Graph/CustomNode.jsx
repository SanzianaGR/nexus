import { Handle, Position } from '@xyflow/react';
import { Check, AlertCircle, HelpCircle } from 'lucide-react';

export function CustomNode({ data }) {
  const { word, translation, hidden, isCorrect, userAnswer, onClick } = data;

  // Visual states
  const isHidden = hidden && !isCorrect;
  const hasAttempt = userAnswer && userAnswer.trim() !== '';

  const getBorderColor = () => {
    if (isCorrect) return 'border-green-500 shadow-xl shadow-green-500/30';
    if (isHidden && hasAttempt) return 'border-red-400 shadow-lg shadow-red-400/30';
    if (isHidden) return 'border-dashed border-[#E84393] shadow-lg shadow-[#E84393]/20';
    return 'border-[#FFB5D6] shadow-md';
  };

  const getBackgroundColor = () => {
    if (isCorrect) return 'bg-green-50';
    if (isHidden && hasAttempt) return 'bg-red-50';
    return 'bg-white';
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#E84393] !border-2 !border-white"
      />

      <div
        className={`
          px-6 py-4 rounded-xl border-3 ${getBorderColor()} ${getBackgroundColor()}
          min-w-[160px] cursor-pointer transition-all duration-200
          hover:scale-105 hover:-translate-y-1
          ${isHidden && !hasAttempt ? 'animate-pulse' : ''}
        `}
        onClick={onClick}
      >
        <div className="text-center relative">
          {isCorrect && (
            <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-1.5 shadow-lg">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
          )}

          {isHidden && !isCorrect && hasAttempt && (
            <div className="absolute -top-3 -right-3 bg-red-400 rounded-full p-1.5 shadow-lg">
              <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          )}

          {isHidden && !isCorrect && !hasAttempt && (
            <HelpCircle className="w-6 h-6 text-[#E84393] mx-auto mb-2" strokeWidth={2.5} />
          )}

          <div className="font-bold text-xl text-[#403447] mb-1">
            {isHidden && !isCorrect ? (hasAttempt ? userAnswer : '???') : word}
          </div>

          {(!isHidden || isCorrect) && (
            <div className="text-sm text-[#403447]/70">{translation}</div>
          )}

          {isHidden && !isCorrect && hasAttempt && (
            <div className="text-xs text-red-600 mt-1 font-semibold">Try again!</div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[#E84393] !border-2 !border-white"
      />
    </>
  );
}
