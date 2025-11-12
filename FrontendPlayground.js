// ========= Project Links =========
const projectGroups = [
  {
    name: "Time Tools",
    projects: [
      // { name: "Digital Clock", url: "project1/index.html" },
      // { name: "Analog Clock", url: "project2/index.html" },
      // { name: "New Year Countdown", url: "project3/index.html" },
      // { name: "Poomodoro Timer", url: "project4/index.html" },
      // { name: "Mini Calendar", url: "project5/index.html" }
      // { name: "Month Calendar", url: "WorldClock/WorldClock.html" }
    ]
  },
  {
    name: "Study Tools",
    projects: [
      // { name: "Todo List", url: "project1/index.html" },
      // { name: "Note App", url: "project2/index.html" },
      // { name: "Real-time Character Counter", url: "project3/index.html" },
      // { name: "Profile Statistics", url: "project4/index.html" },
    ]
  },
  {
    name: "Calculators & Converters",
    projects: [
      // { name: "Basic Calculator", url: "project1/index.html" },
      // { name: "Age Calculator", url: "project2/index.html" },
      // { name: "Multiplication App", url: "project3/index.html" },
      // { name: "BMI Calculator", url: "project4/index.html" },
      // { name: "Tip Calculator", url: "project5/index.html" }
      // { name: "Loan Calculator", url: "WorldClock/WorldClock.html" }
      // { name: "Temperature Converter", url: "GPACalculator/GPACalculator.html" }
      // { name: "Weight Calculator", url: "TemperatureConverter/TemperatureConverter.html" }
      // { name: "Currency Converter", url: "CurrencyConverter/CurrencyConverter.html" }
    ]
  },
  {
    name: "Generators",
    projects: [
      { name: "Roll Dice Simulator", url: "Projects/Generators/RollDiceSimulator/RollDiceSimulator.html" },
      // { name: "Random Quote Generator", url: "project3/index.html" },
      // { name: "Random Emoji", url: "project4/index.html" },
      // { name: "Random Color Generator", url: "project5/index.html" }
      // { name: "Dad Jokes Generator", url: "WorldClock/WorldClock.html" }
      // { name: "Random Password Generator", url: "GPACalculator/GPACalculator.html" }
    ]
  },
  {
    name: "Mini Games",
    projects: [
      { name: "Quiz Game", url: "Projects/MiniGames/QuizGame/QuizGame.html" },
      { name: "Flags Game", url: "Projects/MiniGames/FlagsGame/FlagsGame.html" },
      { name: "Hangman Game", url: "Projects/MiniGames/HangmanGame/HangmanGame.html" },
      { name: "Balloon Pop", url: "Projects/MiniGames/BalloonPop/BalloonPop.html" },
      { name: "Card Wars", url: "Projects/MiniGames/CardWars/CardWars.html" },
    ]
  },
  {
    name: "Multimedia",
    projects: [
      // { name: "Image Slider", url: "project1/index.html" },
      // { name: "Rotating Image Gallery", url: "project3/index.html" },
      // { name: "Dynamic Random Image", url: "project4/index.html" },
      // { name: "Photo Gallery", url: "project5/index.html" }
      // { name: "Background Image Scroll", url: "WorldClock/WorldClock.html" }
      // { name: "Image Search App", url: "GPACalculator/GPACalculator.html" }
      // { name: "Video Trailer Popup", url: "GPACalculator/GPACalculator.html" }
      // { name: "Anime Pics Generator", url: "GPACalculator/GPACalculator.html" }
    ]
  },
  {
    name: "Dictionaries",
    projects: [
      // { name: "English Dictionary", url: "project1/index.html" },
    ]
  },
  {
    name: "UI Components",
    projects: [
      { name: "Button Ripple Effect", url: "Projects/UIComponents/ButtonRippleEffect/ButtonRippleEffect.html" },
      // { name: "Animated Search Bar", url: "AnimatedSearchBar/AnimatedSearchBar.html" },
      // { name: "Feedback UI", url: "project1/index.html" },
      // { name: "Sticky Navbar", url: "project3/index.html" },
      // { name: "Step Progress Bar", url: "project4/index.html" },
      // { name: "Loading Bar", url: "project5/index.html" }
      // { name: "Dark Mode Toggle", url: "WorldClock/WorldClock.html" }
      // { name: "Blurred Background Popup", url: "GPACalculator/GPACalculator.html" }
      // { name: "Mouse Event", url: "GPACalculator/GPACalculator.html" }
      // { name: "Heart Trail Animation", url: "GPACalculator/GPACalculator.html" }
      // { name: "Auto Text Effect Animation", url: "GPACalculator/GPACalculator.html" }
      // { name: "Double Landing Page", url: "GPACalculator/GPACalculator.html" }
    ]
  },
  {
    name: "Others",
    projects: [
      // { name: "Recipe Book App", url: "project1/index.html" },
      // { name: "Testimonial Slider", url: "project2/index.html" },
    ]
  }
];

