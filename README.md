# 🎬 CineVault

> **Your personal dark-themed cinema hub** — search millions of movies, browse trending picks, and build a watchlist that lives right in your browser.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat&logo=vercel)](https://cinevault-eight-red.vercel.app/)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-e34f26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Custom%20Properties-1572b6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![OMDb API](https://img.shields.io/badge/Powered%20by-OMDb%20API-gold?style=flat)](https://www.omdbapi.com/)

---

## 🖼 Preview

CineVault is a **zero-dependency, no-build** web app. Every feature runs with plain HTML, CSS, and JavaScript.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 **Live Movie Search** | Debounced (300ms) instant search via OMDb API |
| 🔥 **Trending Now** | 150+ curated popular films across 8 genres |
| 🎭 **Genre Filter Chips** | Filter trending by Action, Comedy, Drama, Horror, Sci-Fi, and more |
| 📊 **Sort Controls** | Sort by Newest, Oldest, A→Z, or Top Rated |
| 🎬 **Movie Detail Modal** | Full metadata — plot, cast, director, runtime, ratings |
| ➕ **Personal Watchlist** | Add/remove movies; persisted with `localStorage` |
| 📈 **Watchlist Stats** | Movie count, average IMDb rating, top genres |
| 💀 **Skeleton Loaders** | Shimmer placeholder cards while content fetches |
| 📄 **Pagination** | 10 results per page with Prev/Next controls |
| 🔔 **Toast Notifications** | Slide-up confirmation on add/remove |
| 🎉 **Confetti Animation** | Particle burst when adding a movie to your watchlist |
| 🎲 **Surprise Me** | Opens a random movie detail from the filtered trending list |
| 🎲 **Random Movie Night** | Spotlights a random pick from your personal watchlist |
| ⌨️ **Keyboard Shortcut** | Press `/` anywhere to jump to search |
| 📱 **Fully Responsive** | Mobile → tablet → desktop grid layouts |
| 🌑 **Dark Cinema Theme** | Deep blacks, Netflix-red accents, smooth animations |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Structure | **HTML5** — Semantic markup, ARIA roles, tab panels |
| Styling | **CSS3** — Custom properties, Grid, Flexbox, keyframe animations, skeleton shimmer |
| Logic | **JavaScript (ES6+)** — async/await, event delegation, localStorage |
| Data | **OMDb API** — Real movie posters, IMDb ratings, cast, plot |
| Fonts | **Google Fonts** — Inter (400/500/600/700) |
| Hosting | **Vercel** — Static deployment, auto-deploys from GitHub |

---

## 📁 Project Structure

```
cinevault/
├── index.html              # Single-page app shell (all screens, modals, nav)
├── css/
│   └── style.css           # Full design system — tokens, components, animations
├── js/
│   ├── config.js           # 🔑 API key + base URL (edit this first!)
│   ├── config.example.js   # Template for config.js (safe to commit)
│   ├── api.js              # OMDb fetch wrappers — search, details, trending
│   ├── watchlist.js        # localStorage CRUD for the personal watchlist
│   ├── ui.js               # DOM rendering — cards, skeletons, toast, pagination, sort bar
│   ├── modal.js            # Movie detail modal — populate & open/close
│   ├── confetti.js         # Canvas particle animation on watchlist add
│   └── app.js              # Entry point — state, events, search, tabs, trending
└── README.md
```

---

## 🔑 API Key Setup

> ⚠️ **You must add your own free OMDb API key before movies will load.**

1. Visit [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Register for a **free key** (1,000 requests/day)
3. Activate it via the email confirmation
4. Open `js/config.js` and paste your key:

```js
const config = {
  apiKey: 'YOUR_KEY_HERE',        // ← replace this
  apiBase: 'https://www.omdbapi.com/'
};
```

> 💡 A `js/config.example.js` template is included — copy it to `config.js` and add your key.

---

## 🚀 Running Locally

**No build tools. No package manager. Just open the file.**

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

Or drag `index.html` directly into Chrome, Firefox, Safari, or Edge.

Prefer a local server (to avoid CORS on some browsers)?

```bash
# Python 3 (built-in)
python3 -m http.server 8080

# Node.js (if installed)
npx serve .
```

Then visit `http://localhost:8080`.

---

## 🌐 Deploying to Vercel

This is a **static site** — deploy in one click:

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Vercel auto-detects the static site — no framework selected, no build command needed
4. Click **Deploy** ✅

> ⚠️ `js/config.js` must be committed to the repo for Vercel to serve it. Since this is a purely client-side app, the OMDb key is visible in the browser's network tab regardless — this is normal for free public API keys.

---

## 🎨 Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--clr-bg` | `#0F0F0F` | Page background |
| `--clr-surface` | `#1A1A1A` | Cards, modals |
| `--clr-navbar` | `#212121` | Navigation bar |
| `--clr-accent` | `#E50914` | Buttons, highlights |
| `--clr-text` | `#FFFFFF` | Primary text |
| `--clr-text-2` | `#9E9E9E` | Secondary / muted text |
| `--clr-border` | `#2C2C2C` | Card/modal borders |

---

## 📄 License

MIT — free to use, fork, and modify for personal or educational projects.

---

<p align="center">Made with ❤️ · HTML, CSS & JavaScript</p>
