const board = document.getElementById('board');
const cells = board.getElementsByClassName('cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');

let boardState = Array(9).fill(null);
let currentPlayer = 'X';

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

function checkWinner() {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return boardState.includes(null) ? null : 'Tie';
}

function handleClick(event) {
    const index = event.target.dataset.index;

    if (boardState[index] || checkWinner()) return;

    boardState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    const winner = checkWinner();
    if (winner) {
        message.textContent = winner === 'Tie' ? 'It\'s a Tie!' : `${winner} Wins!`;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') {
        computerMove();
    }
}

function computerMove() {
    const bestMove = findBestMove();
    boardState[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    const winner = checkWinner();
    if (winner) {
        message.textContent = winner === 'Tie' ? 'It\'s a Tie!' : `${winner} Wins!`;
        return;
    }

    currentPlayer = 'X';
}

function findBestMove() {
    let bestValue = -Infinity;
    let bestMove;

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === null) {
            boardState[i] = 'O';
            const moveValue = minimax(boardState, 0, false);
            boardState[i] = null;
            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner();

    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'Tie') return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return best;
    }
}

function restartGame() {
    boardState = Array(9).fill(null);
    currentPlayer = 'X';
    message.textContent = '';
    Array.from(cells).forEach(cell => cell.textContent = '');
}

board.addEventListener('click', handleClick);
restartButton.addEventListener('click', restartGame);
