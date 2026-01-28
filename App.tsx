
import React, { useState, useCallback, useEffect } from 'react';
import { Tile, GameState } from './types';
import Header from './components/Header';
import SlidingPuzzle from './components/SlidingPuzzle';
import SuccessView from './components/SuccessView';

const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    moves: 0,
    isWon: false,
    gameStarted: false,
    discountCode: null,
  });

  // Initialize and shuffle the puzzle
  const initGame = useCallback(() => {
    // Start with solved state
    let tiles: Tile[] = Array.from({ length: TOTAL_TILES }, (_, i) => ({
      id: i,
      currentPos: i,
      isEmpty: i === TOTAL_TILES - 1,
    }));

    // Shuffle by making valid moves to ensure solvability
    let emptyIndex = TOTAL_TILES - 1;
    const shuffleMoves = 100;
    
    for (let i = 0; i < shuffleMoves; i++) {
      const neighbors = getNeighbors(emptyIndex);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Swap
      [tiles[emptyIndex], tiles[randomNeighbor]] = [tiles[randomNeighbor], tiles[emptyIndex]];
      tiles[emptyIndex].currentPos = emptyIndex;
      tiles[randomNeighbor].currentPos = randomNeighbor;
      emptyIndex = randomNeighbor;
    }

    setGameState({
      tiles,
      moves: 0,
      isWon: false,
      gameStarted: true,
      discountCode: null,
    });
  }, []);

  const getNeighbors = (index: number) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const neighbors: number[] = [];

    if (row > 0) neighbors.push(index - GRID_SIZE);
    if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE);
    if (col > 0) neighbors.push(index - 1);
    if (col < GRID_SIZE - 1) neighbors.push(index + 1);

    return neighbors;
  };

  const handleTileClick = (index: number) => {
    if (gameState.isWon) return;

    const emptyTileIndex = gameState.tiles.findIndex(t => t.isEmpty);
    const neighbors = getNeighbors(emptyTileIndex);

    if (neighbors.includes(index)) {
      const newTiles = [...gameState.tiles];
      [newTiles[index], newTiles[emptyTileIndex]] = [newTiles[emptyTileIndex], newTiles[index]];
      
      // Update positions
      newTiles[index].currentPos = index;
      newTiles[emptyTileIndex].currentPos = emptyTileIndex;

      const won = checkWin(newTiles);
      
      setGameState(prev => ({
        ...prev,
        tiles: newTiles,
        moves: prev.moves + 1,
        isWon: won,
        discountCode: won ? generatePromoCode() : null
      }));

      if (won) {
        // @ts-ignore
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#789D91', '#F5F5DC', '#2D2D2D']
        });
      }
    }
  };

  const checkWin = (tiles: Tile[]) => {
    return tiles.every(tile => tile.id === tile.currentPos);
  };

  const generatePromoCode = () => {
    return `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 md:p-12 overflow-hidden selection:bg-[#789D91] selection:text-white">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl space-y-8">
        {!gameState.isWon ? (
          <div className="flex flex-col items-center space-y-6 w-full">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#2D2D2D]">Reorganiza tu espacio</h2>
              <p className="text-lg md:text-xl text-gray-600">Desliza las piezas para completar la habitación Ecodecor.</p>
            </div>
            
            <SlidingPuzzle 
              tiles={gameState.tiles} 
              onTileClick={handleTileClick}
              moves={gameState.moves}
            />

            <button 
              onClick={initGame}
              className="mt-4 px-10 py-4 bg-transparent border-2 border-[#2D2D2D] text-[#2D2D2D] rounded-full text-xl font-medium hover:bg-[#2D2D2D] hover:text-white transition-all active:scale-95 touch-manipulation min-w-[200px] min-h-[80px] flex items-center justify-center"
            >
              Reiniciar
            </button>
          </div>
        ) : (
          <SuccessView 
            code={gameState.discountCode || ""} 
            onRestart={initGame} 
          />
        )}
      </main>

      <footer className="w-full text-center py-4 text-sm text-gray-500 font-light">
        © 2024 Ecodecor. Diseño Sostenible para un Futuro Mejor.
      </footer>
    </div>
  );
};

export default App;
