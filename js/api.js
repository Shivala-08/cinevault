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
 * Includes 3 automatic retries with exponential backoff to handle rate limits/intermittent issues.
 * @param {string} imdbId
 * @param {number} retryCount (internal)
 * @returns {Promise<Object|null>}
 */
const fetchMovieDetails = async (imdbId, retryCount = 0) => {
  if (!imdbId) return null;

  const url = `${config.apiBase}?i=${imdbId}&apikey=${config.apiKey}&plot=short`;

  try {
    const res = await fetch(url);
    
    // Handle 401/429 with high-priority retries
    if ((res.status === 401 || res.status === 429) && retryCount < 3) {
      const waitTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s backoff
      await new Promise(res => setTimeout(res, waitTime));
      return fetchMovieDetails(imdbId, retryCount + 1);
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.Response === 'True' ? data : null;
  } catch (err) {
    if (retryCount < 3) {
      await new Promise(res => setTimeout(res, 500));
      return fetchMovieDetails(imdbId, retryCount + 1);
    }
    console.error(`[CineVault] fetchMovieDetails error for ${imdbId}:`, err);
    return null;
  }
};

/* ─── Trending Movies ─────────────────────────────────────── */

// Curated list of 75 popular movies (Phase 1)
const TRENDING_IDS = [
  // Action (15 + 9 = 24)
  'tt15398776', 'tt14209916', 'tt11389872', 'tt1877830', 'tt6791350', 'tt4154796', 'tt0468569', 'tt0133093', 'tt1375666', 'tt1392190', 'tt1745960', 'tt0848228', 'tt3545258', 'tt10366206', 'tt0103064',
  'tt15239678', 'tt9603212', 'tt9362722', 'tt6146586', 'tt12595212', 'tt0439572', 'tt13711112', 'tt12263384', 'tt14846026',
  // Comedy (15 + 9 = 24)
  'tt1119646', 'tt0829482', 'tt1007028', 'tt0357413', 'tt0377092', 'tt0443453', 'tt2278388', 'tt1156398', 'tt0109686', 'tt1148050', 'tt0071853', 'tt3104988', 'tt21692408', 'tt7556122', 'tt0330373',
  'tt14230458', 'tt11813216', 'tt14452776', 'tt15671022', 'tt26047818', 'tt6166392', 'tt14230388', 'tt11291274', 'tt15268244',
  // Drama (15 + 9 = 24)
  'tt0111161', 'tt0068646', 'tt0108052', 'tt0109830', 'tt6751668', 'tt13833688', 'tt6710474', 'tt10366460', 'tt6966692', 'tt4975722', 'tt1160419', 'tt0110912', 'tt0137523', 'tt7286456', 'tt0102138',
  'tt11559814', 'tt17009710', 'tt21064584', 'tt22022452', 'tt13854932', 'tt13651794', 'tt16277242', 'tt7160372', 'tt19775308',
  // Horror (10 + 10 = 20)
  'tt1457767', 'tt5022034', 'tt7784604', 'tt6644200', 'tt1396484', 'tt0070047', 'tt0077651', 'tt0117588', 'tt8772262', 'tt15791034',
  'tt5079612', 'tt17528138', 'tt1841220', 'tt23468456', 'tt10638522', 'tt13341590', 'tt16327022', 'tt15474916', 'tt14402318', 'tt13433802',
  // Crime (5 + 10 = 15)
  'tt0407887', 'tt0114369', 'tt0099685', 'tt0208092', 'tt0477348',
  'tt5537002', 'tt1136617', 'tt13274016', 'tt14413958', 'tt11564570', 'tt14114802', 'tt21447604', 'tt15858004', 'tt12439546', 'tt20244692',
  // Romance (5 + 10 = 15)
  'tt0332280', 'tt3783958', 'tt0119919', 'tt2194499', 'tt0414387',
  'tt13238346', 'tt16428666', 'tt15805602', 'tt14945766', 'tt10853822', 'tt14134982', 'tt13277884', 'tt10172228', 'tt15456496', 'tt8623904',
  // Sci-Fi (5 + 10 = 15)
  'tt0816692', 'tt0499549', 'tt13966216', 'tt1630029', 'tt0338013',
  'tt11858890', 'tt8760708', 'tt3659388', 'tt0470752', 'tt1856101', 'tt6723592', 'tt14708252', 'tt2543164', 'tt1051906', 'tt11866324',
  // Animation (5 + 8 = 13) - Added 8 to reach 151 total (76 old + 75 new)
  'tt4633694', 'tt21165402', 'tt0114709', 'tt0245429', 'tt0110357',
  'tt12605668', 'tt3915174', 'tt6598230', 'tt16421242', 'tt1488589', 'tt7626154', 'tt12265004', 'tt6718170'
];

let _trendingCache = null;
let abortTrending = false;

const cancelTrendingFetch = () => { abortTrending = true; };

/**
 * fetchTrendingMovies: fetch full details for all trending IDs
 * Uses chunked fetching (10 at a time) to avoid overloading the API/browser connections.
 * Results are cached in memory for the session.
 * @returns {Promise<Array>}
 */
const fetchTrendingMovies = async () => {
  if (_trendingCache) return _trendingCache;
  if (config.apiKey === 'YOUR_OMDB_API_KEY') return [];

  abortTrending = false; // Reset on start
  const CHUNK_SIZE = 10;
  const results = [];
  let failCount = 0;

  console.log(`[CineVault] Starting fetch for ${TRENDING_IDS.length} movies...`);

  for (let i = 0; i < TRENDING_IDS.length; i += CHUNK_SIZE) {
    if (abortTrending) {
      console.log(`[CineVault] Trending fetch aborted due to search.`);
      break;
    }

    const chunk = TRENDING_IDS.slice(i, i + CHUNK_SIZE);
    const chunkResults = await Promise.all(chunk.map(id => fetchMovieDetails(id)));
    
    // Track failures within this chunk
    chunkResults.forEach(r => { if (!r) failCount++; });
    results.push(...chunkResults);

    // Staggered delay (200ms) to avoid OMDb burst limiting
    if (i + CHUNK_SIZE < TRENDING_IDS.length && !abortTrending) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  // Only cache if we finished the whole list
  if (!abortTrending) {
    _trendingCache = results.filter(Boolean);
    console.log(`[CineVault] Fetch complete. Total: ${results.length}, Success: ${_trendingCache.length}, Failed: ${failCount}`);
    return _trendingCache;
  }
  
  return results.filter(Boolean);
};