// ========= Utils =========
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const STORAGE_KEY = "groupCollapsedState:v1";

const saveCollapsedState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {
    // Ignore: someplace may not support localStorage
  }
};

const loadCollapsedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
};

// Highlight matching parts
function highlight(text, keyword) {
  if (!keyword) return text;
  const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${esc})`, "ig"), "<mark>$1</mark>");
}

// Simple debounce
function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// ========= Render =========
function renderProjects(groups, keyword = "") {
  const container = $("#projectContainer");
  container.innerHTML = "";

  // Load collapsed state
  const collapsedState = loadCollapsedState();

  // Filter out completely empty groups (initially not showing empty groups)
  const visibleGroups = groups
    .map(g => ({ ...g }))
    .filter(g => (g.projects && g.projects.length > 0));

  // No results message
  if (visibleGroups.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No results.";
    empty.style.color = "#666";
    empty.style.padding = "20px";
    container.appendChild(empty);
    return;
  }

  visibleGroups.forEach((group, idx) => {
    const groupId = `${group.name}-${idx}`;
    const section = document.createElement("section");
    section.className = "group";

    // Title + Count Badge + Collapse Button
    const title = document.createElement("h2");
    title.innerHTML = `${group.name} <span style="font-size:.9rem;color:#666;">(${group.projects.length})</span>`;
    title.style.cursor = "pointer";
    title.setAttribute("role", "button");
    title.setAttribute("tabindex", "0");
    title.setAttribute("aria-expanded", String(!collapsedState[groupId]));

    // Button container
    const btnContainer = document.createElement("div");
    btnContainer.className = "group-buttons";

    group.projects.forEach(p => {
      const btn = document.createElement("button");
      // Highlight matching parts
      btn.innerHTML = highlight(p.name, keyword);
      btn.className = "project-btn";
      btn.addEventListener("click", () => window.open(p.url, "_blank"));
      btnContainer.appendChild(btn);
    });

    // Collapse logic
    const setCollapsed = (val) => {
      collapsedState[groupId] = val;
      saveCollapsedState(collapsedState);
      btnContainer.style.display = val ? "none" : "";
      title.setAttribute("aria-expanded", String(!val));
    };
    setCollapsed(!!collapsedState[groupId]);

    const toggle = () => setCollapsed(!collapsedState[groupId]);
    title.addEventListener("click", toggle);
    title.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });

    section.appendChild(title);
    section.appendChild(btnContainer);
    container.appendChild(section);
  });
}

// ========= Search =========
function filterProjects(keyword) {
  if (!keyword) {
    // No keyword → Initial view (but still hiding empty groups)
    renderProjects(projectGroups, "");
    return;
  }

  const lower = keyword.toLowerCase();
  const filtered = projectGroups
    .map(g => ({
      ...g,
      projects: (g.projects || []).filter(p =>
        p.name.toLowerCase().includes(lower)
      )
    }))
    .filter(g => g.projects.length > 0);

  renderProjects(filtered, keyword);
}

// ========= Init =========
renderProjects(projectGroups);

// Bind search (debounce + real-time)
$("#searchInput").addEventListener("input", debounce(e => {
  filterProjects(e.target.value.trim());
}, 150));

// ========= Project Counters =========

// Count total available projects
function updateProjectCounts() {
  // Get total project count
  const total = projectGroups.reduce((sum, group) => sum + (group.projects?.length || 0), 0);
  const totalCountEl = document.getElementById("totalProjectCount");
  if (totalCountEl) totalCountEl.textContent = `Total Projects: ${total}`;

  // Update each group title badge
  const groupTitles = document.querySelectorAll(".group h2");
  groupTitles.forEach(title => {
    const groupName = title.textContent.split("(")[0].trim();
    const group = projectGroups.find(g => g.name === groupName);
    if (group) {
      const count = group.projects?.length || 0;
      title.innerHTML = `${group.name} <span style="font-size:.9rem;color:#666;">(${count})</span>`;
    }
  });
}

// Run after rendering
updateProjectCounts();

// Recalculate when searching/filtering
const originalRenderProjects = renderProjects;
renderProjects = function(...args) {
  originalRenderProjects.apply(this, args);
  updateProjectCounts();
};
