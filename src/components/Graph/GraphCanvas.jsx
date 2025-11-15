import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { useGame } from '../../context/GameContext';
import { validateAnswer } from '../../utils/validation';
import dagre from 'dagre';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// Dagre layout for better graph organization
const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: 'TB', // Top to bottom
    ranksep: 120,
    nodesep: 80,
    edgesep: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 50,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export function GraphCanvas({ onNodeClick, onEdgeClick }) {
  const { currentPuzzle, userAnswers } = useGame();

  // Convert puzzle data to React Flow format
  const initialNodes = useMemo(() => {
    if (!currentPuzzle) return [];

    const nodes = currentPuzzle.nodes.map((node) => {
      const userAnswer = userAnswers.nodes[node.id] || '';
      const isCorrect = node.hidden
        ? validateAnswer(userAnswer, node.answer).isCorrect
        : false;

      return {
        id: node.id,
        type: 'custom',
        position: { x: 0, y: 0 }, // Will be set by layout
        data: {
          ...node,
          userAnswer,
          isCorrect,
          onClick: () => {
            if (node.hidden && !isCorrect) {
              onNodeClick(node);
            }
          },
        },
      };
    });

    return nodes;
  }, [currentPuzzle, userAnswers.nodes, onNodeClick]);

  const initialEdges = useMemo(() => {
    if (!currentPuzzle) return [];

    return currentPuzzle.edges.map((edge) => {
      const userAnswer = userAnswers.edges[edge.id] || '';
      const isCorrect = edge.hidden
        ? validateAnswer(userAnswer, edge.answer).isCorrect
        : false;

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'custom',
        animated: !isCorrect && edge.hidden,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 25,
          height: 25,
          color: isCorrect ? '#10b981' : userAnswer && userAnswer.trim() ? '#f87171' : '#E84393',
        },
        data: {
          ...edge,
          userAnswer,
          isCorrect,
          onClick: () => {
            if (edge.hidden && !isCorrect) {
              onEdgeClick(edge);
            }
          },
        },
      };
    });
  }, [currentPuzzle, userAnswers.edges, onEdgeClick]);

  // Apply layout
  const layoutedElements = useMemo(() => {
    if (!initialNodes.length) return { nodes: [], edges: [] };
    return getLayoutedElements(initialNodes, initialEdges);
  }, [initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedElements.edges);

  // Update nodes and edges when answers change
  useEffect(() => {
    setNodes(layoutedElements.nodes);
  }, [layoutedElements.nodes, setNodes]);

  useEffect(() => {
    setEdges(layoutedElements.edges);
  }, [layoutedElements.edges, setEdges]);

  if (!currentPuzzle) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No puzzle loaded
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#F5F1E8] to-[#FFB5D6]/10 rounded-xl overflow-hidden border-2 border-[#FFB5D6]/30 shadow-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background color="#FFB5D6" gap={20} size={1.5} />
        <Controls className="!bg-white !border-2 !border-[#FFB5D6]/50 !shadow-lg !rounded-lg" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
