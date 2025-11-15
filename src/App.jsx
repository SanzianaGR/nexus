import { GameProvider, useGame } from './context/GameContext';
import { Landing } from './components/Pages/Landing';
import { Setup } from './components/Pages/Setup';
import { Puzzle } from './components/Pages/Puzzle';
import { Completion } from './components/Pages/Completion';

function AppContent() {
  const { currentPage } = useGame();

  // Simple page routing based on game state
  switch (currentPage) {
    case 'landing':
      return <Landing />;
    case 'setup':
      return <Setup />;
    case 'puzzle':
      return <Puzzle />;
    case 'completion':
      return <Completion />;
    default:
      return <Landing />;
  }
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
