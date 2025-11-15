import { useState, useEffect } from 'react';
import { Header } from '../Game/Header';
import { Sidebar } from '../Game/Sidebar';
import { GraphCanvas } from '../Graph/GraphCanvas';
import { InputModal } from '../Modals/InputModal';
import { useGame } from '../../context/GameContext';

export function Puzzle() {
  const { checkCompletion, completeGame, timer } = useGame();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementType, setElementType] = useState(null);

  // Check for completion whenever answers change
  useEffect(() => {
    if (checkCompletion()) {
      completeGame();
    }
  }, [checkCompletion, completeGame]);

  // Start timer when component mounts
  useEffect(() => {
    if (!timer.isRunning) {
      timer.start();
    }
  }, [timer]);

  const handleNodeClick = (node) => {
    setSelectedElement(node);
    setElementType('node');
    setModalOpen(true);
  };

  const handleEdgeClick = (edge) => {
    setSelectedElement(edge);
    setElementType('edge');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedElement(null);
    setElementType(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Graph Area */}
        <main className="flex-1 p-6">
          <GraphCanvas
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
          />
        </main>

        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Input Modal */}
      <InputModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        element={selectedElement}
        type={elementType}
      />
    </div>
  );
}
