document.addEventListener('DOMContentLoaded', () => {

  // Global State
  let currentQuery = '';
  let currentPage = 1;
  let totalResults = 0;
  let isLoading = false;
  let activeScreen = 'discover';
  let selectedGenre = 'All';
  let trendingMovies = [];

  // DOM Elements
  const tabs = {
    discover: document.getElementById('tab-discover'),
    watchlist: document.getElementById('tab-watchlist'),
    wrapped: document.getElementById('tab-wrapped')
  };
  const screens = {
    discover: document.getElementById('discover-screen'),
    watchlist: document.getElementById('watchlist-screen'),
    wrapped: document.getElementById('wrapped-screen')
  };

  const searchInput = document.getElementById('search-input');
  const searchInputMob = document.getElementById('search-input-mobile');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchClearMobBtn = document.getElementById('search-clear-mobile-btn');
  const searchSuggestions = document.getElementById('search-suggestions');

  const logoBtn = document.getElementById('logo-btn');
  const navbar = document.getElementById('navbar');

  // Intro Animation
  setTimeout(() => {
    const intro = document.getElementById('intro-overlay');
    if (intro) {
      intro.style.opacity = '0';
      intro.style.visibility = 'hidden';
      setTimeout(() => intro.remove(), 1000);
    }
    initApp();
  }, 2000); // 2 second cinematic intro

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.add('scrolled'); // Force dark for now to match PRD
    }
  });
  navbar.classList.add('scrolled');

  // Navigation Logic
  const showScreen = (screenName) => {
    activeScreen = screenName;
    
    // Update tabs
    Object.keys(tabs).forEach(k => {
      const isAct = k === screenName;
      if (tabs[k]) {
        tabs[k].classList.toggle('active', isAct);
        tabs[k].setAttribute('aria-selected', isAct);
      }
    });

    // Update screens
    Object.keys(screens).forEach(k => {
      const isAct = k === screenName;
      if (screens[k]) {
        screens[k].classList.toggle('active', isAct);
        screens[k].classList.toggle('hidden', !isAct);
      }
    });

    if (screenName === 'watchlist') renderWatchlistScreen();
    if (screenName === 'wrapped') generateWrapped();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  Object.keys(tabs).forEach(k => {
    if (tabs[k]) {
      tabs[k].addEventListener('click', () => showScreen(k));
    }
  });

  if (logoBtn) logoBtn.addEventListener('click', () => {
    clearSearch();
    showScreen('discover');
  });

  // Watchlist Rendering
  const renderWatchlistScreen = () => {
    const list = getWatchlist();
    const countEl = document.getElementById('watchlist-count');
    const badgeEl = document.getElementById('watchlist-badge');
    const randomBtn = document.getElementById('random-btn');
    const grid = document.getElementById('watchlist-grid');

    if (countEl) countEl.textContent = `${list.length} movies`;
    if (badgeEl) {
      badgeEl.textContent = list.length;
      badgeEl.classList.toggle('hidden', list.length === 0);
    }
    if (randomBtn) randomBtn.classList.toggle('hidden', list.length === 0);

    if (list.length === 0) {
      renderEmptyState('watchlist-grid', 'watchlist');
      setTimeout(() => {
        document.querySelector('.empty-discover-btn')?.addEventListener('click', () => showScreen('discover'));
      }, 0);
    } else {
      renderMovieCards(list, 'watchlist-grid');
    }
  };

  // Search Logic
  const syncSearchInputs = (value) => {
    if (searchInput) searchInput.value = value;
    if (searchInputMob) searchInputMob.value = value;
    if (searchClearBtn) searchClearBtn.classList.toggle('hidden', !value);
    if (searchClearMobBtn) searchClearMobBtn.classList.toggle('hidden', !value);
  };

  const clearSearch = () => {
    syncSearchInputs('');
    currentQuery = '';
    document.getElementById('trending-section')?.classList.remove('hidden');
    document.getElementById('hero-section')?.classList.remove('hidden');
    document.getElementById('discover-results')?.classList.add('hidden');
    document.getElementById('mood-results-section')?.classList.add('hidden');
    if (searchSuggestions) searchSuggestions.classList.add('hidden');
  };

  if (searchClearBtn) searchClearBtn.addEventListener('click', clearSearch);
  if (searchClearMobBtn) searchClearMobBtn.addEventListener('click', clearSearch);

  const performSearch = async (query, page = 1) => {
    if (!query || query.length < 2) return;
    
    document.getElementById('trending-section')?.classList.add('hidden');
    document.getElementById('hero-section')?.classList.add('hidden');
    document.getElementById('mood-results-section')?.classList.add('hidden');
    
    const resultsContainer = document.getElementById('discover-results');
    resultsContainer.classList.remove('hidden');
    
    if (page === 1) renderSkeletons(8, 'discover-results');
    
    const res = await fetchMovies(query, page);
    if (!res) {
      renderEmptyState('discover-results', 'error');
      return;
    }
    if (res.movies.length === 0) {
      renderEmptyState('discover-results', 'no-results');
      return;
    }
    
    renderMovieCards(res.movies, 'discover-results');
  };

  const handleSearchInput = debounce(async (e) => {
    const value = e.target.value;
    syncSearchInputs(value);
    if (!value.trim()) {
      clearSearch();
      return;
    }
    
    // Quick suggestions logic
    if (searchSuggestions && window.innerWidth > 768) {
      const res = await fetchMovies(value, 1);
      if (res && res.movies.length > 0) {
        searchSuggestions.innerHTML = res.movies.slice(0, 5).map(m => `
          <div class="suggestion-item" data-id="${m.imdbID}">
            <img class="suggestion-poster" src="${m.Poster !== 'N/A' ? m.Poster : ''}" />
            <div class="suggestion-info">
              <span class="suggestion-title">${m.Title}</span>
              <span class="suggestion-year">${m.Year}</span>
            </div>
          </div>
        `).join('');
        searchSuggestions.classList.remove('hidden');
        
        searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
          item.addEventListener('click', () => {
            searchSuggestions.classList.add('hidden');
            openMovieModal(item.dataset.id);
          });
        });
      } else {
        searchSuggestions.classList.add('hidden');
      }
    }
  }, 300);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      const value = e.target.value.trim();
      if (searchSuggestions) searchSuggestions.classList.add('hidden');
      if (value) performSearch(value);
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keypress', handleSearchSubmit);
  }
  if (searchInputMob) {
    searchInputMob.addEventListener('input', handleSearchInput);
    searchInputMob.addEventListener('keypress', handleSearchSubmit);
  }

  // Click outside suggestions to close
  document.addEventListener('click', (e) => {
    if (searchSuggestions && !e.target.closest('.search-input-wrap')) {
      searchSuggestions.classList.add('hidden');
    }
  });

  // Global click delegate for movie cards
  document.addEventListener('click', (e) => {
    // Info btn or card click (excluding watchlist btn and trailer btn)
    const card = e.target.closest('.movie-card');
    const infoBtn = e.target.closest('.btn-info');
    const trailerBtn = e.target.closest('.btn-play-trailer');
    const wlBtn = e.target.closest('.btn-watchlist-toggle');

    if (trailerBtn) {
      openTrailerModal(trailerBtn.dataset.id);
      return;
    }

    if (wlBtn) {
      const { id, title, year, poster, rating } = wlBtn.dataset;
      const movie = { imdbID: id, Title: title, Year: year, Poster: poster, imdbRating: rating };
      if (isInWatchlist(id)) {
        removeFromWatchlist(id);
        showToast('Removed from watchlist', 'remove');
      } else {
        addToWatchlist(movie);
        showToast('Added to watchlist');
        const rect = wlBtn.getBoundingClientRect();
        runConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      updateCardButton(id, isInWatchlist(id));
      renderWatchlistScreen(); // Background update badge
      return;
    }

    if (infoBtn || (card && !e.target.closest('.card-actions'))) {
      const id = (infoBtn || card).dataset.id;
      if (id) openMovieModal(id);
    }
  });

  // Mood Discovery Logic
  const moodCards = document.querySelectorAll('.mood-card');
  const moodResultsSection = document.getElementById('mood-results-section');
  const moodResultsTitle = document.getElementById('mood-results-title');
  const moodBackBtn = document.getElementById('mood-back-btn');

  moodCards.forEach(card => {
    card.addEventListener('click', async () => {
      const mood = card.dataset.mood;
      const genres = card.dataset.genres;
      
      document.getElementById('trending-section')?.classList.add('hidden');
      document.getElementById('hero-section')?.classList.add('hidden');
      
      moodResultsSection.classList.remove('hidden');
      moodResultsTitle.textContent = `${mood} Picks`;
      
      renderSkeletons(4, 'mood-results');
      
      // We simulate mood search by doing a generic search for one of the genres or a curated list
      // For demo, we'll fetch a random popular category
      const picks = await fetchCategoryMovies('trending');
      // Shuffle array for randomness feel
      const shuffled = picks.sort(() => 0.5 - Math.random());
      
      renderMovieCards(shuffled.slice(0, 8), 'mood-results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  if (moodBackBtn) {
    moodBackBtn.addEventListener('click', () => {
      moodResultsSection.classList.add('hidden');
      document.getElementById('trending-section')?.classList.remove('hidden');
      document.getElementById('hero-section')?.classList.remove('hidden');
    });
  }

  // Surprise Me logic
  document.getElementById('surprise-btn')?.addEventListener('click', () => {
    if (trendingMovies.length === 0) return;
    const randomMovie = trendingMovies[Math.floor(Math.random() * trendingMovies.length)];
    openMovieModal(randomMovie.imdbID);
  });

  // Init AI sections
  const initAIArea = async () => {
    const categories = ['hidden-gems', 'mind-bending', 'binge-picks'];
    for (const cat of categories) {
      renderSkeletons(4, `ai-${cat}`);
      const movies = await fetchCategoryMovies(cat);
      renderMovieCards(movies, `ai-${cat}`);
    }
  };

  // Main Init
  const initApp = async () => {
    renderWatchlistScreen();
    
    if (config.apiKey === 'YOUR_OMDB_API_KEY') {
      renderEmptyState('discover-results', 'no-key');
      document.getElementById('discover-results').classList.remove('hidden');
      return;
    }

    initHero();
    
    // Init Trending
    renderSkeletons(10, 'trending-grid');
    trendingMovies = await fetchCategoryMovies('trending');
    renderMovieCards(trendingMovies.slice(0, 10), 'trending-grid');

    initAIArea();
  };

});
