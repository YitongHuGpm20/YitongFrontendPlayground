// Set Initial Variables
const startBtn = document.getElementById("start-button");
const resultDiv = document.getElementById("result");
const ctrlContainer = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".drag-container");
const dropContainer = document.querySelector(".drop-container");
const countries = ["belgium", "bhutan", "brazil", "china", "cuba", "ecuador", "georgia", "germany", "india", "iran", "myanmar", "norway", "spain", "sri-lanka", "sweden", "switzerland", "united-states", "uruguay"];

let dragObjs;
let dropObjs;
let deviceType = "desktop";
let iniX = 0, iniY = 0;
let curElem = "";
let moveElem = false;
let count = 0;

// Detect Touch Device
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  }
  catch (e) {
    deviceType = "desktop";
    return false;
  }
}

// Get Random Number
const getRandomValue = () => {
    return countries[Math.floor(Math.random() * countries.length)];
}

// Display Game End
const stopGame = () => {
    ctrlContainer.classList.remove("hide");
    startBtn.classList.remove("hide");
}

// Drag Start
function dragStart(e) {
    if(isTouchDevice()) {
        iniX = e.touches[0].clientX;
        iniY = e.touches[0].clientY;
        moveElem = true;
        curElem = e.target;
    } else {
        e.dataTransfer.setData("text", e.target.id);
    }
}

// Drag Over
function dragOver(e) {
    e.preventDefault();
}

// Touch Movement
const touchMove = (e) => {
    if (moveElem) {
        e.preventDefault();
        let newX = e.touches[0].clientX;
        let newY = e.touches[0].clientY;
        let curSelectedElem = document.getElementById(e.target.id);
        curSelectedElem.parentElement.style.top = curSelectedElem.parentElement.offsetTop - (iniY - newY) + "px";
        curSelectedElem.parentElement.style.left = curSelectedElem.parentElement.offsetLeft - (iniX - newX) + "px";
        iniX = newX;
        iniY = newY;
    }
}

// Drop
const drop = (e) => {
    e.preventDefault();
    
    if(isTouchDevice()) {
        moveElem = false;
        const curDrop = document.querySelector(`div[countries-id='${e.target.id}']`);
        const curDropBound = curDrop.getBoundingClientRect();
        if (iniX >= curDropBound.left && iniX <= curDropBound.right && iniY >= curDropBound.top && iniY <= curDropBound.bottom) {
            curDrop.classList.add("dropped");
            curElem.classList.add("hide");
            curDrop.innerHTML = '';
            curDrop.insertAdjacentHTML("afterbegin", `<img src="${curElem.id}.png">`);
            count++;
        } else {
            const dragElemData = e.dataTransfer.getData("text");
            const dropElemData = e.target.getAttribute("countries-id");
            if (dragElemData === dropElemData) {
                const dragElem = document.getElementById(dragElemData);
                e.target.classList.add("dropped");
                dragElem.classList.add("hide");
                dragElem.setAttribute("draggable", "false");
                e.target.innerHTML = '';
                e.target.insertAdjacentHTML("afterbegin", `<img src="${dragElemData}.png">`);
                count++;
            }
        }
    }

    // Check Win Condition
    if (count == 3) {
        resultDiv.innerText = 'Congratulations! You completed the game!';
        stopGame();
    }
}

// Create flags and countries
const createGameElements = () => {
    dragContainer.innerHTML = '';
    dropContainer.innerHTML = '';
    let randomCountries = [];

    for (let i = 1; i <= 3; i++) {
        let randomValue = getRandomValue();
        if (!randomCountries.includes(randomValue)) {
            randomCountries.push(randomValue);
        } else {
            i--;
        }
    }

    for (let i of randomCountries) {
        const flagDiv = document.createElement("div");
        flagDiv.classList.add("draggable-image");
        flagDiv.setAttribute("draggable", true);
        if (isTouchDevice()) {
            flagDiv.style.position = "absolute";
        }
        flagDiv.innerHTML = `<img src="${i}.png" id="${i}">`;
        dragContainer.appendChild(flagDiv);
    }

    randomCountries = randomCountries.sort(() => 0.5 - Math.random());
    for (let i of randomCountries) {
        const countryDiv = document.createElement("div");
        countryDiv.innerHTML = `<div class='countries' countries-id='${i}'>${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}</div>`;
        dropContainer.appendChild(countryDiv);
    }
}

// Start Game
startBtn.addEventListener("click", (startGame = async () => {
    curElem = "";
    ctrlContainer.classList.add("hide");
    startBtn.classList.add("hide");
    await createGameElements();
    count = 0;
    
    dropContainer = document.querySelectorAll(".countries");
    dragObjs = document.querySelectorAll(".draggable-image");
    dragObjs.forEach((elem) => {
        elem.addEventListener("dragstart", dragStart);
        elem.addEventListener("touchstart", dragStart);
        elem.addEventListener("touchend", drop);
        elem.addEventListener("touchmove", touchMove);
    })
    dropContainer.forEach((elem) => {
        elem.addEventListener("dragover", dragOver);
        elem.addEventListener("drop", drop);
    })
}))