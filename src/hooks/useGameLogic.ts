import { useState, useEffect, useCallback } from 'react';
import { GameState, Tetromino, Block } from '../types/game';
import {
  GRID_SIZE,
  COLORS,
  INITIAL_SPEED,
  SPEED_INCREASE,
  ROTATION_INTERVAL,
  POINTS_PER_LINE,
  POINTS_MULTIPLIER,
  TETROMINOES,
} from '../constants/game';

const createEmptyGrid = () => 
  Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

const createRandomPiece = (): Tetromino => {
  const tetromino = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  return {
    blocks: tetromino.map(([x, y]) => ({ x: x + Math.floor(GRID_SIZE/2) - 1, y, color })),
    rotation: 0
  };
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    grid: createEmptyGrid(),
    currentPiece: null,
    gameOver: false,
    isPaused: false,
    nextRotation: ROTATION_INTERVAL,
    rotationTimer: 0,
  });

  const rotatePiece = useCallback((piece: Tetromino, grid: (string | null)[][]) => {
    const center = piece.blocks[1];
    const newBlocks = piece.blocks.map(block => {
      const relX = block.x - center.x;
      const relY = block.y - center.y;
      return {
        x: center.x - relY,
        y: center.y + relX,
        color: block.color
      };
    });

    if (newBlocks.every(block => 
      block.x >= 0 && 
      block.x < GRID_SIZE && 
      block.y >= 0 && 
      block.y < GRID_SIZE &&
      !grid[block.y][block.x]
    )) {
      return { ...piece, blocks: newBlocks, rotation: (piece.rotation + 90) % 360 };
    }
    return piece;
  }, []);

  const rotateGrid = useCallback((grid: (string | null)[][]) => {
    const newGrid = createEmptyGrid();
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        newGrid[x][GRID_SIZE - 1 - y] = grid[y][x];
      }
    }
    return newGrid;
  }, []);

  const checkCollision = useCallback((piece: Tetromino, grid: (string | null)[][], deltaX = 0, deltaY = 0) => {
    return piece.blocks.some(block => {
      const newX = block.x + deltaX;
      const newY = block.y + deltaY;
      return (
        newX < 0 ||
        newX >= GRID_SIZE ||
        newY >= GRID_SIZE ||
        (newY >= 0 && grid[newY][newX])
      );
    });
  }, []);

  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newPiece = {
        ...prev.currentPiece,
        blocks: prev.currentPiece.blocks.map(block => ({
          ...block,
          x: block.x + deltaX,
          y: block.y + deltaY
        }))
      };

      if (checkCollision(newPiece, prev.grid)) return prev;

      return { ...prev, currentPiece: newPiece };
    });
  }, [checkCollision]);

  const clearLines = useCallback((grid: (string | null)[][]) => {
    let linesCleared = 0;
    const newGrid = grid.filter(row => {
      if (row.every(cell => cell !== null)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newGrid.length < GRID_SIZE) {
      newGrid.unshift(Array(GRID_SIZE).fill(null));
    }

    return { newGrid, linesCleared };
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        setGameState(prev => {
          if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;
          const rotated = rotatePiece(prev.currentPiece, prev.grid);
          return { ...prev, currentPiece: rotated };
        });
        break;
      case ' ':
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
        break;
    }
  }, [movePiece, rotatePiece]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        if (!prev.currentPiece) {
          const newPiece = createRandomPiece();
          if (checkCollision(newPiece, prev.grid)) {
            return { ...prev, gameOver: true };
          }
          return { ...prev, currentPiece: newPiece };
        }

        // Handle piece movement
        const newPiece = {
          ...prev.currentPiece,
          blocks: prev.currentPiece.blocks.map(block => ({
            ...block,
            y: block.y + 1
          }))
        };

        if (checkCollision(newPiece, prev.grid)) {
          // Lock piece in place
          const newGrid = [...prev.grid];
          prev.currentPiece.blocks.forEach(block => {
            if (block.y >= 0) {
              newGrid[block.y][block.x] = block.color;
            }
          });

          const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid);
          const newScore = prev.score + (POINTS_PER_LINE * linesCleared * Math.pow(POINTS_MULTIPLIER, linesCleared - 1));
          const newLevel = Math.floor(newScore / 1000) + 1;

          return {
            ...prev,
            grid: clearedGrid,
            currentPiece: null,
            score: newScore,
            level: newLevel,
          };
        }

        return { ...prev, currentPiece: newPiece };
      });
    }, INITIAL_SPEED * Math.pow(SPEED_INCREASE, gameState.level - 1));

    // Grid rotation timer
    const rotationLoop = setInterval(() => {
      setGameState(prev => {
        if (prev.gameOver || prev.isPaused) return prev;
        
        const newGrid = rotateGrid(prev.grid);
        let newPiece = prev.currentPiece;
        
        if (newPiece) {
          newPiece = rotatePiece(newPiece, newGrid);
        }

        return {
          ...prev,
          grid: newGrid,
          currentPiece: newPiece,
          rotationTimer: prev.rotationTimer + 1,
        };
      });
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(gameLoop);
      clearInterval(rotationLoop);
    };
  }, [gameState.gameOver, gameState.isPaused, gameState.level, checkCollision, clearLines, rotateGrid, rotatePiece]);

  return {
    gameState,
    movePiece,
    rotatePiece: () => setGameState(prev => {
      if (!prev.currentPiece) return prev;
      return { ...prev, currentPiece: rotatePiece(prev.currentPiece, prev.grid) };
    }),
    resetGame: () => setGameState({
      score: 0,
      level: 1,
      grid: createEmptyGrid(),
      currentPiece: null,
      gameOver: false,
      isPaused: false,
      nextRotation: ROTATION_INTERVAL,
      rotationTimer: 0,
    }),
    togglePause: () => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused })),
  };
};