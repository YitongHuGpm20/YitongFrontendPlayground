// References
const topicContainer = document.querySelector(".topic-container");
const letterContainer = document.querySelector(".letter-container");
const userInputSection = document.querySelector(".user-input-section");
const canvas = document.querySelector("canvas");
const newGameContainer = document.querySelector(".new-game-container");
const resultTxt = document.getElementById("result-text");
const newGameBtn = document.querySelector(".new-game-button");

// Initial Variables
let topics = {
  fruits: [
    "Apple",
    "Blueberry",
    "Durian",
    "Grape",
    "Mandarin",
    "Mango",
    "Peach",
    "Pineapple",
    "Pomegranate",
    "Strawberry",
    "Watermelon"
  ],
  animals: [
    "Alligator",
    "Chimpanzee",
    "Crocodile",
    "Dolphin",
    "Flamingo",
    "Hippopotamus",
    "Kangaroo",
    "Porcupine",
    "Rhinoceros",
    "Squirrel"
  ],
  countries: [
    "Austria",
    "Belgium",
    "Canada",
    "Denmark",
    "Finland",
    "Germany",
    "Hungary",
    "Ireland",
    "Malaysia",
    "Norway"
  ]
};

let matchCount = 0;
let wrongCount = 0;
let curWord = "";
let maxWrong = 6;

// Display Topic Buttons
const displayTopics = () => {
  // Description
  topicContainer.innerHTML += '<h3>Please Select A Topic</h3>';
  
  // Create buttons
  let buttonDiv = document.createElement("div");
  for (let topic in topics) {
    buttonDiv.innerHTML += '<button class="topic-button" onclick="generateWord(\'' + topic + '\')">' + topic + '</button>';
  }
  topicContainer.appendChild(buttonDiv);
}

// Lock All Buttons
const lockButtons = () => {
  let topicBtns = document.querySelectorAll(".topic-button");
  let letterBtns = document.querySelectorAll(".letter-button");
  
  // Disable all topic buttons
  topicBtns.forEach((topicBtn) => {
    topicBtn.disabled = true;
  });
  
  // Disable all letter buttons
  letterBtns.forEach((letterBtn) => {
    letterBtn.disabled = true;
  });
  
  // Show new game section
  newGameContainer.classList.remove("hide");
}

// Generate a Word from Selected Topic
const generateWord = (selectedTopic) => {
  // Highlight selected topic and disable topic buttons
  let topicBtns = document.querySelectorAll(".topic-button");
  topicBtns.forEach((topicBtn) => {
    if (topicBtn.innerText.toLowerCase() === selectedTopic) {
      topicBtn.classList.add("active");
    }
    topicBtn.disabled = true;
  });
  
  //initially hide letters, clear previous word
  //userInputSection.innerText = "";
  
  // Choose random word from selected topic and convert it to all cap
  let topicArray = topics[selectedTopic];
  curWord = topicArray[Math.floor(Math.random() * topicArray.length)];
  curWord = curWord.toUpperCase();
  
  // Replace every letter with span containing dash and display
  userInputSection.innerHTML = curWord.replace(/./g, '<span class="dashes">_</span>');
  letterContainer.classList.remove("hide");
};

// Start New Game
const startGame = () => {
  // Hide letter buttons and new game section
  letterContainer.classList.add("hide");
  newGameContainer.classList.add("hide");
  
  // Reset game
  topicContainer.innerHTML = "";
  letterContainer.innerHTML = "";
  userInputSection.innerHTML = "";
  matchCount = 0;
  wrongCount = 0;
  
  // Create new letter buttons
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letter-button");
    
    // Add letter to button (Number to ASCII[A-Z])
    button.innerText = String.fromCharCode(i);
    
    // Add click event
    button.addEventListener("click", () => {
      let charArray = curWord.split("");
      let dashes = document.getElementsByClassName("dashes");
      
      if (charArray.includes(button.innerText)) { // Found right letter
        charArray.forEach((char, index) => { // Replace all dashes that have this letter
          if (char === button.innerText) {
            dashes[index].innerText = char;
            matchCount++;
            
            // Check if won
            if (matchCount === charArray.length) {
              resultTxt.innerHTML = `<h2 class='win-text'>You Won!!</h2><p>The word was <span>${curWord}</span>!</p>`;
              lockButtons();
            }
          }
        });
      } else { // Clicked on wrong letter
        wrongCount++;
        drawMan(wrongCount);
        
        // Check if lost
        if (wrongCount === maxWrong) {
          resultTxt.innerHTML = `<h2 class='lose-text'>You Lost!!</h2><p>The word was <span>${curWord}</span>!</p>`;
          lockButtons();
        }
      }
      
      // Disable clicked button
      button.disabled = true;
    });
    
    letterContainer.append(button);
  }
  
  // Display topic buttons and canvas
  displayTopics();
  let { startDraw } = createCanvas();
  startDraw();
};

// Create Canvas
const createCanvas = () => {
  // Initialize canvas context
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;
  
  // Create draw line function
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };
  
  // Draw body parts
  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };
  const body = () => {
    drawLine(70, 40, 70, 80);
  };
  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };
  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };
  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };
  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };
  
  // Start drawing with empty hanging stand
  const startDraw = () => {
    // Clear Canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    // Draw hanging stand
    drawLine(10, 130, 130, 130); // Base
    drawLine(10, 10, 10, 131); // Left
    drawLine(10, 10, 70, 10); // Top
    drawLine(70, 10, 70, 20); // Rope
  };
  
  return { startDraw, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

// Draw Man
const drawMan = (count) => {
  // Get body parts
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = createCanvas();
  
  // Draw body part with index
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      break;
    default:
      break;
  }
};

// ====== New Game ======
newGameBtn.addEventListener("click", startGame);
window.onload = startGame;