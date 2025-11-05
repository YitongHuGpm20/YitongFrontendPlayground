// ====== 1. 获取基础 DOM 元素 ======
const startBtn = document.getElementById("start-button");
const resultDiv = document.getElementById("result");
const ctrlContainer = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".drag-container");
const dropContainer = document.querySelector(".drop-container");

// ====== 2. 游戏数据与状态 ======
const countries = [
  "belgium","bhutan","brazil","china","cuba","ecuador",
  "georgia","germany","india","iran","myanmar","norway",
  "spain","sri-lanka","sweden","switzerland","united-states","uruguay"
];

let dragObjs;  // 左边的可拖拽旗帜卡片
let dropObjs;  // 右边的目标格子
let count = 0; // 成功配对数

// ====== 3. 工具函数 ======
const getRandomValue = () => {
  return countries[Math.floor(Math.random() * countries.length)];
};

const stopGame = () => {
  ctrlContainer.classList.remove("hide");
  startBtn.classList.remove("hide");
};

// ====== 4. 拖拽逻辑（仅桌面） ======
function dragStart(e) {
  // 把被拖动的图片 ID 存入 dataTransfer
  const img = e.currentTarget.querySelector("img");
  if (img && img.id) {
    e.dataTransfer.setData("text/plain", img.id);
  }
}

// 必须阻止默认事件，否则无法触发 drop
function dragOver(e) {
  e.preventDefault();
}

// 放置逻辑
function drop(e) {
  e.preventDefault();

  const draggedId = e.dataTransfer.getData("text/plain");
  const dropId = e.currentTarget.getAttribute("countries-id");

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

    if (count === 3) {
      resultDiv.innerText = "Congratulations! You completed the game!";
      stopGame();
    }
  }
}

// ====== 5. 生成旗帜和国家格子 ======
function createGameElements() {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  const chosen = [];

  while (chosen.length < 3) {
    const v = getRandomValue();
    if (!chosen.includes(v)) chosen.push(v);
  }

  // 左侧：旗帜
  for (const c of chosen) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("draggable-image");
    flagDiv.setAttribute("draggable", "true");
    flagDiv.innerHTML = `<img src="${c}.png" id="${c}" alt="${c}">`;
    dragContainer.appendChild(flagDiv);
  }

  // 右侧：国家文字（顺序随机）
  chosen.sort(() => 0.5 - Math.random());
  for (const c of chosen) {
    const wrap = document.createElement("div");
    wrap.innerHTML =
      `<div class="countries" countries-id="${c}">
        ${c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
       </div>`;
    dropContainer.appendChild(wrap);
  }
}

// ====== 6. 开始按钮逻辑 ======
startBtn.addEventListener("click", () => {
  ctrlContainer.classList.add("hide");
  startBtn.classList.add("hide");
  createGameElements();
  count = 0;

  dropObjs = document.querySelectorAll(".countries");
  dragObjs = document.querySelectorAll(".draggable-image");

  dragObjs.forEach((el) => {
    el.addEventListener("dragstart", dragStart);
  });

  dropObjs.forEach((el) => {
    el.addEventListener("dragover", dragOver);
    el.addEventListener("drop", drop);
  });
});
