document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const movesDisplay = document.getElementById('moves'); // Used for both current and total moves
    const timeDisplay = document.getElementById('time');
    const newGameButton = document.getElementById('new-game');

    let cards = [];
    let flippedCards = [];
    let moves = 0; // Current game moves
    let time = 0;
    let timer;

    const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    // Load game state from sessionStorage
    function loadGameState() {
        const gameState = sessionStorage.getItem('gameState');
        if (gameState) {
            const state = JSON.parse(gameState);
            moves = state.moves;
            movesDisplay.textContent = moves; // Update current game moves
            return state.cards;
        }
        return null;
    }

    // Save game state to sessionStorage
    function saveGameState() {
        const state = {
            cards: cards.map(card => ({
                symbol: card.dataset.symbol,
                flipped: card.classList.contains('flipped'),
            })),
            moves: moves,
        };
        sessionStorage.setItem('gameState', JSON.stringify(state));
    }

    // Load total moves from localStorage
    function loadTotalMoves() {
        const totalMoves = localStorage.getItem('totalMoves');
        return totalMoves ? parseInt(totalMoves) : 0;
    }

    // Save total moves to localStorage
    function saveTotalMoves() {
        const totalMoves = loadTotalMoves() + 1; // Increment total moves
        localStorage.setItem('totalMoves', totalMoves);
    }

    // Create a card element
    function createCard(symbol, isFlipped = false) {
        const card = document.createElement('div');
        card.classList.add('card');
        if (isFlipped) card.classList.add('flipped');
        card.dataset.symbol = symbol;
        card.textContent = isFlipped ? symbol : '';
        card.addEventListener('click', flipCard);
        return card;
    }

    // Flip a card
    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            this.textContent = this.dataset.symbol;
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                moves++;
                movesDisplay.textContent = moves; // Update current game moves
                saveTotalMoves(); // Update total moves
                checkForMatch();
                saveGameState(); // Save game state after each move
            }
        }
    }

    // Check if flipped cards match
    function checkForMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.symbol === card2.dataset.symbol) {
            flippedCards = [];
            if (cards.every(card => card.classList.contains('flipped'))) {
                clearInterval(timer);
                alert(`Game Over! You won in ${moves} moves and ${time} seconds.`);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
                flippedCards = [];
            }, 1000);
        }
    }

    // Start the timer
    function startTimer() {
        timer = setInterval(() => {
            time++;
            timeDisplay.textContent = String(time).padStart(2, '0');
        }, 1000);
    }

    // Start a new game
    function startGame() {
        // Clear sessionStorage to reset the game state
        sessionStorage.removeItem('gameState');

        // Reset game variables
        grid.innerHTML = '';
        moves = 0;
        time = 0;
        movesDisplay.textContent = moves; // Reset current game moves
        timeDisplay.textContent = '00:00';
        flippedCards = [];
        clearInterval(timer);

        // Create a new shuffled set of cards
        const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        cards = shuffledSymbols.map(symbol => createCard(symbol));

        // Add cards to the grid
        cards.forEach(card => grid.appendChild(card));

        // Start the timer
        startTimer();
    }

    // Initialize game
    newGameButton.addEventListener('click', startGame);

    // Load game state if it exists
    const savedCards = loadGameState();
    if (savedCards) {
        cards = savedCards.map(card => createCard(card.symbol, card.flipped));
        cards.forEach(card => grid.appendChild(card));
        startTimer();
    } else {
        startGame(); // Start a new game if no saved state exists
    }
});
