document.addEventListener('DOMContentLoaded', () => {

  let currentQuery   = '';
  let currentPage    = 1;
  let totalResults   = 0;
  let isLoading      = false;
  let activeScreen   = 'discover';
  let trendingMovies = [];
  let selectedGenre  = 'All';
  let currentMovies  = [];
  let currentSort    = 'default';

  const discoverScreen  = document.getElementById('discover-screen');
  const watchlistScreen = document.getElementById('watchlist-screen');
  const tabDiscover     = document.getElementById('tab-discover');
  const tabWatchlist    = document.getElementById('tab-watchlist');
  const searchInput     = document.getElementById('search-input');
  const searchInputMob  = document.getElementById('search-input-mobile');
  const searchClearBtn  = document.getElementById('search-clear-btn');
  const searchClearMob  = document.getElementById('search-clear-mobile-btn');
  const discoverResults = document.getElementById('discover-results');
  const paginationCont  = document.getElementById('pagination-container');
  const watchlistGrid   = document.getElementById('watchlist-grid');
  const watchlistCount  = document.getElementById('watchlist-count');
  const watchlistBadge  = document.getElementById('watchlist-badge');
  const randomBtn       = document.getElementById('random-btn');
  const logoBtn         = document.getElementById('logo-btn');
  const trendingSection = document.getElementById('trending-section');
  const sortFilterBar   = document.getElementById('sort-filter-bar');

  const syncSearchInputs = (value) => {
    if (searchInput)    searchInput.value    = value;
    if (searchInputMob) searchInputMob.value = value;
    [searchClearBtn, searchClearMob].forEach(btn => {
      if (!btn) return;
      btn.classList.toggle('hidden', !value);
    });
  };

  const updateWatchlistBadge = () => {
    const count = getWatchlist().length;
    if (watchlistBadge) {
      watchlistBadge.textContent = count;
      watchlistBadge.classList.toggle('hidden', count === 0);
    }
    if (watchlistCount) {
      watchlistCount.textContent = `${count} movie${count !== 1 ? 's' : ''}`;
    }
  };

  const applySortToMovies = (movies, sort) => {
    const copy = [...movies];
    switch (sort) {
      case 'year-desc':   return copy.sort((a, b) => parseInt(b.Year || 0) - parseInt(a.Year || 0));
      case 'year-asc':    return copy.sort((a, b) => parseInt(a.Year || 0) - parseInt(b.Year || 0));
      case 'title-asc':   return copy.sort((a, b) => a.Title.localeCompare(b.Title));
      case 'rating-desc': return copy.sort((a, b) => parseFloat(b.imdbRating || 0) - parseFloat(a.imdbRating || 0));
      default:            return copy;
    }
  };

  const showTrendingView = () => {
    trendingSection?.classList.remove('hidden');
    discoverResults?.classList.add('hidden');
    sortFilterBar?.classList.add('hidden');
    paginationCont?.classList.add('hidden');
  };

  const hideTrendingView = () => {
    trendingSection?.classList.add('hidden');
    discoverResults?.classList.remove('hidden');
  };

  const handleTrendingSort = (newSort) => {
    currentSort = newSort;
    const filtered = selectedGenre === 'All'
      ? trendingMovies
      : trendingMovies.filter(m => m.Genre && m.Genre.includes(selectedGenre));
    renderTrendingSection(applySortToMovies(filtered, newSort), 'trending-grid');
    renderSortBar('trending-sort-bar', newSort, filtered.length, true, handleTrendingSort);
  };

  const handleGenreSelect = (genre) => {
    selectedGenre = genre;
    currentSort = 'default';
    renderGenreChips('genre-chips', genre, handleGenreSelect);
    const filtered = genre === 'All'
      ? trendingMovies
      : trendingMovies.filter(m => m.Genre && m.Genre.includes(genre));
    renderTrendingSection(filtered, 'trending-grid');
    renderSortBar('trending-sort-bar', 'default', filtered.length, true, handleTrendingSort);
  };

  const loadTrending = async () => {
    renderSkeletons(12, 'trending-grid');
    renderGenreChips('genre-chips', 'All', handleGenreSelect);
    trendingMovies = await fetchTrendingMovies();
    renderTrendingSection(trendingMovies, 'trending-grid');
    renderSortBar('trending-sort-bar', 'default', trendingMovies.length, true, handleTrendingSort);
  };

  const handleSortChange = (newSort) => {
    currentSort = newSort;
    const sorted = applySortToMovies(currentMovies, newSort);
    renderMovieCards(sorted, 'discover-results');
    renderSortBar('sort-filter-bar', newSort, totalResults, false, handleSortChange);
  };

  const showScreen = (screen) => {
    activeScreen = screen;
    const isDiscover = screen === 'discover';

    discoverScreen.classList.toggle('active', isDiscover);
    discoverScreen.classList.toggle('hidden', !isDiscover);
    watchlistScreen.classList.toggle('active', !isDiscover);
    watchlistScreen.classList.toggle('hidden', isDiscover);

    tabDiscover.classList.toggle('active', isDiscover);
    tabDiscover.setAttribute('aria-selected', isDiscover);
    tabWatchlist.classList.toggle('active', !isDiscover);
    tabWatchlist.setAttribute('aria-selected', !isDiscover);

    if (!isDiscover) renderWatchlistScreen();
  };

  tabDiscover.addEventListener('click', () => showScreen('discover'));
  tabWatchlist.addEventListener('click', () => showScreen('watchlist'));
  logoBtn?.addEventListener('click', () => showScreen('discover'));
  logoBtn?.addEventListener('keydown', (e) => { if (e.key === 'Enter') showScreen('discover'); });

  const performSearch = async (query, page = 1) => {
    if (isLoading) return;
    query = query.trim();

    if (!query || query.length < 2) {
      showTrendingView();
      return;
    }

    isLoading    = true;
    currentQuery = query;
    currentPage  = page;
    currentSort  = 'default';

    hideTrendingView();
    sortFilterBar?.classList.add('hidden');
    renderSkeletons(8, 'discover-results');
    paginationCont.classList.add('hidden');

    const result = await fetchMovies(query, page);
    isLoading = false;

    if (result === null) {
      renderEmptyState('discover-results', 'error');
      sortFilterBar?.classList.add('hidden');
      return;
    }

    if (result.movies.length === 0) {
      renderEmptyState('discover-results', 'no-results');
      paginationCont.classList.add('hidden');
      sortFilterBar?.classList.add('hidden');
      return;
    }

    totalResults  = result.totalResults;
    currentMovies = result.movies;
    renderMovieCards(currentMovies, 'discover-results');
    renderSortBar('sort-filter-bar', 'default', totalResults, false, handleSortChange);
    renderPagination(currentPage, totalResults, 'pagination-container', (newPage) => {
      performSearch(currentQuery, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const debouncedSearch = debounce((query) => {
    if (!query.trim()) { showTrendingView(); return; }
    performSearch(query, 1);
  }, 300);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    syncSearchInputs(value);
    if (typeof cancelTrendingFetch === 'function') cancelTrendingFetch();
    debouncedSearch(value);
  };

  searchInput?.addEventListener('input', handleSearchInput);
  searchInputMob?.addEventListener('input', handleSearchInput);

  const clearSearch = () => {
    syncSearchInputs('');
    currentQuery = '';
    showTrendingView();
    searchInput?.focus();
  };

  searchClearBtn?.addEventListener('click', clearSearch);
  searchClearMob?.addEventListener('click', clearSearch);

  const renderWatchlistStats = (list) => {
    const statsEl = document.getElementById('watchlist-stats');
    if (!statsEl) return;
    if (list.length < 3) { statsEl.classList.add('hidden'); return; }

    const rated = list.filter(m => m.imdbRating && m.imdbRating !== 'N/A');
    const avgRating = rated.length
      ? (rated.reduce((s, m) => s + parseFloat(m.imdbRating), 0) / rated.length).toFixed(1)
      : null;

    const genreCount = {};
    list.forEach(m => {
      if (!m.Genre) return;
      m.Genre.split(',').forEach(g => {
        const g2 = g.trim();
        genreCount[g2] = (genreCount[g2] || 0) + 1;
      });
    });
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([g]) => `<span class="modal-meta-chip">${g}</span>`)
      .join('');

    statsEl.classList.remove('hidden');
    statsEl.innerHTML = `
      <div class="wl-stats-inner">
        <div class="wl-stat">
          <span class="wl-stat-value">${list.length}</span>
          <span class="wl-stat-label">Movies</span>
        </div>
        ${avgRating ? `<div class="wl-stat">
          <span class="wl-stat-value" style="color:#FFC107">⭐ ${avgRating}</span>
          <span class="wl-stat-label">Avg Rating</span>
        </div>` : ''}
        ${topGenres ? `<div class="wl-stat wl-stat-genres">
          <span class="wl-stat-label" style="margin-bottom:6px;">Top Genres</span>
          <div class="wl-genres">${topGenres}</div>
        </div>` : ''}
      </div>
    `;
  };

  const renderWatchlistScreen = () => {
    const list = getWatchlist();
    updateWatchlistBadge();
    if (randomBtn) randomBtn.classList.toggle('hidden', list.length === 0);
    renderWatchlistStats(list);
    if (list.length === 0) {
      renderEmptyState('watchlist-grid', 'watchlist');
      setTimeout(() => {
        document.getElementById('empty-discover-btn')?.addEventListener('click', () => showScreen('discover'));
      }, 0);
      return;
    }
    renderMovieCards(list, 'watchlist-grid');
  };

  const handleCardClick = (e) => {
    if (e.target.closest('.btn-watchlist') || e.target.closest('.modal-watchlist-btn')) return;
    const card = e.target.closest('.movie-card');
    if (!card) return;
    const imdbId = card.dataset.id;
    if (!imdbId) return;
    openMovieModal(imdbId, {});
  };

  discoverResults?.addEventListener('click', handleCardClick);
  watchlistGrid?.addEventListener('click', handleCardClick);
  trendingSection?.addEventListener('click', handleCardClick);

  const handleCardButtonClick = (e) => {
    const btn = e.target.closest('.btn-watchlist');
    if (!btn) return;
    e.stopPropagation();

    const { id: imdbId, title, year, poster, rating } = btn.dataset;
    const movieObj = { imdbID: imdbId, Title: title, Year: year, Poster: poster, imdbRating: rating };

    const isAdding = !isInWatchlist(imdbId);
    if (isAdding) {
      addToWatchlist(movieObj);
      updateCardButton(imdbId, true);
      showToast(`"${title}" added to Watchlist ✓`, 'success');
      const rect = btn.getBoundingClientRect();
      runConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
      removeFromWatchlist(imdbId);
      updateCardButton(imdbId, false);
      showToast(`"${title}" removed from Watchlist`, 'remove');
    }

    const modalBtn = document.querySelector('.modal-watchlist-btn');
    if (modalBtn && modalBtn.dataset.id === imdbId) {
      modalBtn.textContent = isAdding ? '✓ In Watchlist' : '＋ Add to Watchlist';
      modalBtn.className = isAdding ? 'btn-watchlist in-list modal-watchlist-btn' : 'btn-watchlist modal-watchlist-btn';
    }

    updateWatchlistBadge();
    if (activeScreen === 'watchlist') setTimeout(renderWatchlistScreen, 300);
  };

  discoverResults?.addEventListener('click', handleCardButtonClick);
  watchlistGrid?.addEventListener('click', handleCardButtonClick);
  trendingSection?.addEventListener('click', handleCardButtonClick);
  document.getElementById('movie-modal')?.addEventListener('click', handleCardButtonClick);

  randomBtn?.addEventListener('click', () => {
    const movie = getRandomMovie();
    if (!movie) return;
    const card = watchlistGrid?.querySelector(`.movie-card[data-id="${movie.imdbID}"]`);
    if (!card) return;
    document.querySelectorAll('.spotlight').forEach(el => el.classList.remove('spotlight'));
    card.classList.add('spotlight');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`🎲 Tonight: "${movie.Title}"`, 'success');
    const rect = card.getBoundingClientRect();
    runConfetti(rect.left + rect.width / 2, rect.top + rect.height / 3);
    setTimeout(() => card.classList.remove('spotlight'), 3000);
  });

  document.getElementById('surprise-btn')?.addEventListener('click', () => {
    if (!trendingMovies.length) {
      showToast('Still loading movies, try again in a moment!', 'remove');
      return;
    }
    const filtered = selectedGenre === 'All'
      ? trendingMovies
      : trendingMovies.filter(m => m.Genre && m.Genre.includes(selectedGenre));
    if (!filtered.length) return;
    const randomMovie = filtered[Math.floor(Math.random() * filtered.length)];
    openMovieModal(randomMovie.imdbID, randomMovie);
    showToast(`🎲 How about "${randomMovie.Title}"?`, 'success');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      showScreen('discover');
      searchInput?.focus();
    }
  });

  updateWatchlistBadge();

  if (config.apiKey === 'YOUR_OMDB_API_KEY') {
    trendingSection?.classList.add('hidden');
    discoverResults?.classList.remove('hidden');
    renderEmptyState('discover-results', 'no-key');
  } else {
    loadTrending();
  }

});
