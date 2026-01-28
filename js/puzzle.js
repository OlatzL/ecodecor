/**
 * Ecodecor Sliding Puzzle Game
 * A 4x4 sliding puzzle with discount code reward system
 */

class SlidingPuzzle {
  constructor() {
    this.gridSize = 4;
    this.totalTiles = this.gridSize * this.gridSize;
    this.tiles = [];
    this.emptyIndex = this.totalTiles - 1;
    this.moves = 0;
    this.seconds = 0;
    this.timerInterval = null;
    this.isGameWon = false;
    
    // DOM elements
    this.puzzleGrid = document.getElementById('puzzle-grid');
    this.movesDisplay = document.getElementById('moves');
    this.timerDisplay = document.getElementById('timer');
    this.resetBtn = document.getElementById('reset-btn');
    this.hintBtn = document.getElementById('hint-btn');
    this.modal = document.getElementById('success-modal');
    this.modalClose = document.getElementById('modal-close');
    this.playAgainBtn = document.getElementById('play-again-btn');
    
    this.init();
  }

  /**
   * Initialize the game
   */
  init() {
    this.checkExistingCode();
    this.createTiles();
    this.shufflePuzzle();
    this.renderPuzzle();
    this.attachEventListeners();
    this.startTimer();
  }

  /**
   * Check if user already has a discount code
   */
  checkExistingCode() {
    const savedCode = localStorage.getItem('ecodecor_discount_code');
    const savedExpiry = localStorage.getItem('ecodecor_code_expiry');
    
    if (savedCode && savedExpiry) {
      const expiryDate = new Date(savedExpiry);
      const now = new Date();
      
      // Check if code is still valid
      if (now < expiryDate) {
        console.log('User already has a valid discount code');
      } else {
        // Code expired, remove it
        localStorage.removeItem('ecodecor_discount_code');
        localStorage.removeItem('ecodecor_code_expiry');
        console.log('Previous code expired');
      }
    }
  }

  /**
   * Create tile objects in solved state
   */
  createTiles() {
    this.tiles = [];
    for (let i = 0; i < this.totalTiles; i++) {
      this.tiles.push({
        id: i,
        currentPos: i,
        isEmpty: i === this.totalTiles - 1
      });
    }
  }

  /**
   * Shuffle puzzle using valid moves to ensure solvability
   */
  shufflePuzzle() {
    const shuffleMoves = 200; // Number of random moves
    
    for (let i = 0; i < shuffleMoves; i++) {
      const neighbors = this.getNeighbors(this.emptyIndex);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      this.swapTiles(this.emptyIndex, randomNeighbor);
      this.emptyIndex = randomNeighbor;
    }
    
    // Reset moves counter after shuffling
    this.moves = 0;
    this.updateMoves();
  }

  /**
   * Get valid neighbor indices for a given position
   */
  getNeighbors(index) {
    const row = Math.floor(index / this.gridSize);
    const col = index % this.gridSize;
    const neighbors = [];

    if (row > 0) neighbors.push(index - this.gridSize); // Up
    if (row < this.gridSize - 1) neighbors.push(index + this.gridSize); // Down
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < this.gridSize - 1) neighbors.push(index + 1); // Right

