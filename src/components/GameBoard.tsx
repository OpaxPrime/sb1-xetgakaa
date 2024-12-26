import React from 'react';
import { GameState } from '../types/game';
import '../styles/glitch.css';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { grid, currentPiece } = gameState;
  const displayGrid = [...grid.map(row => [...row])];

  if (currentPiece) {
    currentPiece.blocks.forEach(block => {
      if (block.y >= 0 && block.y < grid.length && block.x >= 0 && block.x < grid[0].length) {
        displayGrid[block.y][block.x] = block.color;
      }
    });
  }

  return (
    <div 
      className="relative bg-gray-900 p-4 rounded-lg shadow-xl transform transition-transform duration-500 border border-cyan-500"
      style={{ 
        transform: `rotate(${currentPiece?.rotation || 0}deg)`,
        boxShadow: '0 0 10px #00fff9, 0 0 20px #00fff9, 0 0 30px #00fff9'
      }}
    >
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
      >
        {displayGrid.map((row, y) => 
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`grid-cell aspect-square rounded ${
                cell ? 'shadow-inner' : 'bg-gray-800'
              }`}
              style={{
                backgroundColor: cell || 'rgba(26, 32, 44, 0.8)',
                transition: 'background-color 0.2s ease',
                boxShadow: cell ? `0 0 5px ${cell}, 0 0 10px ${cell}` : 'none'
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;