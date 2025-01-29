document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const newGameButton = document.getElementById('new-game');

    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let time = 0;
    let timer;

    const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    function createCard(symbol) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.addEventListener('click', flipCard);
        return card;
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            this.textContent = this.dataset.symbol;
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                moves++;
                movesDisplay.textContent = moves;
                checkForMatch();
            }
        }
    }

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

    function startTimer() {
        timer = setInterval(() => {
            time++;
            timeDisplay.textContent = String(time).padStart(2, '0');
        }, 1000);
    }

    function startGame() {
        grid.innerHTML = '';
        moves = 0;
        time = 0;
        movesDisplay.textContent = moves;
        timeDisplay.textContent = '00:00';
        flippedCards = [];
        clearInterval(timer);

        const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        cards = shuffledSymbols.map(symbol => createCard(symbol));
        cards.forEach(card => grid.appendChild(card));

        startTimer();
    }

    newGameButton.addEventListener('click', startGame);

    startGame();
});