// Authentication handling for Study Together
// Uses browser localStorage to simulate a login session without a backend server

const AUTH_STORAGE_KEY = 'study_together_user';

// Read current user session from localStorage
function getCurrentUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error("Failed to read user session:", err);
    return null;
  }
}

// Save active user session
function setCurrentUser(userData) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  } catch (err) {
    console.error("Failed to save user session:", err);
  }
}

// Log out and return to landing page
function logoutUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = 'index.html';
}

// Fake login for testing
function fakeLogin(email, password) {
  if (!email || !password) return false;

  // Use the username portion of the email as the display name
  const rawName = email.split('@')[0];
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const user = {
    name: displayName,
    email: email.trim().toLowerCase(),
    loginTime: new Date().toLocaleTimeString()
  };

  setCurrentUser(user);
  return true;
}

// Fake registration
function fakeSignup(name, email, password) {
  if (!name || !email || !password) return false;

  const user = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    loginTime: new Date().toLocaleTimeString()
  };

  setCurrentUser(user);
  return true;
}

// Updates the navigation bar if the user is logged in
function updateNavigationAuthUI() {
  const container = document.getElementById('nav-auth-container');
  if (!container) return;

  const user = getCurrentUser();

  if (user) {
    container.innerHTML = `
      <span style="color: var(--text-muted); font-family: var(--font-hand); font-size: 1.25rem;">
        Hi, <strong style="color: var(--text-main);">${escapeHtml(user.name)}</strong>!
      </span>
      <button id="nav-logout-btn" class="btn btn-secondary btn-sm" style="margin-left: 8px;">
        Log Out
      </button>
    `;

    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
      });
    }
  } else {
    container.innerHTML = `
      <a href="login.html" class="btn btn-primary btn-sm">Log In</a>
    `;
  }
}

// Small helper to prevent HTML injection in user names
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', updateNavigationAuthUI);
