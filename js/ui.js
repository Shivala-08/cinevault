const getPosterSrc = (poster) => (!poster || poster === 'N/A') ? null : poster;

const getRatingColor = (rating) => {
  const r = parseFloat(rating);
  if (isNaN(r)) return '#9E9E9E';
  if (r >= 7.5) return '#4CAF50';
  if (r >= 5) return '#FFC107';
  return '#E57373';
};

const buildCardHTML = (movie) => {
  const posterSrc = getPosterSrc(movie.Poster);
  const inWatchlist = isInWatchlist(movie.imdbID);
  
  const posterHTML = posterSrc
    ? `<img class="card-poster" src="${posterSrc}" alt="${movie.Title}" loading="lazy" />`
    : `<div class="card-poster-placeholder">🎬</div>`;

  return `
    <article class="movie-card" data-id="${movie.imdbID}" tabindex="0" aria-label="${movie.Title}">
      <div class="card-poster-wrap">
        ${posterHTML}
        <div class="card-overlay">
          <h3 class="card-title">${movie.Title}</h3>
          <div class="card-meta">
            <span>${movie.Year || ''}</span>
            ${movie.imdbRating && movie.imdbRating !== 'N/A' ? `<span class="card-rating">⭐ ${movie.imdbRating}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="card-action-btn btn-play-trailer" data-id="${movie.imdbID}" aria-label="Play trailer" title="Play Trailer">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><polygon points="5,3 19,12 5,21"/></svg>
            </button>
            <button class="card-action-btn btn-watchlist-toggle ${inWatchlist ? 'in-list' : ''}" 
              data-id="${movie.imdbID}" 
              data-title="${movie.Title}"
              data-year="${movie.Year || ''}"
              data-poster="${movie.Poster || ''}"
              data-rating="${movie.imdbRating || 'N/A'}"
              aria-label="Toggle watchlist" title="${inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                ${inWatchlist 
                  ? `<polyline points="20 6 9 17 4 12"></polyline>` 
                  : `<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>`
                }
              </svg>
            </button>
            <button class="card-action-btn btn-info" data-id="${movie.imdbID}" aria-label="More info" title="More Info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
};

const renderMovieCards = (movies, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!movies || !movies.length) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = `<div class="movies-grid">${movies.map(buildCardHTML).join('')}</div>`;
};

const renderSkeletons = (count, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  const skeletonCard = `
    <div class="movie-card skeleton-card" aria-hidden="true">
      <div class="card-poster-wrap skeleton"></div>
    </div>
  `;
  container.innerHTML = `<div class="movies-grid">${skeletonCard.repeat(count)}</div>`;
};

const renderEmptyState = (containerId, type) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  const states = {
    search: { icon: '🔍', title: 'Start Exploring', subtitle: 'Search movies, actors, or genres.' },
    watchlist: { icon: '🍿', title: 'Your Watchlist is Empty', subtitle: 'Add movies you want to watch later.' },
    'no-results': { icon: '🤷', title: 'No Results Found', subtitle: 'Try adjusting your search terms.' },
    'no-key': { icon: '🔑', title: 'API Key Required', subtitle: 'Add OMDB API key in config.js' },
    error: { icon: '⚠️', title: 'Oops!', subtitle: 'Something went wrong fetching data.' }
  };
  const s = states[type] || states.search;
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon" style="font-size: 64px; margin-bottom: 16px;">${s.icon}</div>
      <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">${s.title}</h2>
      <p style="color: var(--clr-text-2); font-size: 16px;">${s.subtitle}</p>
    </div>
  `;
};

let toastTimer;
const showToast = (message, type = 'success') => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.classList.remove('hidden');
  requestAnimationFrame(() => toast.classList.add('show'));
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => { toast.className = 'toast hidden'; }, 400);
  }, 3000);
};

const updateCardButton = (imdbId, inList) => {
  const btns = document.querySelectorAll(`.btn-watchlist-toggle[data-id="${imdbId}"]`);
  btns.forEach(btn => {
    btn.classList.toggle('in-list', inList);
    btn.innerHTML = inList 
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
    btn.setAttribute('title', inList ? 'Remove from Watchlist' : 'Add to Watchlist');
  });
};

const renderSortBar = (containerId, currentSort, totalCount, showRating, onSortChange) => {
  // Keeping simplified for now
};

const renderPagination = (currentPage, totalResults, containerId, onPageChange) => {
  // Simple pagination logic
};
