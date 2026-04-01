/**
 * app.js — CineVault application entry point
 * Handles tab switching, search, pagination, trending, genre filter, sort, and watchlist
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── State ─────────────────────────────────────────────── */
  let currentQuery   = '';
  let currentPage    = 1;
  let totalResults   = 0;
  let isLoading      = false;
  let activeScreen   = 'discover';
  let trendingMovies = [];
  let selectedGenre  = 'All';
  let currentMovies  = [];
  let currentSort    = 'default';

  /* ─── DOM refs ──────────────────────────────────────────── */
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

  /* ─── Helpers ───────────────────────────────────────────── */

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

  /* ─── Trending View ─────────────────────────────────────── */

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

  /* ─── Trending Sort Handler ─────────────────────────────── */

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

  /* ─── Sort Handler (search results) ─────────────────────── */

  const handleSortChange = (newSort) => {
    currentSort = newSort;
    const sorted = applySortToMovies(currentMovies, newSort);
    renderMovieCards(sorted, 'discover-results');
    renderSortBar('sort-filter-bar', newSort, totalResults, false, handleSortChange);
  };

  /* ─── Tab Switching ─────────────────────────────────────── */

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

  /* ─── Search ────────────────────────────────────────────── */

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

  /* ─── Watchlist Screen ──────────────────────────────────── */

  const renderWatchlistScreen = () => {
    const list = getWatchlist();
    updateWatchlistBadge();
    if (randomBtn) randomBtn.classList.toggle('hidden', list.length === 0);
    if (list.length === 0) {
      renderEmptyState('watchlist-grid', 'watchlist');
      setTimeout(() => {
        document.getElementById('empty-discover-btn')?.addEventListener('click', () => showScreen('discover'));
      }, 0);
      return;
    }
    renderMovieCards(list, 'watchlist-grid');
  };

  /* ─── Card Button Click (event delegation) ──────────────── */

  const handleCardButtonClick = (e) => {
    const btn = e.target.closest('.btn-watchlist');
    if (!btn) return;
    e.stopPropagation();

    const { id: imdbId, title, year, poster, rating } = btn.dataset;
    const movieObj = { imdbID: imdbId, Title: title, Year: year, Poster: poster, imdbRating: rating };

    if (isInWatchlist(imdbId)) {
      removeFromWatchlist(imdbId);
      updateCardButton(imdbId, false);
      showToast(`"${title}" removed from Watchlist`, 'remove');
    } else {
      addToWatchlist(movieObj);
      updateCardButton(imdbId, true);
      showToast(`"${title}" added to Watchlist ✓`, 'success');
    }

    updateWatchlistBadge();
    if (activeScreen === 'watchlist') setTimeout(renderWatchlistScreen, 300);
  };

  discoverResults?.addEventListener('click', handleCardButtonClick);
  watchlistGrid?.addEventListener('click', handleCardButtonClick);
  trendingSection?.addEventListener('click', handleCardButtonClick);

  /* ─── Random Movie Night ────────────────────────────────── */

  randomBtn?.addEventListener('click', () => {
    const movie = getRandomMovie();
    if (!movie) return;
    const card = watchlistGrid?.querySelector(`.movie-card[data-id="${movie.imdbID}"]`);
    if (!card) return;
    document.querySelectorAll('.spotlight').forEach(el => el.classList.remove('spotlight'));
    card.classList.add('spotlight');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`🎲 Tonight: "${movie.Title}"`, 'success');
    setTimeout(() => card.classList.remove('spotlight'), 3000);
  });

  /* ─── Keyboard Navigation ───────────────────────────────── */

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      showScreen('discover');
      searchInput?.focus();
    }
  });

  /* ─── Initial Load ──────────────────────────────────────── */

  updateWatchlistBadge();

  if (config.apiKey === 'YOUR_OMDB_API_KEY') {
    trendingSection?.classList.add('hidden');
    discoverResults?.classList.remove('hidden');
    renderEmptyState('discover-results', 'no-key');
  } else {
    loadTrending();
  }

});
