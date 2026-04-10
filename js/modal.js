const openMovieModal = async (imdbId, basicMovie) => {
  const overlay = document.getElementById('movie-modal');
  const content = document.getElementById('modal-content');
  if (!overlay || !content) return;

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  content.innerHTML = `
    <div class="modal-skeleton">
      <div class="modal-skeleton-poster skeleton"></div>
      <div class="modal-skeleton-body">
        <div class="skeleton" style="height:28px;width:70%;margin-bottom:12px;border-radius:6px;"></div>
        <div class="skeleton" style="height:14px;width:45%;margin-bottom:20px;border-radius:6px;"></div>
        <div class="skeleton" style="height:12px;width:100%;margin-bottom:8px;border-radius:4px;"></div>
        <div class="skeleton" style="height:12px;width:90%;margin-bottom:8px;border-radius:4px;"></div>
        <div class="skeleton" style="height:12px;width:75%;margin-bottom:20px;border-radius:4px;"></div>
        <div class="skeleton" style="height:40px;width:160px;border-radius:8px;"></div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => overlay.classList.add('open'));

  const movie = await fetchMovieDetails(imdbId);
  if (!movie) {
    content.innerHTML = `
      <div class="modal-error">
        <div style="font-size:48px;">⚠️</div>
        <p style="color:var(--clr-text-2);margin-top:12px;">Could not load movie details.</p>
      </div>`;
    return;
  }

  const poster = (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : null;
  const ratingColor = getRatingColor(movie.imdbRating);
  const inWatchlist = isInWatchlist(imdbId);

  const metaItems = [
    movie.Year && `<span class="modal-meta-chip">${movie.Year}</span>`,
    movie.Runtime && movie.Runtime !== 'N/A' && `<span class="modal-meta-chip">⏱ ${movie.Runtime}</span>`,
    movie.Rated && movie.Rated !== 'N/A' && `<span class="modal-meta-chip">${movie.Rated}</span>`,
    movie.imdbRating && movie.imdbRating !== 'N/A' && `<span class="modal-meta-chip modal-rating-chip" style="color:${ratingColor};border-color:${ratingColor};">⭐ ${movie.imdbRating}/10</span>`,
    movie.Metascore && movie.Metascore !== 'N/A' && `<span class="modal-meta-chip" style="color:#52b7ff;border-color:#52b7ff;">M ${movie.Metascore}</span>`,
  ].filter(Boolean).join('');

  const genres = (movie.Genre && movie.Genre !== 'N/A')
    ? movie.Genre.split(',').map(g => `<span class="modal-genre-tag">${g.trim()}</span>`).join('')
    : '';

  const infoRows = [
    movie.Director && movie.Director !== 'N/A' && `<div class="modal-info-row"><span class="modal-info-label">Director</span><span class="modal-info-value">${movie.Director}</span></div>`,
    movie.Writer && movie.Writer !== 'N/A' && `<div class="modal-info-row"><span class="modal-info-label">Writer</span><span class="modal-info-value">${movie.Writer.split(',').slice(0,2).join(', ')}</span></div>`,
    movie.Actors && movie.Actors !== 'N/A' && `<div class="modal-info-row"><span class="modal-info-label">Cast</span><span class="modal-info-value">${movie.Actors}</span></div>`,
    movie.Language && movie.Language !== 'N/A' && `<div class="modal-info-row"><span class="modal-info-label">Language</span><span class="modal-info-value">${movie.Language}</span></div>`,
    movie.Awards && movie.Awards !== 'N/A' && `<div class="modal-info-row"><span class="modal-info-label">Awards</span><span class="modal-info-value modal-awards">🏆 ${movie.Awards}</span></div>`,
  ].filter(Boolean).join('');

  const btnClass = inWatchlist ? 'btn-watchlist in-list modal-watchlist-btn' : 'btn-watchlist modal-watchlist-btn';
  const btnText  = inWatchlist ? '✓ In Watchlist' : '＋ Add to Watchlist';

  content.innerHTML = `
    <div class="modal-layout">
      <div class="modal-poster-col">
        ${poster
          ? `<img class="modal-poster" src="${poster}" alt="Poster for ${movie.Title}" />`
          : `<div class="modal-poster-placeholder">🎬</div>`
        }
      </div>
      <div class="modal-body-col">
        <h2 class="modal-title" id="modal-title">${movie.Title}</h2>
        <div class="modal-meta-row">${metaItems}</div>
        ${genres ? `<div class="modal-genres">${genres}</div>` : ''}
        ${(movie.Plot && movie.Plot !== 'N/A') ? `<p class="modal-plot">${movie.Plot}</p>` : ''}
        <div class="modal-info-grid">${infoRows}</div>
        <div class="modal-actions">
          <button
            class="${btnClass}"
            data-id="${movie.imdbID}"
            data-title="${movie.Title}"
            data-year="${movie.Year || ''}"
            data-poster="${movie.Poster || ''}"
            data-rating="${movie.imdbRating || 'N/A'}"
            aria-label="${inWatchlist ? 'Remove' : 'Add'} ${movie.Title} ${inWatchlist ? 'from' : 'to'} watchlist"
          >${btnText}</button>
          <a
            class="modal-imdb-link"
            href="https://www.imdb.com/title/${movie.imdbID}/"
            target="_blank"
            rel="noopener"
            aria-label="View on IMDb"
          >IMDb ↗</a>
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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modal-close')?.addEventListener('click', closeMovieModal);

  document.getElementById('movie-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('movie-modal')) closeMovieModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('movie-modal');
      if (modal && !modal.classList.contains('hidden')) closeMovieModal();
    }
  });
});
