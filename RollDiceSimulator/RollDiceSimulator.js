const buttonEl = document.getElementById("roll-button");
const diceEl = document.getElementById("dice");
const rollHistoryEl = document.getElementById("roll-history");

let historyList = [];

function rollDice(){
    // Generate a random number between 1 and 6
    const rollResult = Math.floor(Math.random() * 6) + 1;

    // Map the number to the corresponding Unicode character for dice faces
    const diceFace = getDiceFace(rollResult);

    // Update the dice display
    diceEl.innerHTML = diceFace;

    // Display result in console
    console.log(rollResult + " " + diceFace);

    // Update history
    historyList.push(rollResult);
    updateRollHistory();
}

// Function to map number to dice face Unicode character
function getDiceFace(number){ 
    switch(number){
        case 1: return "&#9856;"; // ⚀
        case 2: return "&#9857;"; // ⚁
        case 3: return "&#9858;"; // ⚂
        case 4: return "&#9859;"; // ⚃
        case 5: return "&#9860;"; // ⚄
        case 6: return "&#9861;"; // ⚅
    }
}

function updateRollHistory(){
    rollHistoryEl.innerHTML = ""; // Clear existing history
    for(let i = 0; i < historyList.length; i++){
        const listItem = document.createElement("li");
        listItem.innerHTML = `Roll ${i + 1}: <span>${getDiceFace(historyList[i])}</span>`;
        rollHistoryEl.appendChild(listItem);
    }
}

buttonEl.addEventListener("click", () => {
    console.log("Button clicked");
    
    // Run rolling animation
    diceEl.classList.add("roll-animation");
    
    // Clean up animation and roll dice after 1 second
    setTimeout(() => {
        diceEl.classList.remove("roll-animation");
        rollDice();
    }, 1000);
});