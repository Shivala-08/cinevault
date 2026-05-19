window.openTrailerModal = async (imdbId) => {
  const overlay = document.getElementById('trailer-modal');
  const videoWrap = document.getElementById('trailer-video-wrap');
  const infoPanel = document.getElementById('trailer-info-panel');
  
  if (!overlay || !videoWrap) return;

  // Close info modal if open
  closeMovieModal();

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const videoId = getTrailerVideoId(imdbId);

  videoWrap.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;

  // Fetch quick info for panel
  infoPanel.innerHTML = '<div class="skeleton" style="height:20px; width:50%;"></div>';
  requestAnimationFrame(() => overlay.classList.add('open'));

  const movie = await fetchMovieDetails(imdbId);
  if (movie) {
    infoPanel.innerHTML = `
      <h3 style="font-size: 20px; margin-bottom: 8px;">${movie.Title}</h3>
      <p style="color: var(--clr-text-2); font-size: 14px;">
        ${movie.Year} • ${movie.Runtime} • ${movie.Genre}
      </p>
    `;
  }
};

const closeTrailerModal = () => {
  const overlay = document.getElementById('trailer-modal');
  const videoWrap = document.getElementById('trailer-video-wrap');
  if (!overlay) return;
  
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    overlay.classList.add('hidden');
    if (videoWrap) videoWrap.innerHTML = '';
  }, 300);
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('trailer-modal-close')?.addEventListener('click', closeTrailerModal);
  document.getElementById('trailer-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('trailer-modal')) closeTrailerModal();
  });
});
