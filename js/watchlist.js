const STORAGE_KEY = 'cinevault_watchlist';

const getWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveWatchlist = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const addToWatchlist = (movie) => {
  const list = getWatchlist();
  if (list.find(m => m.imdbID === movie.imdbID)) return;
  list.push({
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Poster: movie.Poster,
    imdbRating: movie.imdbRating || 'N/A'
  });
  saveWatchlist(list);
};

const removeFromWatchlist = (imdbId) => {
  saveWatchlist(getWatchlist().filter(m => m.imdbID !== imdbId));
};

const isInWatchlist = (imdbId) => {
  return getWatchlist().some(m => m.imdbID === imdbId);
};

const getRandomMovie = () => {
  const list = getWatchlist();
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
};
