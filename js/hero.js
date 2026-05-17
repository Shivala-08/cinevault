let heroInterval;
let currentHeroIndex = 0;
let heroMovies = [];

const renderHeroContent = (movie) => {
  if (!movie) return;
  const titleEl = document.getElementById('hero-title');
  const subEl = document.getElementById('hero-subtitle');
  const bgEl = document.getElementById('hero-bg-image');
  const metaEl = document.getElementById('hero-meta');
  const trailerBtn = document.getElementById('hero-trailer-btn');
  const infoBtn = document.getElementById('hero-info-btn');
  const watchBtn = document.getElementById('hero-watchlist-btn');

  if (titleEl) titleEl.textContent = movie.Title;
  if (subEl) subEl.textContent = movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'Experience cinema like never before.';
  
  if (bgEl) {
    // using a high quality placeholder for hero bg since OMDB posters are small
    // In a real app this would be a backdrop image from TMDB
    const bgUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop';
    bgEl.style.backgroundImage = `url('${bgUrl}')`;
    
    // Some styling trick to make it look like a backdrop
    bgEl.style.backgroundSize = 'cover';
    bgEl.style.backgroundPosition = 'center 20%';
    bgEl.style.filter = 'blur(10px) brightness(0.6)';
    bgEl.style.transform = 'scale(1.1)';
  }

  if (metaEl) {
    metaEl.innerHTML = `
      <span>${movie.Year}</span>
      <span style="color:#FFC107">⭐ ${movie.imdbRating}</span>
      <span style="border:1px solid rgba(255,255,255,0.3); padding:2px 6px; border-radius:4px;">${movie.Rated || 'PG-13'}</span>
      <span>${movie.Runtime || '120 min'}</span>
    `;
  }

  if (trailerBtn) trailerBtn.onclick = () => openTrailerModal(movie.imdbID);
  if (infoBtn) infoBtn.onclick = () => openMovieModal(movie.imdbID);
  
  if (watchBtn) {
    const inWatchlist = isInWatchlist(movie.imdbID);
    watchBtn.innerHTML = inWatchlist 
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="20 6 9 17 4 12"></polyline></svg> In Watchlist`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add to Watchlist`;
    watchBtn.onclick = () => {
      if (isInWatchlist(movie.imdbID)) {
        removeFromWatchlist(movie.imdbID);
        showToast('Removed from watchlist', 'remove');
      } else {
        addToWatchlist(movie);
        showToast('Added to watchlist');
      }
      renderHeroContent(movie);
      updateCardButton(movie.imdbID, isInWatchlist(movie.imdbID));
    };
  }

  // Update dots
  const dotsContainer = document.getElementById('hero-dots');
  if (dotsContainer) {
    dotsContainer.innerHTML = heroMovies.map((m, i) => 
      `<button class="hero-dot ${i === currentHeroIndex ? 'active' : ''}" onclick="setHero(${i})" aria-label="Go to slide ${i+1}"></button>`
    ).join('');
  }
};

window.setHero = (index) => {
  currentHeroIndex = index;
  renderHeroContent(heroMovies[index]);
  resetHeroTimer();
};

const resetHeroTimer = () => {
  clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    currentHeroIndex = (currentHeroIndex + 1) % heroMovies.length;
    renderHeroContent(heroMovies[currentHeroIndex]);
  }, 8000);
};

const initHero = async () => {
  const skel = document.getElementById('hero-skeleton');
  const content = document.getElementById('hero-content');
  if (skel) skel.classList.remove('hidden');
  if (content) content.style.opacity = '0';

  const trending = await fetchCategoryMovies('trending');
  if (trending && trending.length > 0) {
    heroMovies = trending.slice(0, 5); // Take top 5 for hero
    renderHeroContent(heroMovies[0]);
    resetHeroTimer();
  }

  if (skel) skel.classList.add('hidden');
  if (content) {
    content.style.opacity = '1';
    content.style.transition = 'opacity 0.5s ease';
  }
};
