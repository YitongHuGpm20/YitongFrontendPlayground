// ==== References ====
const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const balloonContainer = document.getElementById("balloon-container");
const scoreboard = document.getElementById("scoreboard");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("final-score");

// ==== Variables ====
let gameInterval;
let timeInterval;
let timeLeft = 30;
let score = 0;
let gameRunning = false;
let spawnTimer;
let speedInterval; // Timer of difficulty increasing
let speedFactor = 1; // Difficulty
let baseSpawnDelay = 400;
let minSpawnDelay = 120;

// ==== Game Logic ====
function createBalloon() {
  if (!gameRunning) return;
  
  // Initialize a balloon
  const balloon = document.createElement("div");
  balloon.classList.add("balloon");
  balloon.textContent = "🎈";
  balloon.style.left = Math.random() * (window.innerWidth - 50) + "px"; // random x 
  
  // Set flying speed
  const base = Math.random() * 3 + 4; // 4~7s
  const duration = Math.max(1.2, base / speedFactor);
  balloon.style.animationDuration = duration + "s";

  // Click to pop
  balloon.addEventListener("click", () => {
    balloon.remove();
    score++;
    scoreDisplay.textContent = score;
  });
  
  // Reached the top of the screen
  balloon.addEventListener("animationend", () => {
    balloon.remove();
  });
  
  balloonContainer.appendChild(balloon);
}

function scheduleSpawn() {
  if (!gameRunning) return;
  
  createBalloon();
  
  // Generally increase spawn speed
  const nextDelay = Math.max(minSpawnDelay, Math.floor(baseSpawnDelay / speedFactor));
  spawnTimer = setTimeout(scheduleSpawn, nextDelay);
}

function startGame() {
  startScreen.style.display = "none";
  scoreboard.style.display = "block";
  endScreen.style.display = "none";
  gameRunning = true;

  // Reset variables
  timeLeft = 30;
  score = 0;
  timeDisplay.textContent = timeLeft;
  scoreDisplay.textContent = score;
  speedFactor = 1;
  
  scheduleSpawn();

  // Increase difficulty 15% every half second
  speedInterval = setInterval(() => {
    speedFactor += 0.15;
  }, 5000);

  // Start timer
  timeInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}
function endGame() {
  gameRunning = false;
  
  clearInterval(gameInterval);
  clearInterval(timeInterval);
  clearTimeout(spawnTimer);

  scoreboard.style.display = "none";
  endScreen.style.display = "flex";
  finalScoreDisplay.textContent = score;
}

// ==== Bind Button Functions
startBtn.addEventListener("click", startGame);