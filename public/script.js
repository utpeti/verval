const width = 1840;
const height = 780;
let canvas;
let context;
let gameMenu;
let countDown;
let clickListener;
let totalScore = 0;
let difficulty = 'easy';
let timer;

function initializeCanvas() {
  canvas = document.getElementById('game-canvas-id');
  context = canvas.getContext('2d');
  gameMenu = document.getElementById('game-menu-id');
  countDown = document.getElementById('timer-id');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.fillStyle = '#724e2a';
  context.font = '20px Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText('Score: 0', canvas.width - 150, 15);
  context.fillText('Round: 1/10', 40, 15);
}

const helloThereImage = new Image();
helloThereImage.src = 'images/hello_there.jpeg';
document.addEventListener('DOMContentLoaded', () => initializeCanvas());

function setDifficulty() {
  switch (difficulty) {
    case 'easy':
      timer = 0.5;
      break;
    case 'medium':
      timer = 0.25;
      break;
    case 'hard':
      timer = 0.125;
      break;
    case 'impossible':
      timer = 0.05;
      break;
    default:
      timer = 0.375;
  }
}

function closeCurrent(currentScoreText) {
  currentScoreText.style.display = 'none';
}

function displayCurrent(round, currentScore, distance) {
  const currentScoreText = document.getElementById('game-current-id');
  currentScoreText.getElementsByTagName('h1')[0].textContent = `Round: ${round + 1}`;
  currentScoreText.getElementsByTagName('h2')[0].textContent = `Score: ${currentScore}`;
  currentScoreText.getElementsByTagName('h2')[1].textContent = `Distance: ${distance.toFixed(2)}`;
  currentScoreText.style.display = 'block';
  setTimeout(() => closeCurrent(currentScoreText), 1000);
}

function updateScoreAndRound(score = 0, round = 1) {
  totalScore += score;
  context.clearRect(canvas.width - 150, 0, 150, 30);
  context.fillText(`Score: ${totalScore}`, canvas.width - 150, 15);
  context.clearRect(40, 0, 120, 30);
  context.fillText(`Round: ${round + 1}/10`, 40, 15);
}

function endGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const gameOver = document.getElementById('game-over-id');
  gameOver.getElementsByTagName('h2')[0].textContent = `Your score is ${totalScore}`;
  gameOver.getElementsByTagName('h3')[0].textContent = `Difficulty: ${difficulty.toUpperCase()}`;
  gameOver.style.display = 'block';
}

function playRound(round = 0) {
  const imgWidth = 60;
  const imgHeight = 40;
  const x = Math.random() * (canvas.width - imgWidth);
  const y = 30 + Math.random() * (canvas.height - imgHeight - 30);

  context.drawImage(helloThereImage, x, y, imgWidth, imgHeight);

  setTimeout(() => context.clearRect(x - 1, y - 1, imgWidth + 3, imgHeight + 3), timer * 1000);

  if (clickListener) {
    canvas.removeEventListener('click', clickListener);
  }

  canvas.addEventListener(
    'click',
    (clickListener = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const imageCenterX = x + imgWidth / 2;
      const imageCenterY = y + imgHeight / 2;
      const distanceX = Math.abs(mouseX - imageCenterX);
      const distanceY = Math.abs(mouseY - imageCenterY);
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      let currentScore = Math.round(10 - distance / 100);
      if (currentScore < 0) {
        currentScore = 0;
      }

      updateScoreAndRound(currentScore, round + 1);
      displayCurrent(round, currentScore, distance);
      // Remove the image to prevent it from staying if clicked quickly
      context.clearRect(x - 1, y - 1, imgWidth + 3, imgHeight + 3);
      setTimeout(() => playRound(round + 1), 1000);
      if (round === 9) {
        setTimeout(() => endGame(), 1000);
      }
    }),
  );
}

function pictureGame() {
  const round = 0;
  helloThereImage.onload = () => playRound(round);
  helloThereImage.src = 'images/hello_there.jpeg';
}

function startTimer() {
  let count = 3;
  const counter = setInterval(() => {
    count--;
    countDown.textContent = count;

    if (count === 0) {
      clearInterval(counter);
      countDown.style.display = 'none';
      pictureGame();
    }
  }, 1000);
}

function closeMenu() {
  gameMenu.style.display = 'none';
  startTimer();
}

function displayMenu() {
  document.getElementById('easy-btn-id').addEventListener('click', () => {
    difficulty = 'easy';
    setDifficulty();
    closeMenu();
  });
  document.getElementById('medium-btn-id').addEventListener('click', () => {
    difficulty = 'medium';
    setDifficulty();
    closeMenu();
  });
  document.getElementById('hard-btn-id').addEventListener('click', () => {
    difficulty = 'hard';
    setDifficulty();
    closeMenu();
  });
  document.getElementById('impossible-btn-id').addEventListener('click', () => {
    difficulty = 'impossible';
    setDifficulty();
    closeMenu();
  });
}

window.onload = () => displayMenu();
