# Study Together - Virtual Co-Working Scrapbook

An aesthetic, beginner-friendly virtual study space designed in a **handcrafted scrapbook / collage style**, built using **pure HTML, CSS, and vanilla JavaScript**. No build tools, no frameworks, and no npm packages required.

---

## Scrapbook Design & Features

1. **Scrapbook / Collage Aesthetics**:
   - **Paper textures**: Dot-grid journal backgrounds, warm craft ivory paper, and midnight chalkboard surfaces.
   - **Washi tape strips**: Translucent, patterned tape with torn serrated edges (`.washi-tape`) in pastel rose, sage, honey, sky, and lavender.
   - **Polaroid cards & pushpins**: Subtle angled tilts, drop shadows, tactile layered depth, and metallic push pins.
   - **Postage & stamp badges**: Distressed rubber stamps for vibes, verification, and tags (`.stamp-badge`).
   - **Lined legal pad**: Real tear-off style checklist with margin lines and strikethrough pencil effect.
   - **Crisp SVG Icons**: Clean vector line icons replace all emojis for a sharp, high-end, cross-platform appearance.
   - **Typography**: Google Fonts pairing handwritten notes (`Caveat` & `Patrick Hand`) with readable body typography (`Plus Jakarta Sans`) and typewriter timestamps (`Space Mono`).

2. **Dark / Light Mode Toggle Button**:
   - Easily switch between **Day Paper** (warm craft parchment) and **Night Journal** (midnight chalkboard moodboard).
   - Instant response, zero screen flicker on refresh, and automatically remembers user preference in `localStorage`.
   - Included in the navigation bar across all pages.

3. **Password Visibility (Show/Hide)**:
   - Modern, clean eye toggle icon inside the password field on `login.html`.
   - Accessible keyboard support and immediate visual feedback.

---

## File Structure

```text
study-together/
├── index.html          # Landing page (Scrapbook collage hero, live stats ticket, reviews wall)
├── login.html          # Authentication (Paper pass card, show/hide password, guest mode)
├── lobby.html          # Room directory (Scrapbook moodboard grid with washi tape & tags)
├── room.html           # Active study room (Framed video co-working, vintage stopwatch, legal pad tasks)
├── about.html          # Philosophy, body doubling explanation, and pure craft architecture
├── css/
│   ├── style.css       # Complete scrapbook design system, Day/Night variables, tape, pins
│   └── themes.css      # Cozy & Focus vibe overrides, room layouts, timer, and to-do pad
├── js/
│   ├── theme.js        # Day/Night mode controller with localStorage persistence
│   ├── auth.js         # Client-side fake auth with localStorage + nav bar updater
│   ├── lobby.js        # Scrapbook room filtering, real-time search, and dynamic card generation
│   └── room.js         # Jitsi video setup, Pomodoro countdown controller, task checklist
└── README.md           # Documentation and quick-start guide
```

---

## How to Run the Website

### Method 1: Direct File Open (Easiest)
Simply double-click `index.html` or drag and drop it into any modern web browser (Chrome, Edge, Firefox, Safari).

### Method 2: Python Local Server
Open PowerShell in the project directory and run:
```bash
python -m http.server 8000
```
Then open your browser at: `http://localhost:8000`
