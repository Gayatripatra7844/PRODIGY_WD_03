const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const settingsButton = document.getElementById('settings');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const totalGamesElement = document.getElementById('totalGames');
const gameModeSelect = document.getElementById('gameMode');
const saveSettingsButton = document.getElementById('saveSettings');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let player1Score = 0;
let player2Score = 0;
let totalGames = 0;
let gameMode = 'player'; // default game mode

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick, { once: true });
});

restartButton.addEventListener('click', restartGame);
settingsButton.addEventListener('click', () => $('#settingsModal').modal('show'));
saveSettingsButton.addEventListener('click', saveSettings);

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = cell.getAttribute('data-index');

    if (gameState[cellIndex] !== '' || checkWin()) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
        updateScore();
        animateWinningCells();
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        return;
    }

    if (!gameState.includes('')) {
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'ai' && currentPlayer === 'O') {
        aiMove();
    }
}

function aiMove() {
    const availableCells = gameState.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    const aiChoice = availableCells[Math.floor(Math.random() * availableCells.length)];
    
    gameState[aiChoice] = 'O';
    cells[aiChoice].textContent = 'O';
    cells[aiChoice].removeEventListener('click', handleCellClick);

    if (checkWin()) {
        updateScore();
        animateWinningCells();
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        return;
    }

    if (!gameState.includes('')) {
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        return;
    }

    currentPlayer = 'X';
}

function checkWin() {
    return winningCombinations.some(combination => {
        if (combination.every(index => gameState[index] === currentPlayer)) {
            combination.forEach(index => cells[index].classList.add('winner'));
            return true;
        }
        return false;
    });
}

function updateScore() {
    if (currentPlayer === 'X') {
        player1Score++;
        player1ScoreElement.textContent = player1Score;
    } else {
        player2Score++;
        player2ScoreElement.textContent = player2Score;
    }
    totalGames++;
    totalGamesElement.textContent = totalGames;
}

function animateWinningCells() {
    winningCombinations.forEach(combination => {
        if (combination.every(index => gameState[index] === currentPlayer)) {
            combination.forEach(index => cells[index].classList.add('winner'));
        }
    });
}

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
        cell.addEventListener('click', handleCellClick, { once: true });
    });
}

function saveSettings() {
    gameMode = gameModeSelect.value;
    $('#settingsModal').modal('hide');
}
