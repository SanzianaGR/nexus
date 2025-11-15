import { Handle, Position } from '@xyflow/react';
import { Check, HelpCircle } from 'lucide-react';

export function CustomNode({ data }) {
  const { word, translation, hidden, isCorrect, onClick, isFocused } = data;

  // Visual states
  const isHidden = hidden && !isCorrect;
  const borderColor = isFocused
    ? 'border-indigo-500 shadow-lg'
    : isCorrect
    ? 'border-green-500 shadow-md'
    : isHidden
    ? 'border-dashed border-gray-400'
    : 'border-gray-300';

  const bgColor = isCorrect ? 'bg-green-50' : 'bg-white';
  const pulseClass = isHidden && !isCorrect ? 'pulse-border' : '';

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-indigo-500" />

      <div
        className={`px-6 py-4 rounded-xl border-2 ${borderColor} ${bgColor} ${pulseClass} min-w-[120px] cursor-pointer transition-all hover:scale-105`}
        onClick={onClick}
      >
        <div className="text-center">
          {isCorrect && (
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}

          {isHidden && !isCorrect && (
            <HelpCircle className="w-5 h-5 text-gray-400 mx-auto mb-2" />
          )}

          <div className="font-bold text-lg text-gray-900">
            {isHidden && !isCorrect ? '???' : word}
          </div>

          {(!isHidden || isCorrect) && (
            <div className="text-sm text-gray-600 mt-1">{translation}</div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500" />
    </>
  );
}
