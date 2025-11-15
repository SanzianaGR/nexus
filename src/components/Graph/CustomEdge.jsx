import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { relationship, hidden, isCorrect, onClick } = data;

  const isHidden = hidden && !isCorrect;
  const strokeColor = isCorrect ? '#10b981' : isHidden ? '#9ca3af' : '#6366f1';
  const strokeDasharray = isHidden ? '5,5' : '0';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: 2,
          strokeDasharray,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer transition-transform hover:scale-110 ${
              isCorrect
                ? 'bg-green-500 text-white'
                : isHidden
                ? 'bg-gray-200 text-gray-600 border-2 border-dashed border-gray-400'
                : 'bg-indigo-500 text-white'
            }`}
            onClick={onClick}
          >
            {isHidden && !isCorrect ? '???' : relationship}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
