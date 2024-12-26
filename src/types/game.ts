export interface Block {
  x: number;
  y: number;
  color: string;
}

export interface Tetromino {
  blocks: Block[];
  rotation: number;
}

export interface GameState {
  score: number;
  level: number;
  grid: (string | null)[][];
  currentPiece: Tetromino | null;
  gameOver: boolean;
  isPaused: boolean;
  nextRotation: number;
  rotationTimer: number;
}