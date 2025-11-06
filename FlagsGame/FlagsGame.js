// ====== Get DOM Elements ======
const startBtn = document.getElementById("start-button");
const resultTxt = document.getElementById("result-text");
const menuContainer = document.querySelector(".menu-container");
const gameContainer = document.querySelector(".game-container");
const flagContainer = document.querySelector(".flag-container");
const slotContainer = document.querySelector(".slot-container");

// ====== Game Data ======
const countries = [
  "belgium","bhutan","brazil","china","cuba","ecuador",
  "georgia","germany","india","iran","myanmar","norway",
  "spain","sri-lanka","sweden","switzerland","united-states","uruguay"
];

let flags;
let slots;
let matchCount = 0;

// ====== Helper ======
const getRandomCountry = () => {
  return countries[Math.floor(Math.random() * countries.length)];
};

const stopGame = () => {
  gameContainer.classList.add("hide");
  menuContainer.classList.remove("hide");
  startBtn.classList.remove("hide");
};

// ====== Drag & Drop ======
function dragStart(event) {
  // Save image id to dataTransfer
  const img = event.currentTarget.querySelector("img");
  if (img && img.id) {
    event.dataTransfer.setData("text/plain", img.id);
    // 可选提升体验：event.dataTransfer.effectAllowed = "move";
  }
}

// Stop dragging so can start dropping
function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  // Ignore filled slots
  if (event.currentTarget.classList.contains("dropped")) return;

  // Compare dragged flag's id and this slot's id
  const flagId = event.dataTransfer.getData("text/plain");
  const slotId = event.currentTarget.getAttribute("country-id");
  if (flagId && slotId && flagId === slotId) { // Once the ids matched
    // Get flag
    const flagImg = document.getElementById(flagId);
    if (!flagImg) return;
    const card = flagImg.closest(".flag-card");
    if (!card) return;

    // Mark this slot as filled
    event.currentTarget.classList.add("dropped");
    
    // Lock used flag card
    card.classList.add("hide");
    card.setAttribute("draggable", "false");

    // Add flag image to slot
    event.currentTarget.innerHTML = "";
    event.currentTarget.insertAdjacentHTML(
      "afterbegin",
      `<img src="Flag Images/${flagId}.png" alt="${flagId}">`
    );

    // Check game process
    matchCount++;
    if (matchCount === 3) {
      resultTxt.innerText = "Congratulations! You completed the game!";
      stopGame();
    }
  }
}

// ====== Build Flags & Slots ======
function createGameElements() {
  flagContainer.innerHTML = "";
  slotContainer.innerHTML = "";
  const chosen = [];

  // Choose 3 unique countries
  while (chosen.length < 3) {
    const country = getRandomCountry();
    if (!chosen.includes(country)) chosen.push(country);
  }

  // Create flags
  for (const c of chosen) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("flag-card");
    flagDiv.setAttribute("draggable", "true");
    flagDiv.innerHTML = `<img src="Flag Images/${c}.png" id="${c}" alt="${c}">`;
    flagContainer.appendChild(flagDiv);
  }

  // Create slots with random sequence
  chosen.sort(() => 0.5 - Math.random());
  for (const c of chosen) {
    const slotDiv = document.createElement("div");
    // Set first letter to cap and replace - with space
    const pretty = c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ");
    slotDiv.innerHTML = `
      <div class="country-slot" country-id="${c}">
        ${pretty}
      </div>`;
    slotContainer.appendChild(slotDiv);
  }
}

// ====== Start Game Button ======
startBtn.addEventListener("click", () => {
  // Hide menu and start button
  menuContainer.classList.add("hide");
  startBtn.classList.add("hide");
  gameContainer.classList.remove("hide");

  // Reset UI text & counters
  resultTxt.innerText = "";
  matchCount = 0;

  // Start a new game
  createGameElements();

  flags = document.querySelectorAll(".flag-card");
  slots = document.querySelectorAll(".country-slot");

  flags.forEach((flag) => {
    flag.addEventListener("dragstart", dragStart);
  });

  slots.forEach((slot) => {
    slot.addEventListener("dragover", dragOver);
    slot.addEventListener("drop", drop);
  });
});
