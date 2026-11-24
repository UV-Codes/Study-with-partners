/**
 * Study Together - Theme Controller (Scrapbook Day / Night Mode)
 * Manages the dark/light journal theme toggle and persists preference in localStorage.
 */

(function () {
  const THEME_STORAGE_KEY = 'scrapbook_theme';

  // Get preferred or saved theme (defaults to 'light' for classic craft scrapbook)
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn('Could not read theme from localStorage:', e);
    }
    return 'light';
  }

  // Apply theme to document
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // storage unavailable
    }
    updateThemeToggleButtons(theme);
  }

  // Update button icons and text across any theme toggle buttons on the page
  function updateThemeToggleButtons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle-btn');
    buttons.forEach((btn) => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Scrapbook' : 'Switch to Dark Scrapbook');
      btn.setAttribute('title', isDark ? 'Switch to Light Scrapbook (Day Journal)' : 'Switch to Dark Scrapbook (Night Journal)');
      
      const iconSpan = btn.querySelector('.theme-toggle-icon');
      const textSpan = btn.querySelector('.theme-toggle-text');
      
      if (iconSpan) {
        iconSpan.innerHTML = isDark 
          ? `<svg class="theme-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
             </svg>`
          : `<svg class="theme-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
             </svg>`;
      }
      if (textSpan) {
        textSpan.textContent = isDark ? 'Day Paper' : 'Night Journal';
      }
    });
  }

  // Toggle theme handler
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // Expose toggle to global scope
  window.toggleTheme = toggleTheme;

  // Apply immediately upon script execution to prevent flash
  const initialTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // Wire up event listeners after DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    updateThemeToggleButtons(document.documentElement.getAttribute('data-theme') || initialTheme);

    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });
  });
})();
