# CineVault — Movie Watchlist App

A sleek, dark-themed movie discovery and watchlist web application built with vanilla JavaScript.

##  Overview

CineVault lets users search for any movie, view key details, and build a personal watchlist — all in a cinematic, distraction-free UI inspired by streaming platforms like HBO Max.

## API Used

- **OMDb API** — [https://www.omdbapi.com/](https://www.omdbapi.com/)
  - Used for live movie search, fetching titles, posters, ratings, year, and plot.

##  Features

### Core
-  **Live Search** — Fetch movies from OMDb as the user types
- **Movie Cards** — Display poster, title, year, and IMDb rating
-  **Watchlist Toggle** — Add/remove movies from a personal watchlist
-  **Empty States** — Friendly UI when no results or watchlist is empty
-  **Local Storage** — Watchlist persists across browser sessions

### Bonus (Planned)
- **Debouncing** — Prevents API calls on every keystroke (300ms delay)
- **Pagination** — Browse results across multiple pages
- **Loading Indicators** — Spinner shown during API fetch
- **Random Movie Night** — Picks a random movie from saved watchlist
- **Responsive Design** — Works on mobile, tablet, and desktop

## Technologies

- HTML5, CSS3, JavaScript
- OMDb API (fetch-based)
- Local Storage API
- CSS Grid & Flexbox for layout

## Setup & Usage

1. Clone the repository:
```bash
   git clone https://github.com/Shivala-08/cinevault.git
   cd cinevault
```
2. Get a free API key from [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
3. Open `js/config.js` and replace `YOUR_API_KEY` with your OMDb key
4. Open `index.html` in any browser.

##  Project Structure
```
cinevault/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js      # API key config
│   ├── api.js         # Fetch logic
│   ├── ui.js          # DOM rendering
│   ├── watchlist.js   # Add/remove + localStorage
│   └── app.js         # Entry point + event handlers
└── README.md
```
