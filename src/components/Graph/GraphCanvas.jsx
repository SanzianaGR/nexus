import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { useGame } from '../../context/GameContext';
import { validateAnswer } from '../../utils/validation';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export function GraphCanvas({ onNodeClick, onEdgeClick }) {
  const { currentPuzzle, userAnswers } = useGame();
  const [focusedElement, setFocusedElement] = useState(null);

  // Convert puzzle data to React Flow format
  const initialNodes = useMemo(() => {
    if (!currentPuzzle) return [];

    return currentPuzzle.nodes.map((node, index) => {
      const isCorrect = node.hidden
        ? validateAnswer(userAnswers.nodes[node.id] || '', node.answer).isCorrect
        : false;

      return {
        id: node.id,
        type: 'custom',
        position: calculateNodePosition(index, currentPuzzle.nodes.length),
        data: {
          ...node,
          isCorrect,
          isFocused: focusedElement === `node-${node.id}`,
          onClick: () => {
            if (node.hidden && !isCorrect) {
              setFocusedElement(`node-${node.id}`);
              onNodeClick(node);
            }
          },
        },
      };
    });
  }, [currentPuzzle, userAnswers.nodes, focusedElement, onNodeClick]);

  const initialEdges = useMemo(() => {
    if (!currentPuzzle) return [];

    return currentPuzzle.edges.map((edge) => {
      const isCorrect = edge.hidden
        ? validateAnswer(userAnswers.edges[edge.id] || '', edge.answer).isCorrect
        : false;

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'custom',
        data: {
          ...edge,
          isCorrect,
          onClick: () => {
            if (edge.hidden && !isCorrect) {
              setFocusedElement(`edge-${edge.id}`);
              onEdgeClick(edge);
            }
          },
        },
      };
    });
  }, [currentPuzzle, userAnswers.edges, focusedElement, onEdgeClick]);

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  const onNodesChange = useCallback(() => {
    // Prevent default node changes to keep our custom logic
  }, []);

  const onEdgesChange = useCallback(() => {
    // Prevent default edge changes
  }, []);

  if (!currentPuzzle) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No puzzle loaded
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl overflow-hidden border-2 border-gray-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls className="bg-white rounded-lg shadow-md" />
        <MiniMap
          className="bg-white rounded-lg shadow-md"
          nodeColor={(node) => {
            if (node.data.isCorrect) return '#10b981';
            if (node.data.hidden) return '#9ca3af';
            return '#6366f1';
          }}
        />
      </ReactFlow>
    </div>
  );
}

// Helper function to calculate circular/hierarchical layout
function calculateNodePosition(index, total) {
  // Circular layout
  const radius = 250;
  const centerX = 400;
  const centerY = 300;

  const angle = (index / total) * 2 * Math.PI;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return { x, y };
}
