import { BaseEdge, EdgeLabelRenderer, getBezierPath, MarkerType } from '@xyflow/react';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { relationship, hidden, isCorrect, userAnswer, onClick } = data;

  const isHidden = hidden && !isCorrect;
  const hasAttempt = userAnswer && userAnswer.trim() !== '';

  const getStrokeColor = () => {
    if (isCorrect) return '#10b981';
    if (isHidden && hasAttempt) return '#f87171';
    if (isHidden) return '#E84393';
    return '#E84393';
  };

  const strokeDasharray = isHidden ? '8,4' : '0';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: getStrokeColor(),
          strokeWidth: 3,
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
            className={`
              px-4 py-2 rounded-full text-sm font-bold cursor-pointer
              transition-all duration-200 hover:scale-110 shadow-lg
              ${
                isCorrect
                  ? 'bg-green-500 text-white'
                  : isHidden && hasAttempt
                  ? 'bg-red-400 text-white'
                  : isHidden
                  ? 'bg-white text-[#E84393] border-2 border-dashed border-[#E84393]'
                  : 'bg-[#E84393] text-white'
              }
            `}
            onClick={onClick}
          >
            {isHidden && !isCorrect ? (hasAttempt ? userAnswer : '???') : relationship}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
