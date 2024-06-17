let snake = [{x: 0, y: 0}];
let direction = 'right';
let food = {x: 0, y: 0};
let score = 0;
let gameLoopInterval;

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
  const backgroundMusic = new Audio('/audio/theme.mp3');
  backgroundMusic.loop = true;
  backgroundMusic.play();
}

function createFood() {
  const gameContainer = document.getElementById('game-container');
  const containerWidth = gameContainer.clientWidth;
  const containerHeight = gameContainer.clientHeight;

  food.x = Math.floor(Math.random() * (containerWidth / 20)) * 20;
  food.y = Math.floor(Math.random() * (containerHeight / 20)) * 20;
}

function drawSnake() {
  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = '';
  
  snake.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.className = 'snake';
    
    const adjustedX = segment.x - (segment.x % 20);
    const adjustedY = segment.y - (segment.y % 20);
    
    snakeElement.style.left = adjustedX + 'px';
    snakeElement.style.top = adjustedY + 'px';
    gameContainer.appendChild(snakeElement);
  });
  
  const foodElement = document.createElement('div');
  foodElement.className = 'food';
  foodElement.style.left = food.x + 'px';
  foodElement.style.top = food.y + 'px';
  gameContainer.appendChild(foodElement);
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

  if (head.x < 0 || head.x >= containerWidth || head.y < 0 || head.y >= containerHeight || checkCollision(head)) {
    endGame();
    playRandomCollisionSound(); 
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score === 5) {
      goToPhase2();
      return;
    }
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

function endGame() {
  clearInterval(gameLoopInterval);
  const gameOverScreen = document.getElementById('game-over');
  gameOverScreen.classList.remove('hidden');

  document.getElementById('final-score').innerText = score;
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

function drawScore() {
  document.getElementById('score').innerText = score;
}

function startGame() {
  createFood();
  gameLoopInterval = setInterval(moveSnake, 200);
  playBackgroundMusic();
}

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

startGame();

function goToPhase2() {
  if (score === 5) {
    alert("Indo para a Fase 2");
    window.location.href = "segunda/fase2.html";
  }
}
