let snake = [{x: 0, y: 0}];
let direction = 'right';
let food = {x: 0, y: 0};
let score = 0;
let gameLoopInterval;
let obstacles = [
  {x: 60, y: 60},
  {x: 120, y: 120},
  {x: 180, y: 180},
  {x: 240, y: 240},
  {x: 300, y: 100},
  {x: 300, y: 120},
  {x: 300, y: 140},
  {x: 500, y: 140},
  {x: 500, y: 500},
  {x: 90, y: 500},
  {x: 520, y: 500},
  {x: 440, y: 500},
  {x: 30, y: 500},


];

function createFood() {
  let isValidPosition = false;
  
  while (!isValidPosition) {
    // Gera uma posição aleatória para a comida
    food.x = Math.floor(Math.random() * 15) * 20;
    food.y = Math.floor(Math.random() * 15) * 20;
    
    isValidPosition = !obstacles.some(obstacle => obstacle.x === food.x && obstacle.y === food.y);
  }
}

function drawSnake() {
  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = '';
  
  snake.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.className = 'snake';
    snakeElement.style.left = segment.x + 'px';
    snakeElement.style.top = segment.y + 'px';
    gameContainer.appendChild(snakeElement);
  });

  obstacles.forEach(obstacle => {
    const obstacleElement = document.createElement('div');
    obstacleElement.className = 'obstacle';
    obstacleElement.style.left = obstacle.x + 'px';
    obstacleElement.style.top = obstacle.y + 'px';
    gameContainer.appendChild(obstacleElement);
  });
  
  const foodElement = document.createElement('div');
  foodElement.className = 'food';
  foodElement.style.left = food.x + 'px';
  foodElement.style.top = food.y + 'px';
  gameContainer.appendChild(foodElement);
}

function drawScore() {
  document.getElementById('score').innerText = score;
}

function playRandomCollisionSound() {
  const esbarrou = new Audio('/esbarrar/efeito_um.mp3');
  esbarrou.play();
}

function playFoodSound() {
  const audioFiles = [
    '/efeitos/comer.mp3',
    '/efeitos/comendo.mp3',
  ];

  const randomIndex = Math.floor(Math.random() * audioFiles.length);
  const randomAudio = new Audio(audioFiles[randomIndex]);
  
  randomAudio.play();
}

function playBackgroundMusic() {
  const backgroundMusic = new Audio('/audio/fased.mp3');
  backgroundMusic.loop = true;
  backgroundMusic.play();
}

function moveSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case 'up':
      head.y -= 20;
      break;
    case 'down':
      head.y += 20;
      break;
    case 'left':
      head.x -= 20;
      break;
    case 'right':
      head.x += 20;
      break;
  }

  const gameContainer = document.getElementById('game-container');
  const containerWidth = gameContainer.clientWidth;
  const containerHeight = gameContainer.clientHeight;

  if (head.x < 0 || head.x >= containerWidth || head.y < 0 || head.y >= containerHeight || checkCollision(head) || checkObstacleCollision(head)) {
    endGame();
    playRandomCollisionSound();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    createFood();
    playFoodSound();
  } else {
    snake.pop();
  }

  drawSnake();
  drawScore();
}

function changeDirection(newDirection) {
  direction = newDirection;
}

function checkCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function checkObstacleCollision(head) {
  for (let obstacle of obstacles) {
    if (head.x === obstacle.x && head.y === obstacle.y) {
      return true;
    }
  }
  return false;
}

function endGame() {
  clearInterval(gameLoopInterval);
  const gameOverScreen = document.getElementById('game-over');
  gameOverScreen.classList.remove('hidden');
}

function restartGame() {
  snake = [{x: 0, y: 0}];
  direction = 'right';
  food = {x: 0, y: 0};
  score = 0;
  createFood();
  document.getElementById('game-over').classList.add('hidden');
  gameLoopInterval = setInterval(moveSnake, 200);
}

function exitGame() {
  clearInterval(gameLoopInterval);
  document.getElementById('game-container').innerHTML = '';
  document.getElementById('game-over').classList.add('hidden');
}

createFood();
gameLoopInterval = setInterval(moveSnake, 200);

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      if (direction !== 'down') {
        changeDirection('up');
      }
      break;
    case 'ArrowDown':
      if (direction !== 'up') {
        changeDirection('down');
      }
      break;
    case 'ArrowLeft':
      if (direction !== 'right') {
        changeDirection('left');
      }
      break;
    case 'ArrowRight':
      if (direction !== 'left') {
        changeDirection('right');
      }
      break;
  }
});

playBackgroundMusic();
