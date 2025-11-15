import { createContext, useContext, useState, useCallback } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useScore } from '../hooks/useScore';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Game settings
  const [selectedLanguage, setSelectedLanguage] = useState('romanian');
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [selectedTheme, setSelectedTheme] = useState('');

  // Puzzle state
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [userAnswers, setUserAnswers] = useState({ nodes: {}, edges: {} });
  const [hintsUsedMap, setHintsUsedMap] = useState({});
  const [completed, setCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing'); // landing, setup, puzzle, completion

  // Hooks
  const timer = useTimer(false);
  const score = useScore();

  // Answer submission
  const submitNodeAnswer = useCallback((nodeId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      nodes: { ...prev.nodes, [nodeId]: answer },
    }));
  }, []);

  const submitEdgeAnswer = useCallback((edgeId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      edges: { ...prev.edges, [edgeId]: answer },
    }));
  }, []);

  // Hint management
  const useHint = useCallback((elementId) => {
    setHintsUsedMap(prev => ({
      ...prev,
      [elementId]: (prev[elementId] || 0) + 1,
    }));
    score.addHint();
  }, [score]);

  const getHintLevel = useCallback((elementId) => {
    return hintsUsedMap[elementId] || 0;
  }, [hintsUsedMap]);

  // Check if puzzle is complete
  const checkCompletion = useCallback(() => {
    if (!currentPuzzle) return false;

    const allNodesComplete = currentPuzzle.nodes
      .filter(n => n.hidden)
      .every(n => userAnswers.nodes[n.id] === n.answer);

    const allEdgesComplete = currentPuzzle.edges
      .filter(e => e.hidden)
      .every(e => userAnswers.edges[e.id] === e.answer);

    return allNodesComplete && allEdgesComplete;
  }, [currentPuzzle, userAnswers]);

  // Start new game
  const startNewGame = useCallback((puzzle) => {
    setCurrentPuzzle(puzzle);
    setUserAnswers({ nodes: {}, edges: {} });
    setHintsUsedMap({});
    setCompleted(false);
    timer.reset();
    timer.start();
    score.reset();
    setCurrentPage('puzzle');
  }, [timer, score]);

  // Complete game
  const completeGame = useCallback(() => {
    setCompleted(true);
    timer.pause();
    score.updateTime(timer.seconds);
    setCurrentPage('completion');
  }, [timer, score]);

  // Reset puzzle (restart current puzzle)
  const resetPuzzle = useCallback(() => {
    setUserAnswers({ nodes: {}, edges: {} });
    setHintsUsedMap({});
    setCompleted(false);
    timer.reset();
    timer.start();
    score.reset();
  }, [timer, score]);

  // Reset game
  const resetGame = useCallback(() => {
    setCurrentPuzzle(null);
    setUserAnswers({ nodes: {}, edges: {} });
    setHintsUsedMap({});
    setCompleted(false);
    timer.reset();
    score.reset();
    setCurrentPage('landing');
  }, [timer, score]);

  const value = {
    // Settings
    selectedLanguage,
    setSelectedLanguage,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedTheme,
    setSelectedTheme,

    // Puzzle state
    currentPuzzle,
    setCurrentPuzzle,
    userAnswers,
    submitNodeAnswer,
    submitEdgeAnswer,

    // Hints
    hintsUsedMap,
    useHint,
    getHintLevel,

    // Completion
    completed,
    checkCompletion,

    // Page navigation
    currentPage,
    setCurrentPage,

    // Game flow
    startNewGame,
    completeGame,
    resetGame,
    resetPuzzle,

    // Timer and score
    timer,
    score,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
