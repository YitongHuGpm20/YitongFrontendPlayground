// ==== References ====
const playerImg = document.getElementById("player-card");
const computerImg = document.getElementById("computer-card");
const resultText = document.getElementById("result-text");

// ==== Variables ====
let deckId = "";
let playerScore = 0;
let computerScore = 0;

//Initialize Deck
fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
  .then((res) => res.json())
  .then((data) => {
    deckId = data.deck_id;
  });

// Translate letters to numbers
const valueMap = {
  ACE: 14,
  KING: 13,
  QUEEN: 12,
  JACK: 11,
};

function getCardValue(value) {
  return valueMap[value] || parseInt(value);
}

function drawCards() {
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then((res) => res.json())
    .then((data) => {
      // Check if drew all the cards
      if (data.remaining <= 0) {
        document.getElementById("result-text").textContent = "No cards left! Please refresh.";
        document.querySelector("button").disabled = true;
        return;
      }

      // Draw two cards
      const playerCard = data.cards[0];
      const computerCard = data.cards[1];
      
      //Update card Images
      playerImg.src = playerCard.image;
      computerImg.src = computerCard.image;

      //Wait for both the images to load before calculating score
      Promise.all([
        new Promise((resolve) => (playerImg.onload = resolve)),
        new Promise((resolve) => (computerImg.onload = resolve)),
      ]).then(() => {
        const playerVal = getCardValue(playerCard.value);
        const computerVal = getCardValue(computerCard.value);

        // Get result
        if (playerVal > computerVal) {
          playerScore += 1;
          resultText.textContent = "You Win This Round 🎉";
        } else if (playerVal < computerVal) {
          computerScore += 1;
          resultText.textContent = "Computer Wins This Round😔";
        } else {
          resultText.textContent = "It's a tie! No Points Awarded";
        }
        
        // Print scores
        document.getElementById("player-score").textContent = playerScore;
        document.getElementById("computer-score").textContent = computerScore;
      });
    });
}