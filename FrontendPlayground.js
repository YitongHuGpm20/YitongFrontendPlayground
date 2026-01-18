//#region ========= Utils =========
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

//#endregion

//#region ========= Render =========
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

    // Title element
    const title = document.createElement("h2");
    title.style.cursor = "pointer";
    title.setAttribute("role", "button");
    title.setAttribute("tabindex", "0");
    title.setAttribute("aria-expanded", String(!collapsedState[groupId]));

    // Left: text + count
    const left = document.createElement("span");
    left.className = "group-title-left";
    left.innerHTML = `
      <span class="group-title-text">${group.name}</span>
      <span class="group-count" style="font-size:.9rem;color:#666;">(${group.projects.length})</span>
    `;

    // Right: indicator
    const indicator = document.createElement("span");
    indicator.className = "collapse-indicator";
    indicator.setAttribute("aria-hidden", "true");
    indicator.textContent = "›";

    title.appendChild(left);
    title.appendChild(indicator);

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

//#endregion

//#region ========= Search =========
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

//#endregion

//#region ========= Init =========
renderProjects(projectGroups);

// Bind search (debounce + real-time)
$("#searchInput").addEventListener("input", debounce(e => {
  filterProjects(e.target.value.trim());
}, 150));

//#endregion

//#region ========= Project Counters =========

// Count total available projects
function updateProjectCounts() {
  // Get total project count
  const total = projectGroups.reduce((sum, group) => sum + (group.projects?.length || 0), 0);
  const totalCountEl = document.getElementById("totalProjectCount");
  if (totalCountEl) totalCountEl.textContent = `Total Projects: ${total}`;

  // Update each group title badge (do NOT overwrite whole title HTML)
  const groupTitles = document.querySelectorAll(".group h2");
  groupTitles.forEach(title => {
    const nameEl = title.querySelector(".group-title-text");
    const countEl = title.querySelector(".group-count");
    if (!nameEl || !countEl) return;

    const groupName = nameEl.textContent.trim();
    const group = projectGroups.find(g => g.name === groupName);
    if (group) {
      const count = group.projects?.length || 0;
      countEl.textContent = `(${count})`;
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

//#endregion