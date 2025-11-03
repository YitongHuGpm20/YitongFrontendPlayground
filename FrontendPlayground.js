// Project Links
const projects = [
  //{ name: "Weather App", url: "project1/index.html" },
  //{ name: "Todo List", url: "project2/index.html" },
  //{ name: "Color Picker", url: "project3/index.html" },
  //{ name: "Typing Game", url: "project4/index.html" },
  //{ name: "Quote Generator", url: "project5/index.html" }
  { name: "Roll Dice Simulator", url: "RollDiceSimulator/RollDiceSimulator.html" }
];

// Dynamically generate project buttons
const listContainer = document.getElementById("projectList");
projects.forEach(p => {
  const btn = document.createElement("button");
  btn.textContent = p.name;
  btn.className = "project-btn";
  btn.onclick = () => window.open(p.url, "_blank");
  listContainer.appendChild(btn);
});

// Search Functionality
document.getElementById("searchInput").addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  const buttons = document.getElementsByClassName("project-btn");
  for (let btn of buttons) {
    btn.style.display = btn.textContent.toLowerCase().includes(keyword)
      ? "inline-block"
      : "none";
  }
});