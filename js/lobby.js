// Study Rooms Lobby script
// Handles filtering rooms by vibe, searching, and opening room links with scrapbook collage aesthetic

// Helper to return SVG icons for vibes
function getVibeIcon(iconName) {
  switch (iconName) {
    case 'coffee':
      return `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path></svg>`;
    case 'book':
      return `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`;
    case 'rain':
      return `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path><line x1="8" y1="20" x2="8" y2="22"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="16" y1="20" x2="16" y2="22"></line></svg>`;
    case 'zap':
      return `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    case 'code':
      return `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
    case 'flame':
      return `<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`;
    default:
      return '';
  }
}

// Sample list of study rooms with SVG icon mappings
const STUDY_ROOMS = [
  {
    id: "lofi-cafe",
    name: "Lo-Fi Coffee Shop",
    vibe: "cozy",
    vibeLabel: "Cozy Cafe",
    icon: "coffee",
    usersStudying: 26,
    description: "Gentle rain sounds, espresso machine hum, and warm lo-fi background beats.",
    tags: ["Lo-Fi Beats", "Casual Study", "Warm Light"],
    tape: "tape-honey"
  },
  {
    id: "night-library",
    name: "Midnight Oak Library",
    vibe: "cozy",
    vibeLabel: "Quiet Reading",
    icon: "book",
    usersStudying: 34,
    description: "Quiet green desk lamps, soft pages turning, and cozy ambient silence.",
    tags: ["Reading", "No Distractions", "Late Night"],
    tape: "tape-sage"
  },
  {
    id: "rainy-cabin",
    name: "Rainy Mountain Cabin",
    vibe: "cozy",
    vibeLabel: "Rainy Mood",
    icon: "rain",
    usersStudying: 19,
    description: "Soft rain outside and fireplace crackles. Great for reading and essay drafting.",
    tags: ["Rain Sounds", "Essay Writing", "Calm"],
    tape: "tape-lavender"
  },
  {
    id: "deep-work-cave",
    name: "Deep Work Silent Cave",
    vibe: "focus",
    vibeLabel: "Intense Focus",
    icon: "zap",
    usersStudying: 42,
    description: "Strictly silent, cameras optional, pitch black layout designed for 50-minute sprints.",
    tags: ["50m Sprint", "Camera Off", "Silence"],
    tape: "tape-sky"
  },
  {
    id: "code-math-lab",
    name: "Terminal Coding & Math Lab",
    vibe: "focus",
    vibeLabel: "Code & Drills",
    icon: "code",
    usersStudying: 29,
    description: "Monochrome minimal room for computer science problem sets and math drills.",
    tags: ["Coding", "Problem Sets", "Monochrome"],
    tape: "tape-rose"
  },
  {
    id: "exam-cram-sprint",
    name: "Finals Sprint Zone",
    vibe: "focus",
    vibeLabel: "Sprint Zone",
    icon: "flame",
    usersStudying: 38,
    description: "High-intensity study sessions with strict Pomodoro intervals and accountability.",
    tags: ["Pomodoro 25/5", "Exam Prep", "High Energy"],
    tape: "tape-honey"
  }
];

let activeVibe = "all";
let searchQuery = "";

// Helper to escape HTML safely
function safeHtml(str) {
  if (typeof window.escapeHtml === 'function') {
    return window.escapeHtml(str);
  }
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener("DOMContentLoaded", () => {
  // Personalized greeting if user is logged in
  const greetingEl = document.getElementById("lobby-user-greeting");
  if (greetingEl) {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user && user.name) {
      greetingEl.innerHTML = `Welcome back, <strong>${safeHtml(user.name)}</strong>! <span class="hand-note" style="font-size: 1.15rem; margin-left: 6px;">Pick a table &amp; let's get to work &rarr;</span>`;
    } else {
      greetingEl.textContent = "Choose a study room below to pin yourself to a desk.";
    }
  }

  // Vibe filter button clicks
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      activeVibe = btn.getAttribute("data-vibe");
      renderRooms();
    });
  });

  // Real-time search filter
  const searchInput = document.getElementById("lobby-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderRooms();
    });
  }

  renderRooms();
});

// Render cards into the rooms grid with scrapbook features
function renderRooms() {
  const container = document.getElementById("rooms-grid-container");
  if (!container) return;

  const matches = STUDY_ROOMS.filter(room => {
    const matchesVibe = (activeVibe === "all") || (room.vibe === activeVibe);
    const matchesText = 
      room.name.toLowerCase().includes(searchQuery) ||
      room.description.toLowerCase().includes(searchQuery) ||
      room.tags.some(tag => tag.toLowerCase().includes(searchQuery));

    return matchesVibe && matchesText;
  });

  if (matches.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--text-muted); background: var(--bg-paper); border-radius: 12px; border: 2px dashed var(--border-color);">
        <p style="font-family: var(--font-hand); font-size: 1.6rem; color: var(--accent-primary); margin-bottom: 6px;">No scrapbook rooms found!</p>
        <p style="font-size: 0.95rem;">Try clearing the search box or selecting "All Desks".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = matches.map((room) => {
    const cardTheme = room.vibe === "cozy" ? "card-cozy" : "card-focus";
    const roomUrl = `room.html?room=${encodeURIComponent(room.name)}&theme=${room.vibe}`;
    const tapeClass = room.tape || 'tape-rose';
    const iconHtml = getVibeIcon(room.icon);

    return `
      <a href="${roomUrl}" class="room-card ${cardTheme}">
        <!-- Scrapbook washi tape at top -->
        <span class="washi-tape ${tapeClass}"></span>

        <div class="room-card-header">
          <span class="room-vibe-tag" style="display: inline-flex; align-items: center; gap: 5px;">
            ${iconHtml}
            <span>${room.vibeLabel}</span>
          </span>
          <span class="room-users-count">
            <span class="pulse-dot"></span>
            ${room.usersStudying} studying
          </span>
        </div>

        <h2 class="room-card-title">${safeHtml(room.name)}</h2>
        <p class="room-card-desc">${safeHtml(room.description)}</p>

        <div class="room-card-footer">
          <div class="room-tags">
            ${room.tags.map(tag => `<span class="room-tag">#${safeHtml(tag)}</span>`).join('')}
          </div>
          <span class="room-join-link">Join Desk &rarr;</span>
        </div>
      </a>
    `;
  }).join('');
}
