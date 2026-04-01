# 🎬 CineVault

**CineVault** is a dark-themed, cinematic movie watchlist web application powered by the [OMDb API](https://www.omdbapi.com/). Search millions of movies, browse results with pagination, and build your personal watchlist — all saved locally in your browser.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Live Movie Search** | Debounced search (300ms) for instant, lag-free results |
| **OMDb Integration** | Real poster images, IMDb ratings, and release years |
| **Personal Watchlist** | Add/remove movies; persisted via `localStorage` |
| **Skeleton Loaders** | Shimmer cards shown while results load |
| **Pagination** | 10 results per page; Previous/Next controls |
| **Toast Notifications** | Slide-up confirmation on add/remove |
| **Random Movie Night 🎲** | Picks a random film from your watchlist with a glowing spotlight |
| **Responsive** | Mobile → Tablet → Desktop grid layouts |
| **Dark Cinema Theme** | #0F0F0F background, Netflix-red accents, Inter typeface |
| **Keyboard Shortcut** | Press `/` from anywhere to focus the search bar |

---

## 🔑 API Key Setup

> ⚠️ **You MUST add your own free OMDb API key for the app to search movies.**

1. Go to [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Register for a **free key** (1,000 requests/day — more than enough)
3. Check your email and activate the key
4. Open `js/config.js` in this project
5. Replace `'YOUR_OMDB_API_KEY'` with your actual key:

```js
const config = {
  apiKey: 'abc12345',   // ← your real key here
  apiBase: 'https://www.omdbapi.com/'
};
```

> ⚠️ **Security**: Never commit your API key to a public GitHub repository.  
> Add `js/config.js` to your `.gitignore` if sharing publicly:
> ```
> echo "js/config.js" >> .gitignore
> ```

---

## 🚀 How to Run

No build step. No dependencies. No server required.

```bash
# Just open the file in your browser:
open index.html           # macOS
start index.html          # Windows
xdg-open index.html       # Linux
```

Or drag `index.html` into any modern browser (Chrome, Firefox, Safari, Edge).

---

## 📁 Folder Structure

```
cinevault/
├── index.html          # Single-page app shell
├── css/
│   └── style.css       # Full design system (dark theme, animations, responsive)
├── js/
│   ├── config.js       # 🔑 API key + base URL (edit this first!)
│   ├── api.js          # OMDb fetch wrappers + debounce utility
│   ├── watchlist.js    # localStorage CRUD for saved movies
│   ├── ui.js           # DOM rendering (cards, skeletons, toast, pagination)
│   └── app.js          # App entry point, tab/event logic
└── README.md           # This file
```

---

## 🛠 Technologies

- **HTML5** — Semantic markup, ARIA roles
- **CSS3** — Custom properties, Grid, Flexbox, keyframe animations
- **JavaScript (ES6+)** — async/await, modules, event delegation, localStorage
- **OMDb API** — Free movie database (posters, ratings, metadata)
- **Google Fonts** — Inter typeface

---

## 🎨 Design Tokens

| Token | Value |
|---|---|
| Background | `#0F0F0F` |
| Surface / Cards | `#1A1A1A` |
| Navbar | `#212121` |
| Accent (red) | `#E50914` |
| Text Primary | `#FFFFFF` |
| Text Secondary | `#9E9E9E` |
| Border | `#2C2C2C` |

---

## 📄 License

MIT — Free to use and modify for personal projects.
