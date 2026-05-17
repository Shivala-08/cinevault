const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const fetchMovies = async (query, page = 1) => {
  if (!query || query.trim().length < 2) return { movies: [], totalResults: 0 };
  const url = `${config.apiBase}?s=${encodeURIComponent(query.trim())}&page=${page}&apikey=${config.apiKey}&type=movie`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.Response === 'True') {
      return { movies: data.Search || [], totalResults: parseInt(data.totalResults, 10) || 0 };
    }
    return { movies: [], totalResults: 0 };
  } catch (err) {
    console.error('fetchMovies error:', err);
    return null;
  }
};

const fetchMovieDetails = async (imdbId, retryCount = 0) => {
  if (!imdbId) return null;
  const url = `${config.apiBase}?i=${imdbId}&apikey=${config.apiKey}&plot=full`;
  try {
    const res = await fetch(url);
    if ((res.status === 401 || res.status === 429) && retryCount < 3) {
      await new Promise(r => setTimeout(r, Math.pow(2, retryCount) * 1000));
      return fetchMovieDetails(imdbId, retryCount + 1);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.Response === 'True' ? data : null;
  } catch (err) {
    if (retryCount < 3) {
      await new Promise(r => setTimeout(r, 500));
      return fetchMovieDetails(imdbId, retryCount + 1);
    }
    console.error(`fetchMovieDetails error for ${imdbId}:`, err);
    return null;
  }
};

// Curated lists for trending, mood, and AI sections
const CATEGORY_IDS = {
  trending: [
    'tt15398776', 'tt14209916', 'tt11389872', 'tt1877830', 'tt6791350', 'tt4154796', 'tt0468569', 'tt0133093',
    'tt1375666', 'tt1392190', 'tt1745960', 'tt0848228', 'tt3545258', 'tt10366206', 'tt0103064'
  ],
  'hidden-gems': [
    'tt1160419', 'tt0439572', 'tt1007028', 'tt0407887'
  ],
  'mind-bending': [
    'tt0816692', 'tt0133093', 'tt1375666', 'tt0499549'
  ],
  'binge-picks': [
    'tt0468569', 'tt0111161', 'tt0108052', 'tt0109830'
  ]
};

const _caches = {};
let abortTrending = false;

const cancelTrendingFetch = () => { abortTrending = true; };

const fetchCategoryMovies = async (category) => {
  if (_caches[category]) return _caches[category];
  if (config.apiKey === 'YOUR_OMDB_API_KEY') return [];

  const ids = CATEGORY_IDS[category] || [];
  const results = [];
  
  for (let i = 0; i < ids.length; i += 5) {
    if (category === 'trending' && abortTrending) break;
    const chunk = ids.slice(i, i + 5);
    const chunkResults = await Promise.all(chunk.map(id => fetchMovieDetails(id)));
    results.push(...chunkResults);
    if (i + 5 < ids.length) await new Promise(r => setTimeout(r, 200));
  }

  const valid = results.filter(Boolean);
  if (!abortTrending || category !== 'trending') {
    _caches[category] = valid;
  }
  return valid;
};

// Mock trailer video ID getter
const getTrailerVideoId = (imdbId) => {
  // A mapping of some famous imdbIds to YouTube trailer IDs
  const map = {
    'tt0816692': 'zSWdZVtXT7E', // Interstellar
    'tt1375666': '8hP9D6kZseM', // Inception
    'tt0468569': 'EXeTwQWrcwY', // The Dark Knight
    'tt0133093': 'vKQi3bBA1y8', // The Matrix
  };
  return map[imdbId] || 'dQw4w9WgXcQ'; // Default placeholder
};
