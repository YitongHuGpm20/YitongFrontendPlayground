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

// ==== Game Logic ====
function createBalloon() {
  if (!gameRunning) return;
  
  // Initialize a balloon
  const balloon = document.createElement("div");
  balloon.classList.add("balloon");
  balloon.textContent = "🎈";
  balloon.style.left = Math.random() * (window.innerWidth - 50) + "px"; // random x 
  balloon.style.animationDuration = Math.random() * 3 + 4 + "s"; // random speed

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

function startGame() {
  startScreen.style.display = "none";
  scoreboard.style.display = "block";
  gameRunning = true;

  //Start spawning balloon every 0.4s
  gameInterval = setInterval(createBalloon, 400);

  //Start countdown timer
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

  scoreboard.style.display = "none";
  endScreen.style.display = "flex";
  finalScoreDisplay.textContent = score;
}

// ==== Bind Button Functions
startBtn.addEventListener("click", startGame);