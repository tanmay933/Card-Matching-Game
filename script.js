const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cards = [...cardValues, ...cardValues];
let flippedCards = [];
let matchedCards = [];
let score = 0;
let timeElapsed = 0;
let gameInterval;
let gameStarted = false;
let gameOver = false;
let playerName = 'Player';

document.getElementById('start-game-btn').addEventListener('click', function() {
    const inputName = document.getElementById('player-name').value.trim();
    if (inputName) {
        playerName = inputName;
    } else {
        alert('Please enter your name.');
        return;
    }
    startGame();
});

function shuffleCards() {
    cards = cards.sort(() => Math.random() - 0.5);
}

function createBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    shuffleCards();

    cards.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-value', value);
        card.setAttribute('data-index', index);
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard(event) {
    const card = event.target;

    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched') || gameOver) {
        return;
    }

    card.textContent = card.getAttribute('data-value');
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.getAttribute('data-value') === card2.getAttribute('data-value')) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
    } else {
        setTimeout(() => {
            card1.textContent = '';
            card2.textContent = '';
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }

    flippedCards = [];

    if (score === cardValues.length) {
        clearInterval(gameInterval);
        gameOver = true;
        showVictoryPage();
    }
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(() => {
            timeElapsed++;
            document.getElementById('timer').textContent = `Time: ${timeElapsed}`;
        }, 1000);
    }
}

function showVictoryPage() {
    const victoryPage = document.createElement('div');
    victoryPage.setAttribute('id', 'victory-page');
    victoryPage.innerHTML = `
        <h2>Congratulations, ${playerName}!</h2>
        <p>You won the game!</p>
        <p>Score: ${score}</p>
        <p>Time: ${timeElapsed} seconds</p>
        <button id="restart-btn">Play Again</button>
    `;
    document.body.appendChild(victoryPage);

    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

function restartGame() {
    gameOver = false;
    score = 0;
    timeElapsed = 0;
    flippedCards = [];
    matchedCards = [];
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('timer').textContent = `Time: ${timeElapsed}`;

    document.getElementById('victory-page').remove();

    createBoard();
    startTimer();
}

function startGame() {
    createBoard();
    score = 0;
    timeElapsed = 0;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('timer').textContent = 'Time: 0';
    startTimer();
}

window.onload = function() {
    document.getElementById('player-name').focus();
};
