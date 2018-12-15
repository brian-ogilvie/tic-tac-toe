const $gameBoard = document.querySelector('.game-board');
const $resetButton = document.querySelector('.reset');
const $player1Indicator = document.querySelector('#player1');
const $player2Indicator = document.querySelector('#player2');

const squares = [];
let player1Squares = [];
let player2Squares = [];

let player1IsActive = true;
let winningPlayer = null;
let gameOver = false;

function createSquaresArray() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      squares.push({
        'x': x,
        'y': y,
      });
    }
  }
}

function renderSquares() {
  squares.forEach(square => {
    const $square = document.createElement('div');
    $square.className = 'square';
    $square.style.top = (square.y * 33.3333).toString() + '%';
    $square.style.left = (square.x * 33.3333).toString() + '%';
    switch (square.y) {
      case 0: $square.classList.add('topRow');
        break;
      case 2: $square.classList.add('bottomRow');
        break;
    }
    switch (square.x) {
      case 0: $square.classList.add('leftColumn');
        break;
      case 2: $square.classList.add('rightColumn');
        break;
    }
    $square.addEventListener('click', handleSquareClick);
    square.$el = $square;
    $gameBoard.append($square);
  })
}

function handleSquareClick(event) {
  if (gameOver) { return }
  let square = squares.filter(square => square.$el === event.target)[0];
  if (isAlreadyOccupied(square, player1Squares) || isAlreadyOccupied(square, player2Squares)) { return };
  if (player1IsActive) {
    player1Squares.push(square);
    addPieceToBoardSpace(1, square);
  } else {
    player2Squares.push(square);
    addPieceToBoardSpace(2, square);
  }
}

function isAlreadyOccupied(square, array) {
  if (square === undefined) { return true }
  if (array.length === 0) { return false }
  return array.findIndex(occupied => {
    return occupied.x === square.x && occupied.y === square.y
  }) > -1;
}

function addPieceToBoardSpace(playerNum, square) {
  const $space = square.$el;
  const $piece = document.createElement('div');
  $piece.className = 'playerPiece';
  const text = playerNum === 1 ? 'X' : 'O';
  $piece.textContent = text;
  $piece.classList.add(text);
  $space.append($piece);
  checkForWinner(playerNum, square);
}

function checkForWinner(playerNum, lastSquare) {
  const array = playerNum === 1 ? player1Squares : player2Squares;
  const condition1 = array.filter(square => square.x === lastSquare.x).length ===3;
  const condition2 = array.filter(square => square.y === lastSquare.y).length ===3;
  const condition3 = array.filter(square => square.x === square.y).length === 3;
  const condition4 = array.filter(square => square.x + square.y === 2).length === 3;
  if (condition1 || condition2 || condition3 || condition4) {
    winningPlayer = playerNum;
  }
  if (winningPlayer !== null || player1Squares.length + player2Squares.length >= 9) {
    gameOver = true;
    displayGameOver();
    return;
  }
  player1IsActive = !player1IsActive;
  displayActivePlayer();
}

function displayActivePlayer() {
  if (player1IsActive) {
    $player1Indicator.classList.add('active');
    $player2Indicator.classList.remove('active');
  } else {
    $player1Indicator.classList.remove('active');
    $player2Indicator.classList.add('active');
  }
}

function hideActivePlayer() {
  $player1Indicator.classList.remove('active');
  $player2Indicator.classList.remove('active');
}

function displayGameOver() {
  let $endGame = document.createElement('div');
  $endGame.className = 'endGame';
  const $p = document.createElement('p');
  $p.textContent = "Game Over";
  $endGame.append($p);
  const $p2 = document.createElement('p');
  if (winningPlayer !== null) {
    $p2.textContent = `\nPlayer ${winningPlayer} wins!`;
  } else {
    $p2.textContent = 'No More Moves';
  }
  $endGame.append($p2);
  hideActivePlayer();
  $gameBoard.append($endGame);
}

function resetGame() {
  winningPlayer = null;
  const $pieces = document.querySelectorAll('.playerPiece');
  if (gameOver) {
    const $endGame = document.querySelector('.endGame');
    $endGame.classList.add('resetting');
    setTimeout(() => $endGame.remove(), 500);
  }
  $pieces.forEach($piece => $piece.remove());
  player1Squares = [];
  player2Squares = [];
  gameOver = false;
  player1IsActive = !player1IsActive;
  displayActivePlayer();
}

createSquaresArray();
renderSquares();
displayActivePlayer();
$resetButton.addEventListener('click', resetGame);
