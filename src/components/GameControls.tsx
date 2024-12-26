import React from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  isPaused: boolean;
  onPause: () => void;
  onReset: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ isPaused, onPause, onReset }) => {
  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={onPause}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isPaused ? <Play size={20} /> : <Pause size={20} />}
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        <RotateCcw size={20} />
        Reset
      </button>
    </div>
  );
};

export default GameControls;