    return neighbors;
  }

  /**
   * Swap two tiles
   */
  swapTiles(index1, index2) {
    [this.tiles[index1], this.tiles[index2]] = [this.tiles[index2], this.tiles[index1]];
    this.tiles[index1].currentPos = index1;
    this.tiles[index2].currentPos = index2;
  }

  /**
   * Render the puzzle grid
   */
  renderPuzzle() {
    this.puzzleGrid.innerHTML = '';
    
    this.tiles.forEach((tile, index) => {
      const tileElement = document.createElement('div');
      tileElement.className = 'puzzle-tile';
      tileElement.dataset.index = index;
      
      if (tile.isEmpty) {
        tileElement.classList.add('empty-tile');
      } else {
        // Calculate background position based on original tile position
        const row = Math.floor(tile.id / this.gridSize);
        const col = tile.id % this.gridSize;
        const bgPosX = -(col * 100);
        const bgPosY = -(row * 100);
        
        tileElement.style.backgroundImage = 'url(images/nordic-room.svg)';
        tileElement.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
        
        // Add tile number (hidden by default, shown with hint)
        const tileNumber = document.createElement('span');
        tileNumber.className = 'tile-number';
        tileNumber.textContent = tile.id + 1;
        tileElement.appendChild(tileNumber);
        
        // Check if tile is moveable
        if (this.getNeighbors(this.emptyIndex).includes(index)) {
          tileElement.classList.add('moveable');
        }
      }
      
      this.puzzleGrid.appendChild(tileElement);
    });
  }

  /**
   * Handle tile click
   */
  handleTileClick(event) {
    if (this.isGameWon) return;
    
    const tileElement = event.target.closest('.puzzle-tile');
    if (!tileElement) return;
    
    const index = parseInt(tileElement.dataset.index);
    const neighbors = this.getNeighbors(this.emptyIndex);
    
    if (neighbors.includes(index)) {
      this.swapTiles(index, this.emptyIndex);
      this.emptyIndex = index;
      this.moves++;
      this.updateMoves();
      this.renderPuzzle();
      
      // Check for win
      if (this.checkWin()) {
        this.handleWin();
      }
    }
  }

  /**
   * Check if puzzle is solved
   */
  checkWin() {
    return this.tiles.every(tile => tile.id === tile.currentPos);
  }

  /**
   * Handle win condition
   */
  handleWin() {
    this.isGameWon = true;
    this.stopTimer();
    
    // Add won class for animation
    document.querySelector('.puzzle-board').classList.add('won');
    
    setTimeout(() => {
      this.showSuccessModal();
    }, 500);
  }

  /**
   * Show success modal with discount code
   */
  showSuccessModal() {
    const savedCode = localStorage.getItem('ecodecor_discount_code');
    const savedExpiry = localStorage.getItem('ecodecor_code_expiry');
    
    let modalContent = '';
    
    if (savedCode && savedExpiry) {
      // User already has a code
      const expiryDate = new Date(savedExpiry);
      const now = new Date();
      
      if (now < expiryDate) {
        modalContent = `
          <h2 class="modal-title">¡Felicitaciones!</h2>
          <p class="modal-text">Has completado el rompecabezas en <strong>${this.moves}</strong> movimientos y <strong>${this.formatTime(this.seconds)}</strong>.</p>
          
          <div class="already-claimed">
            <p><strong>Ya has reclamado tu código de descuento:</strong></p>
          </div>
          
          <div class="discount-code">
            <div class="code-label">Tu Código de Descuento</div>
            <div class="code-value">${savedCode}</div>
            <div class="code-details">
              <p>Descuento: <strong>5%</strong></p>
              <p>Válido hasta: <span class="code-expiry">${this.formatDate(expiryDate)}</span></p>
            </div>
          </div>
          
          <p class="modal-text">Este código solo se puede obtener una vez por usuario.</p>
          
          <div class="modal-buttons">
            <button class="btn btn-primary" id="play-again-btn">Jugar de Nuevo</button>
            <button class="btn" id="modal-close">Cerrar</button>
          </div>
        `;
      } else {
        // Code expired, generate new one
        const newCode = this.generateDiscountCode();
        modalContent = this.createNewCodeModal(newCode);
      }
    } else {
      // First time - generate new code
      const newCode = this.generateDiscountCode();
      modalContent = this.createNewCodeModal(newCode);
    }
    
    this.modal.querySelector('.modal-content').innerHTML = modalContent;
    this.modal.classList.add('active');
    
    // Reattach event listeners for modal buttons
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('play-again-btn').addEventListener('click', () => {
      this.closeModal();
      this.resetGame();
    });
  }

  /**
   * Create modal content for new discount code
   */
  createNewCodeModal(code) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);
    
    return `
      <h2 class="modal-title">¡Felicitaciones! 🎉</h2>
      <p class="modal-text">Has completado el rompecabezas en <strong>${this.moves}</strong> movimientos y <strong>${this.formatTime(this.seconds)}</strong>.</p>
      
      <p class="modal-text">Como recompensa, aquí está tu código de descuento exclusivo:</p>
      
      <div class="discount-code">
        <div class="code-label">Tu Código de Descuento</div>
        <div class="code-value">${code}</div>
        <div class="code-details">
          <p>Descuento: <strong>5%</strong></p>
          <p>Válido hasta: <span class="code-expiry">${this.formatDate(expiryDate)}</span></p>
        </div>
      </div>
      
      <p class="modal-text">Guarda este código y úsalo en tu próxima compra. ¡Solo se puede obtener una vez!</p>
      
      <div class="modal-buttons">
        <button class="btn btn-primary" id="play-again-btn">Jugar de Nuevo</button>
        <button class="btn" id="modal-close">Cerrar</button>
      </div>
    `;
  }

  /**
   * Generate unique discount code
   */
  generateDiscountCode() {
    const prefix = 'ECODECOR';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${prefix}-${random}`;
    
    // Save to localStorage with expiry date
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 3);
    
    localStorage.setItem('ecodecor_discount_code', code);
    localStorage.setItem('ecodecor_code_expiry', expiryDate.toISOString());
    
    return code;
  }

  /**
   * Close modal
   */
  closeModal() {
    this.modal.classList.remove('active');
  }

  /**
   * Reset the game
   */
  resetGame() {
    this.isGameWon = false;
    this.moves = 0;
    this.seconds = 0;
    this.stopTimer();
    document.querySelector('.puzzle-board').classList.remove('won');
    this.createTiles();
    this.shufflePuzzle();
    this.renderPuzzle();
    this.startTimer();
    this.updateMoves();
    this.updateTimer();
  }

  /**
   * Show hint by briefly displaying tile numbers
   */
  showHint() {
    this.puzzleGrid.classList.add('show-numbers');
    
    setTimeout(() => {
      this.puzzleGrid.classList.remove('show-numbers');
    }, 2000);
  }

  /**
   * Start timer
   */
  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      this.seconds++;
      this.updateTimer();
    }, 1000);
  }

  /**
   * Stop timer
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Update moves display
   */
  updateMoves() {
    this.movesDisplay.textContent = this.moves;
  }

  /**
   * Update timer display
   */
  updateTimer() {
    this.timerDisplay.textContent = this.formatTime(this.seconds);
  }

  /**
   * Format seconds to MM:SS
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Format date to readable string
   */
  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    this.puzzleGrid.addEventListener('click', (e) => this.handleTileClick(e));
    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.hintBtn.addEventListener('click', () => this.showHint());
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SlidingPuzzle();
});
