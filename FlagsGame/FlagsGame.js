// Set Initial Variables
const startBtn = document.getElementById("start-button");
const resultDiv = document.getElementById("result");
const ctrlContainer = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".drag-container");
const dropContainer = document.querySelector(".drop-container");
const countries = [
  "belgium","bhutan","brazil","china","cuba","ecuador",
  "georgia","germany","india","iran","myanmar","norway",
  "spain","sri-lanka","sweden","switzerland","united-states","uruguay"
];

let dragObjs;      // NodeList of draggable flag containers
let dropObjs;      // NodeList of country drop targets
let deviceType = "desktop";
let iniX = 0, iniY = 0;
let curElem = "";  // currently touched IMG (for touch devices)
let moveElem = false;
let count = 0;

// Detect Touch Device
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "desktop";
    return false;
  }
};

// Get Random Country
const getRandomValue = () => {
  return countries[Math.floor(Math.random() * countries.length)];
};

// Display Game End
const stopGame = () => {
  ctrlContainer.classList.remove("hide");
  startBtn.classList.remove("hide");
};

// Drag Start
function dragStart(e) {
  if (isTouchDevice()) {
    iniX = e.touches[0].clientX;
    iniY = e.touches[0].clientY;
    moveElem = true;
    // 触屏：记录被拖的 IMG
    curElem = (e.target.tagName === "IMG") ? e.target : e.currentTarget.querySelector("img");
  } else {
    // 桌面：从当前拖拽块中拿到 IMG 的 id
    const img = e.currentTarget.querySelector("img");
    if (img && img.id) {
      e.dataTransfer.setData("text/plain", img.id);
    }
  }
}

// Drag Over (desktop)
function dragOver(e) {
  e.preventDefault();
}

// Touch Movement
const touchMove = (e) => {
  if (moveElem && curElem) {
    e.preventDefault();
    const newX = e.touches[0].clientX;
    const newY = e.touches[0].clientY;
    const holder = curElem.parentElement; // .draggable-image
    holder.style.top  = holder.offsetTop  - (iniY - newY) + "px";
    holder.style.left = holder.offsetLeft - (iniX - newX) + "px";
    iniX = newX;
    iniY = newY;
  }
};

// Drop (both touch & desktop)
const drop = (e) => {
  e.preventDefault();

  if (isTouchDevice()) {
    // 触屏：松手后根据手指位置判断是否落在匹配的格子里
    moveElem = false;
    if (!curElem) return;

    const targetDrop = document.querySelector(`div[countries-id='${curElem.id}']`);
    if (!targetDrop) return;

    const bounds = targetDrop.getBoundingClientRect();
    const within =
      iniX >= bounds.left && iniX <= bounds.right &&
      iniY >= bounds.top  && iniY <= bounds.bottom;

    if (within) {
      targetDrop.classList.add("dropped");
      // 隐藏整个拖拽卡片而不是仅仅 img
      curElem.parentElement.classList.add("hide");
      targetDrop.innerHTML = "";
      targetDrop.insertAdjacentHTML("afterbegin", `<img src="${curElem.id}.png" alt="${curElem.id}">`);
      count++;
    }
  } else {
    // 桌面：用 DataTransfer 里的 img id 和当前格子的 countries-id 对比
    const draggedId = e.dataTransfer.getData("text/plain");
    const dropId = e.currentTarget.getAttribute("countries-id"); // 用 currentTarget 更稳
    if (draggedId && dropId && draggedId === dropId) {
      const draggedImg = document.getElementById(draggedId);
      if (!draggedImg) return;
      const card = draggedImg.closest(".draggable-image");
      if (!card) return;

      e.currentTarget.classList.add("dropped");
      card.classList.add("hide");
      card.setAttribute("draggable", "false");

      e.currentTarget.innerHTML = "";
      e.currentTarget.insertAdjacentHTML("afterbegin", `<img src="${draggedId}.png" alt="${draggedId}">`);
      count++;
    }
  }

  // Check Win Condition
  if (count === 3) {
    resultDiv.innerText = "Congratulations! You completed the game!";
    stopGame();
  }
};

// Create flags and countries
const createGameElements = () => {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  const chosen = [];

  while (chosen.length < 3) {
    const v = getRandomValue();
    if (!chosen.includes(v)) chosen.push(v);
  }

  // 生成旗帜（可拖拽卡片）
  for (const c of chosen) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("draggable-image");
    flagDiv.setAttribute("draggable", "true");
    if (isTouchDevice()) {
      flagDiv.style.position = "absolute";
    }
    flagDiv.innerHTML = `<img src="${c}.png" id="${c}" alt="${c}">`;
    dragContainer.appendChild(flagDiv);
  }

  // 打乱顺序后生成国家格子
  chosen.sort(() => 0.5 - Math.random());
  for (const c of chosen) {
    const wrap = document.createElement("div");
    wrap.innerHTML = `<div class="countries" countries-id="${c}">${c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}</div>`;
    dropContainer.appendChild(wrap);
  }
};

// Start Game
startBtn.addEventListener("click", async () => {
  curElem = "";
  ctrlContainer.classList.add("hide");
  startBtn.classList.add("hide");
  await createGameElements();
  count = 0;

  // 重新收集节点并绑定事件
  dropObjs = document.querySelectorAll(".countries");
  dragObjs = document.querySelectorAll(".draggable-image");

  dragObjs.forEach((el) => {
    el.addEventListener("dragstart", dragStart);
    el.addEventListener("touchstart", dragStart, { passive: true });
    el.addEventListener("touchend", drop);
    el.addEventListener("touchmove", touchMove, { passive: false });
  });

  dropObjs.forEach((el) => {
    el.addEventListener("dragover", dragOver);
    el.addEventListener("drop", drop);
  });
});
