/**
 * watchlist.js — Manage the movie watchlist via localStorage
 */

const STORAGE_KEY = 'cinevault_watchlist';

/** getWatchlist: returns array of saved movie objects */
const getWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

/** saveWatchlist: persist array to localStorage */
const saveWatchlist = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

/**
 * addToWatchlist: add a movie object to the watchlist
 * Stores only the minimal fields needed for display
 * @param {Object} movie  { imdbID, Title, Year, Poster, imdbRating }
 */
const addToWatchlist = (movie) => {
  const list = getWatchlist();
  if (list.find(m => m.imdbID === movie.imdbID)) return; // no duplicates
  list.push({
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Poster: movie.Poster,
    imdbRating: movie.imdbRating || 'N/A'
  });
  saveWatchlist(list);
};

/**
 * removeFromWatchlist: remove a movie by IMDb ID
 * @param {string} imdbId
 */
const removeFromWatchlist = (imdbId) => {
  const list = getWatchlist().filter(m => m.imdbID !== imdbId);
  saveWatchlist(list);
};

/**
 * isInWatchlist: check if a movie is saved
 * @param {string} imdbId
 * @returns {boolean}
 */
const isInWatchlist = (imdbId) => {
  return getWatchlist().some(m => m.imdbID === imdbId);
};

/**
 * getRandomMovie: returns a random movie from the watchlist, or null if empty
 * @returns {Object|null}
 */
const getRandomMovie = () => {
  const list = getWatchlist();
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
};
