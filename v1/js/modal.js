const openMovieModal = async (imdbId) => {
  const overlay = document.getElementById('movie-modal');
  const content = document.getElementById('modal-content');
  if (!overlay || !content) return;

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Skeleton state
  content.innerHTML = `
    <div class="modal-layout">
      <div class="skeleton" style="width:100%; aspect-ratio:2/3; border-radius:12px;"></div>
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div class="skeleton" style="height:40px; width:70%;"></div>
        <div class="skeleton" style="height:20px; width:40%;"></div>
        <div class="skeleton" style="height:100px; width:100%;"></div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => overlay.classList.add('open'));

  const movie = await fetchMovieDetails(imdbId);
  if (!movie) {
    content.innerHTML = `<div style="padding:40px; text-align:center;">Failed to load details.</div>`;
    return;
  }

  const poster = (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : null;
  const inWatchlist = isInWatchlist(imdbId);

  content.innerHTML = `
    <div class="modal-layout">
      <div class="modal-poster-col">
        ${poster ? `<img class="modal-poster" src="${poster}" alt="${movie.Title}" />` : `<div style="background:#222; aspect-ratio:2/3;"></div>`}
      </div>
      <div class="modal-info-col">
        <h2 class="modal-title">${movie.Title}</h2>
        <div class="modal-meta-row">
          <span>${movie.Year}</span>
          <span class="modal-meta-chip">${movie.Rated}</span>
          <span>${movie.Runtime}</span>
          <span style="color:#FFC107">⭐ ${movie.imdbRating}</span>
        </div>
        <div class="genre-chips" style="margin-bottom:16px;">
          ${(movie.Genre || '').split(',').map(g => `<span class="genre-chip">${g.trim()}</span>`).join('')}
        </div>
        <p class="modal-plot">${movie.Plot}</p>
        <div style="font-size:14px; color:#aaa; line-height:1.6; margin-bottom: 24px;">
          <p><strong>Director:</strong> ${movie.Director}</p>
          <p><strong>Cast:</strong> ${movie.Actors}</p>
        </div>
        <div style="display:flex; gap:12px;">
          <button class="btn-surprise" onclick="openTrailerModal('${movie.imdbID}')">
            ▶ Watch Trailer
          </button>
          <button class="btn-surprise ${inWatchlist ? 'in-list' : ''}" style="background: ${inWatchlist ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}; color:#fff;" onclick="toggleWatchlistFromModal('${movie.imdbID}', '${movie.Title}', '${movie.Year}', '${movie.Poster}', '${movie.imdbRating}')">
            ${inWatchlist ? '✓ In Watchlist' : '＋ Add to Watchlist'}
          </button>
        </div>
      </div>
    </div>
  `;
};

const closeMovieModal = () => {
  const overlay = document.getElementById('movie-modal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => overlay.classList.add('hidden'), 300);
};

window.toggleWatchlistFromModal = (id, title, year, poster, rating) => {
  const movie = { imdbID: id, Title: title, Year: year, Poster: poster, imdbRating: rating };
  if (isInWatchlist(id)) {
    removeFromWatchlist(id);
    showToast(`Removed from watchlist`, 'remove');
  } else {
    addToWatchlist(movie);
    showToast(`Added to watchlist`);
  }
  updateCardButton(id, isInWatchlist(id));
  openMovieModal(id); // re-render modal
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modal-close')?.addEventListener('click', closeMovieModal);
  document.getElementById('movie-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('movie-modal')) closeMovieModal();
  });
});
