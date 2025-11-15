import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Landing } from './components/Pages/Landing';
import { Setup } from './components/Pages/Setup';
import { Puzzle } from './components/Pages/Puzzle';
import { Completion } from './components/Pages/Completion';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/game" element={<Puzzle />} />
          <Route path="/completion" element={<Completion />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
