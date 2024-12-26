import React from 'react';
import '../styles/glitch.css';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-800 p-8 rounded-lg text-center border border-cyan-500"
           style={{ boxShadow: '0 0 20px rgba(0, 255, 249, 0.3)' }}>
        <h2 className="text-3xl font-bold mb-4 glitch-container neon-glow" data-text="Game Over!">
          Game Over!
        </h2>
        <p className="text-xl mb-6 text-cyan-400">
          Final Score: <span className="glitch-container" data-text={score}>{score}</span>
        </p>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          style={{ boxShadow: '0 0 10px rgba(0, 255, 249, 0.5)' }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;