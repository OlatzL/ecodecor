
export interface Tile {
  id: number; // Original position 0-8
  currentPos: number; // Current index in the grid 0-8
  isEmpty: boolean;
}

export interface GameState {
  tiles: Tile[];
  moves: number;
  isWon: boolean;
  gameStarted: boolean;
  discountCode: string | null;
}
