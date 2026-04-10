# CineVault 🎬

A movie discovery and watchlist app I built using just HTML, CSS and JavaScript. No frameworks, no build tools — just open the file and it works.

Live at: https://cinevault-eight-red.vercel.app/

---

## What it does

- Search for any movie using the OMDb API
- Browse a curated trending list of 150+ popular films
- Filter trending movies by genre (Action, Comedy, Drama, Horror, etc.)
- Sort results by newest, oldest, A-Z, or top rated
- Click any movie card to see the full details — plot, cast, director, runtime
- Save movies to a personal watchlist (stored in your browser via localStorage)
- See watchlist stats like average rating and your top genres
- Hit the "Surprise Me" button to get a random movie suggestion
- Use "Random Movie Night" to spotlight a random pick from your watchlist
- Press `/` anywhere on the page to jump straight to the search bar

---

## Getting started

You'll need a free OMDb API key first — grab one at https://www.omdbapi.com/apikey.aspx (takes about a minute, they email it to you).

Once you have it, open `js/config.js` and drop it in:

```js
const config = {
  apiKey: 'your-key-here',
  apiBase: 'https://www.omdbapi.com/'
};
```

Then just open `index.html` in your browser. That's it.

If you'd rather run it on a local server:

```bash
python3 -m http.server 8080
```

Then go to `http://localhost:8080`.

---

## Project structure

```
cinevault/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── config.js       ← put your API key here
    ├── api.js          ← handles all the OMDb fetch calls
    ├── watchlist.js    ← localStorage read/write
    ├── ui.js           ← builds and renders all the cards/UI
    ├── modal.js        ← movie detail popup
    ├── confetti.js     ← the little confetti burst on watchlist add
    └── app.js          ← ties everything together
```

---

## Built with

- HTML, CSS and JavaScript (ES6+)
- OMDb API for movie data
- Google Fonts (Inter)
- Deployed on Vercel

---

## License

MIT — do whatever you want with it.
