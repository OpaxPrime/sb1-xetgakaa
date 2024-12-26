import React from 'react';
import '../styles/glitch.css';

interface GameStatsProps {
  score: number;
  level: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, level }) => {
  return (
    <div className="flex gap-8 mb-4">
      <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500" 
           style={{ boxShadow: '0 0 10px rgba(0, 255, 249, 0.3)' }}>
        <h3 className="text-sm text-cyan-400 mb-1 neon-glow">Score</h3>
        <p className="text-2xl font-bold text-white glitch-container" data-text={score}>
          {score}
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500"
           style={{ boxShadow: '0 0 10px rgba(0, 255, 249, 0.3)' }}>
        <h3 className="text-sm text-cyan-400 mb-1 neon-glow">Level</h3>
        <p className="text-2xl font-bold text-white glitch-container" data-text={level}>
          {level}
        </p>
      </div>
    </div>
  );
};

export default GameStats;