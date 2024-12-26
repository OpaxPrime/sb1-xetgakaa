import React from 'react';
import { Blocks } from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import GameStats from './components/GameStats';
import GameOver from './components/GameOver';
import './styles/glitch.css';

function App() {
  const { gameState, resetGame, togglePause } = useGameLogic();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4"
         style={{ 
           background: 'linear-gradient(45deg, #1a1a1a 0%, #0a0a0a 100%)',
           boxShadow: 'inset 0 0 100px rgba(0, 255, 249, 0.1)'
         }}>
      <div className="max-w-lg w-full">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Blocks className="w-8 h-8 text-cyan-500" />
          <h1 className="text-4xl font-bold glitch-container neon-glow" data-text="Tetra Turns">
            Tetra Turns
          </h1>
        </div>

        <GameStats score={gameState.score} level={gameState.level} />
        
        <div className="relative">
          <GameBoard gameState={gameState} />
          {gameState.gameOver && (
            <GameOver score={gameState.score} onRestart={resetGame} />
          )}
        </div>

        <GameControls
          isPaused={gameState.isPaused}
          onPause={togglePause}
          onReset={resetGame}
        />

        <div className="mt-8 text-center text-sm text-cyan-400">
          <p className="mb-2 neon-glow">Controls:</p>
          <p>← → : Move left/right</p>
          <p>↑ : Rotate piece</p>
          <p>↓ : Move down</p>
          <p>Space : Pause/Resume</p>
        </div>
      </div>
    </div>
  );
}

export default App;