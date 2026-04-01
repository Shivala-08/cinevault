/**
 * ui.js — DOM rendering, skeleton loaders, toasts, spinner, pagination
 */

/* ─── Helpers ─────────────────────────────────────────────── */

const getPosterSrc = (poster) =>
  (!poster || poster === 'N/A') ? null : poster;

const getRatingColor = (rating) => {
  const r = parseFloat(rating);
  if (isNaN(r)) return '#9E9E9E';
  if (r >= 7.5) return '#4CAF50';
  if (r >= 5) return '#FFC107';
  return '#E57373';
};

/* ─── Card HTML Builder ───────────────────────────────────── */

const buildCardHTML = (movie) => {
  const posterSrc = getPosterSrc(movie.Poster);
  const inWatchlist = isInWatchlist(movie.imdbID);
  const ratingColor = getRatingColor(movie.imdbRating);
  const rating = (movie.imdbRating && movie.imdbRating !== 'N/A')
    ? `<span class="rating-badge" style="color:${ratingColor}">⭐ ${movie.imdbRating}</span>`
    : `<span class="rating-badge rating-na">N/A</span>`;

  const posterHTML = posterSrc
    ? `<img class="card-poster" src="${posterSrc}" alt="Poster for ${movie.Title}" loading="lazy" />`
    : `<div class="card-poster-placeholder"><span>🎬</span></div>`;

  const btnClass = inWatchlist ? 'btn-watchlist in-list' : 'btn-watchlist';
  const btnText  = inWatchlist ? '✓ In Watchlist' : '＋ Watchlist';

  return `
    <article class="movie-card" data-id="${movie.imdbID}" tabindex="0" aria-label="${movie.Title} (${movie.Year})">
      <div class="card-poster-wrap">
        ${posterHTML}
        <div class="card-type-badge">Movie</div>
      </div>
      <div class="card-body">
        <h3 class="card-title" title="${movie.Title}">${movie.Title}</h3>
        <div class="card-meta">
          <span class="year-badge">${movie.Year || '—'}</span>
          ${rating}
        </div>
        <button
          class="${btnClass}"
          data-id="${movie.imdbID}"
          data-title="${movie.Title}"
          data-year="${movie.Year || ''}"
          data-poster="${movie.Poster || ''}"
          data-rating="${movie.imdbRating || 'N/A'}"
          aria-label="${inWatchlist ? 'Remove' : 'Add'} ${movie.Title} ${inWatchlist ? 'from' : 'to'} watchlist"
        >
          ${btnText}
        </button>
      </div>
    </article>
  `;
};

/* ─── renderMovieCards ────────────────────────────────────── */

/**
 * Render a list of movie cards into a container
 * @param {Array}  movies
 * @param {string} containerId
 */
const renderMovieCards = (movies, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!movies || !movies.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `<div class="movies-grid">${movies.map(buildCardHTML).join('')}</div>`;
};

/* ─── renderSkeletons ─────────────────────────────────────── */

/**
 * Show N skeleton loader cards in a container
 * @param {number} count
 * @param {string} containerId
 */
const renderSkeletons = (count, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const skeletonCard = `
    <div class="movie-card skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton-poster"></div>
      <div class="card-body">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-meta"></div>
        <div class="skeleton skeleton-btn"></div>
      </div>
    </div>
  `;

  container.innerHTML = `<div class="movies-grid">${skeletonCard.repeat(count)}</div>`;
};

/* ─── renderEmptyState ────────────────────────────────────── */

/**
 * Render the appropriate empty state
 * @param {string} containerId
 * @param {'search'|'watchlist'|'no-results'|'no-key'|'error'} type
 */
