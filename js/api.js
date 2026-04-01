/**
 * api.js — OMDb API calls and debounce utility
 */

/**
 * debounce: wraps a function to delay execution until after `delay` ms of inactivity
 * @param {Function} fn
 * @param {number} delay  milliseconds
 * @returns {Function}
 */
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * fetchMovies: search OMDb by keyword (paginated, 10 results per page)
 * @param {string} query
 * @param {number} page   1-indexed
 * @returns {Promise<{movies: Array, totalResults: number}>}
 */
const fetchMovies = async (query, page = 1) => {
  if (!query || query.trim().length < 2) return { movies: [], totalResults: 0 };

  if (config.apiKey === 'http://www.omdbapi.com/?i=tt3896198&apikey=d3124b6d') {
    throw new Error('NO_KEY');
  }

  const url = `${config.apiBase}?s=${encodeURIComponent(query.trim())}&page=${page}&apikey=${config.apiKey}&type=movie`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.Response === 'True') {
      return {
        movies: data.Search || [],
        totalResults: parseInt(data.totalResults, 10) || 0
      };
    }

    // OMDb returns Response: "False" for no results
    return { movies: [], totalResults: 0 };
  } catch (err) {
    console.error('[CineVault] fetchMovies error:', err);
    return null; // null signals a network/API error
  }
};

/**
 * fetchMovieDetails: fetch full movie details by IMDb ID
 * @param {string} imdbId
 * @returns {Promise<Object|null>}
 */
const fetchMovieDetails = async (imdbId) => {
  if (!imdbId) return null;

  const url = `${config.apiBase}?i=${imdbId}&apikey=${config.apiKey}&plot=short`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.Response === 'True' ? data : null;
  } catch (err) {
    console.error('[CineVault] fetchMovieDetails error:', err);
    return null;
  }
};

/* ─── Trending Movies ─────────────────────────────────────── */

// Curated list of 75 popular movies (Phase 1)
const TRENDING_IDS = [
  // Action
  'tt15398776', 'tt14209916', 'tt11389872', 'tt1877830', 'tt6791350', 'tt4154796', 'tt0468569', 'tt0133093', 'tt1375666', 'tt1392190', 'tt1745960', 'tt0848228', 'tt3545258', 'tt10366206', 'tt0103064',
  // Comedy
  'tt1119646', 'tt0829482', 'tt1007028', 'tt0357413', 'tt0377092', 'tt0443453', 'tt2278388', 'tt1156398', 'tt0109686', 'tt1148050', 'tt0071853', 'tt3104988', 'tt21692408', 'tt7556122', 'tt0330373',
  // Drama
  'tt0111161', 'tt0068646', 'tt0108052', 'tt0109830', 'tt6751668', 'tt13833688', 'tt6710474', 'tt10366460', 'tt6966692', 'tt4975722', 'tt1160419', 'tt0110912', 'tt0137523', 'tt7286456', 'tt0102138',
  // Horror
  'tt1457767', 'tt5022034', 'tt7784604', 'tt6644200', 'tt1396484', 'tt0070047', 'tt0077651', 'tt0117588', 'tt8772262', 'tt15791034',
  // Crime
  'tt0407887', 'tt0114369', 'tt0099685', 'tt0208092', 'tt0477348',
  // Romance
  'tt0332280', 'tt3783958', 'tt0119919', 'tt2194499', 'tt0414387',
  // Sci-Fi
  'tt0816692', 'tt0499549', 'tt13966216', 'tt1630029', 'tt0338013',
  // Animation
  'tt4633694', 'tt21165402', 'tt0114709', 'tt0245429', 'tt0110357'
];

let _trendingCache = null;

/**
 * fetchTrendingMovies: fetch full details for all trending IDs in parallel
 * Results are cached in memory for the session.
 * @returns {Promise<Array>}
 */
const fetchTrendingMovies = async () => {
  if (_trendingCache) return _trendingCache;
  if (config.apiKey === 'YOUR_OMDB_API_KEY') return [];
  const results = await Promise.all(TRENDING_IDS.map(id => fetchMovieDetails(id)));
  _trendingCache = results.filter(Boolean);
  return _trendingCache;
};
