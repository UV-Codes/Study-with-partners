// Study Room Controller
// Handles URL parameters, Jitsi video embed, Pomodoro timer, and To-Do list

// Read room name and vibe from the URL query string
const params = new URLSearchParams(window.location.search);
const roomName = params.get('room') || 'Study Room';
const roomTheme = params.get('theme') || 'cozy';

// Set theme class on body (theme-cozy or theme-focus)
if (roomTheme === 'focus') {
  document.body.classList.add('theme-focus');
} else {
  document.body.classList.add('theme-cozy');
}

// Safe HTML escaping helper
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

document.addEventListener('DOMContentLoaded', () => {
  // Update header and page title
  const titleEl = document.getElementById('current-room-name');
  if (titleEl) {
    titleEl.textContent = roomName;
  }
  document.title = `${roomName} | Study Together`;

  // Update vibe badge text with SVG icon
  const badgeEl = document.getElementById('room-vibe-badge');
  if (badgeEl) {
    const isFocus = roomTheme === 'focus';
    const iconSvg = isFocus 
      ? '<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'
      : '<svg class="icon-svg icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path></svg>';
    badgeEl.innerHTML = `${iconSvg} ${isFocus ? 'Intense Focus' : 'Cozy Vibe'}`;
    badgeEl.className = 'stamp-badge ' + (isFocus ? 'stamp-primary' : 'stamp-honey');
  }

  // Random realistic active participant count
  const countEl = document.getElementById('room-participant-count');
  if (countEl) {
    const count = Math.floor(Math.random() * 12) + 8;
    countEl.textContent = `${count} studying now`;
  }

  // Load video, timer, and task manager
  setupJitsiVideo();
  setupPomodoroTimer();
  setupTodoList();

  // Leave room button returns to lobby
  const leaveBtn = document.getElementById('leave-room-btn');
  if (leaveBtn) {
    leaveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'lobby.html';
    });
  }
});

// Setup Jitsi Meet video inside the iframe
function setupJitsiVideo() {
  const iframe = document.getElementById('jitsi-iframe');
  if (!iframe) return;

  // Make a clean alphanumeric room name for Jitsi
  const cleanRoomName = 'StudyTogether_' + roomName.replace(/[^a-zA-Z0-9]/g, '');

  // Mute audio and video initially so users can join quietly without surprise
  iframe.src = `https://meet.jit.si/${cleanRoomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=true&config.startWithVideoMuted=true`;
}

// Pomodoro Timer Logic
let timerId = null;
let isRunning = false;
let currentMode = 'focus'; // focus, shortBreak, or longBreak

const DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

let timeLeft = DURATIONS.focus;

function setupPomodoroTimer() {
  const startBtn = document.getElementById('timer-start-pause-btn');
  const resetBtn = document.getElementById('timer-reset-btn');
  const modeBtns = document.querySelectorAll('.timer-mode-btn');

  updateTimerDisplay();

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (isRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentMode = btn.getAttribute('data-mode');
      resetTimer();
    });
  });
}

function startTimer() {
  isRunning = true;
  const startBtn = document.getElementById('timer-start-pause-btn');
  if (startBtn) {
    startBtn.textContent = 'Pause';
    startBtn.className = 'btn btn-secondary';
  }

  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      isRunning = false;
      playBeep();
      alert(`Pomodoro session ended! Time for a ${currentMode === 'focus' ? 'break' : 'focus session'}.`);
      resetTimer();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerId);
  const startBtn = document.getElementById('timer-start-pause-btn');
  if (startBtn) {
    startBtn.textContent = 'Resume';
    startBtn.className = 'btn btn-primary';
  }
}

function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  timeLeft = DURATIONS[currentMode];
  updateTimerDisplay();

  const startBtn = document.getElementById('timer-start-pause-btn');
  if (startBtn) {
    startBtn.textContent = 'Start';
    startBtn.className = 'btn btn-primary';
  }
}

function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (!display) return;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  display.textContent = formatted;
  document.title = `(${formatted}) ${roomName} | Study Together`;
}

// Gentle notification beep using browser Web Audio API
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch (err) {
    console.log("Audio alert skipped");
  }
}

// To-Do List with localStorage persistence
const TASK_KEY = 'study_tasks';
let tasks = getSavedTasks();

function getSavedTasks() {
  try {
    const data = localStorage.getItem(TASK_KEY);
    return data ? JSON.parse(data) : [
      { id: 1, text: "Read 10 textbook pages", done: false },
      { id: 2, text: "Finish assignment problem set", done: false }
    ];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn("Could not save tasks:", e);
  }
}

function setupTodoList() {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const clearBtn = document.getElementById('todo-clear-completed');

  renderTasks();

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;

      tasks.push({
        id: Date.now(),
        text: val,
        done: false
      });

      saveTasks();
      renderTasks();
      input.value = '';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => !t.done);
      saveTasks();
      renderTasks();
    });
  }
}

function renderTasks() {
  const list = document.getElementById('todo-list-container');
  if (!list) return;

  if (tasks.length === 0) {
    list.innerHTML = `<li class="todo-empty-msg">No tasks yet. Add a study goal above!</li>`;
    return;
  }

  list.innerHTML = tasks.map(task => `
    <li class="todo-item ${task.done ? 'completed' : ''}" data-id="${task.id}">
      <label>
        <input 
          type="checkbox" 
          ${task.done ? 'checked' : ''} 
          onchange="toggleTask('${task.id}')"
        >
        <span>${safeHtml(task.text)}</span>
      </label>
      <button 
        type="button" 
        class="todo-delete-btn" 
        onclick="removeTask('${task.id}')"
        title="Remove"
      >&times;</button>
    </li>
  `).join('');
}

window.toggleTask = function(id) {
  const item = tasks.find(t => String(t.id) === String(id));
  if (item) {
    item.done = !item.done;
    saveTasks();
    renderTasks();
  }
};

window.removeTask = function(id) {
  tasks = tasks.filter(t => String(t.id) !== String(id));
  saveTasks();
  renderTasks();
};