const renderEmptyState = (containerId, type) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const states = {
    search: {
      icon: '🎬',
      title: 'Discover Your Next Favorite',
      subtitle: 'Search for a movie to get started',
      extra: ''
    },
    watchlist: {
      icon: '🎭',
      title: 'Your Watchlist is Empty',
      subtitle: 'Start adding movies you want to watch!',
      extra: `<button class="btn btn-accent empty-discover-btn" id="empty-discover-btn">🔍 Discover Movies</button>`
    },
    'no-results': {
      icon: '🔭',
      title: 'No Results Found',
      subtitle: 'Try a different title, or check your spelling.',
      extra: ''
    },
    'no-key': {
      icon: '🔑',
      title: 'API Key Required',
      subtitle: 'Open <code>js/config.js</code> and replace <code>YOUR_OMDB_API_KEY</code> with your free key from <a href="https://www.omdbapi.com/apikey.aspx" target="_blank" rel="noopener">omdbapi.com</a>.',
      extra: ''
    },
    error: {
      icon: '⚠️',
      title: 'Something went wrong',
      subtitle: 'Could not connect to the movie database. Please check your network and try again.',
      extra: ''
    }
  };

  const s = states[type] || states.search;

  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${s.icon}</div>
      <h2 class="empty-title">${s.title}</h2>
      <p class="empty-subtitle">${s.subtitle}</p>
      ${s.extra}
    </div>
  `;
};

/* ─── showToast ───────────────────────────────────────────── */

let toastTimer;

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'remove'} type
 */
const showToast = (message, type = 'success') => {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.classList.remove('hidden');

  // Trigger slide-up
  requestAnimationFrame(() => toast.classList.add('show'));

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      toast.className = 'toast hidden';
    }, 400);
  }, 2500);
};

/* ─── Spinner ─────────────────────────────────────────────── */

const showSpinner = () => {
  const el = document.getElementById('spinner-overlay');
  if (el) { el.classList.remove('hidden'); el.removeAttribute('aria-hidden'); }
};

const hideSpinner = () => {
  const el = document.getElementById('spinner-overlay');
  if (el) { el.classList.add('hidden'); el.setAttribute('aria-hidden', 'true'); }
};

/* ─── updateCardButton ────────────────────────────────────── */

/**
 * Update a single card's watchlist button without re-rendering the whole grid
 * @param {string}  imdbId
 * @param {boolean} inList
 */
const updateCardButton = (imdbId, inList) => {
  const btns = document.querySelectorAll(`.btn-watchlist[data-id="${imdbId}"]`);
  btns.forEach(btn => {
    btn.textContent = inList ? '✓ In Watchlist' : '＋ Watchlist';
    btn.className = inList ? 'btn-watchlist in-list' : 'btn-watchlist';
    btn.setAttribute('aria-label',
      `${inList ? 'Remove' : 'Add'} ${btn.dataset.title} ${inList ? 'from' : 'to'} watchlist`
    );
  });
};

/* ─── renderPagination ────────────────────────────────────── */

/**
 * Render Previous/Next pagination controls
 * @param {number} currentPage
 * @param {number} totalResults
 * @param {string} containerId
 * @param {Function} onPageChange  callback(newPage)
 */
const renderPagination = (currentPage, totalResults, containerId, onPageChange) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.ceil(totalResults / 10);
  if (totalPages <= 1) { container.classList.add('hidden'); container.innerHTML = ''; return; }

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="pagination">
      <button
        class="page-btn"
        id="page-prev"
        ${currentPage <= 1 ? 'disabled' : ''}
        aria-label="Previous page"
      >← Prev</button>
      <span class="page-info">Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong></span>
      <button
        class="page-btn"
        id="page-next"
        ${currentPage >= totalPages ? 'disabled' : ''}
        aria-label="Next page"
      >Next →</button>
    </div>
  `;


  document.getElementById('page-prev')?.addEventListener('click', () => onPageChange(currentPage - 1));
  document.getElementById('page-next')?.addEventListener('click', () => onPageChange(currentPage + 1));

};

/* ─── Genre Chips ─────────────────────────────────────────── */

const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Animation', 'Romance', 'Crime'];

/**
 * renderGenreChips: render clickable genre filter chips
 * @param {string}   containerId
 * @param {string}   selectedGenre
 * @param {Function} onClick  callback(genre)
 */
const renderGenreChips = (containerId, selectedGenre, onClick) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = GENRES.map(g => `
    <button
      class="genre-chip${g === selectedGenre ? ' active' : ''}"
      data-genre="${g}"
      aria-pressed="${g === selectedGenre}"
    >${g}</button>
  `).join('');
  container.querySelectorAll('.genre-chip').forEach(btn =>
    btn.addEventListener('click', () => onClick(btn.dataset.genre))
  );
};

/* ─── Sort / Filter Bar ───────────────────────────────────── */

const SORT_OPTIONS = [
  { value: 'default',     label: 'Relevance' },
  { value: 'year-desc',   label: '📅 Newest' },
  { value: 'year-asc',    label: '📅 Oldest' },
  { value: 'title-asc',   label: '🔤 A → Z' },
  { value: 'rating-desc', label: '⭐ Top Rated' },
];

/**
 * renderSortBar: render the sort/filter toolbar with result count
 * @param {string}   containerId
 * @param {string}   currentSort
 * @param {number}   totalCount
 * @param {boolean}  showRating   show rating sort option (only for trending)
 * @param {Function} onSortChange callback(sortValue)
 */
const renderSortBar = (containerId, currentSort, totalCount, showRating, onSortChange) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  const options = showRating ? SORT_OPTIONS : SORT_OPTIONS.filter(o => o.value !== 'rating-desc');
  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="sort-filter-inner">
      <span class="results-count"><strong>${totalCount.toLocaleString()}</strong> result${totalCount !== 1 ? 's' : ''}</span>
      <div class="sort-controls">
        <span class="sort-label">Sort:</span>
        ${options.map(o => `<button class="sort-btn${o.value === currentSort ? ' active' : ''}" data-sort="${o.value}">${o.label}</button>`).join('')}
      </div>
    </div>
  `;
  container.querySelectorAll('.sort-btn').forEach(btn =>
    btn.addEventListener('click', () => onSortChange(btn.dataset.sort))
  );
};

/* ─── Trending Section ────────────────────────────────────── */

/**
 * renderTrendingSection: render a grid of trending movie cards
 * @param {Array}  movies
 * @param {string} containerId
 */
const renderTrendingSection = (movies, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!movies || !movies.length) {
    container.innerHTML = '<p style="color:var(--clr-text-2);padding:24px 0;">No movies found for this genre.</p>';
    return;
  }
  container.innerHTML = `<div class="movies-grid">${movies.map(buildCardHTML).join('')}</div>`;
};
