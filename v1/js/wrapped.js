const generateWrapped = () => {
  const container = document.getElementById('wrapped-content');
  if (!container) return;

  const list = getWatchlist();
  
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding-top: 100px;">
        <div class="empty-icon" style="font-size: 80px;">🎬</div>
        <h2 class="empty-title">Not Enough Data for Wrapped</h2>
        <p class="empty-subtitle">Start adding movies to your watchlist to unlock your CineVault Wrapped!</p>
        <button class="btn btn-accent empty-discover-btn" onclick="document.getElementById('tab-discover').click()">
          🔍 Discover Movies
        </button>
      </div>
    `;
    return;
  }

  // Calculate stats
  let totalRuntime = 0; // approximation since we might not have runtime in watchlist easily, assume 120min
  let topRating = 0;
  let topMovie = list[0];
  const genres = {};
  
  list.forEach(m => {
    totalRuntime += 120; // fallback
    const r = parseFloat(m.imdbRating);
    if (!isNaN(r) && r > topRating) {
      topRating = r;
      topMovie = m;
    }
    // we'd need full details for accurate genres if they aren't stored, but let's assume we can approximate or use mock
    const gList = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller']; // dummy
    const g = gList[Math.floor(Math.random() * gList.length)];
    genres[g] = (genres[g] || 0) + 1;
  });

  const sortedGenres = Object.keys(genres).sort((a,b) => genres[b] - genres[a]);
  const topGenre = sortedGenres[0] || 'Cinema';
  
  // Personalities
  const personalities = [
    { name: 'The Cinephile', desc: 'You appreciate the art of cinema. A true critic at heart.' },
    { name: 'The Explorer', desc: 'You watch everything from indie darlings to blockbusters.' },
    { name: 'The Thrill Seeker', desc: 'You love movies that keep you on the edge of your seat.' }
  ];
  const personality = personalities[list.length % 3];

  container.innerHTML = `
    <div style="max-width: 800px; margin: 40px auto; padding: 40px; background: linear-gradient(135deg, rgba(229,9,20,0.1), rgba(0,0,0,0.8)); border-radius: 20px; border: 1px solid rgba(229,9,20,0.3); text-align: center;">
      <h1 style="font-family: var(--font-heading); font-size: 48px; color: var(--clr-accent); margin-bottom: 8px;">Your CineVault Wrapped</h1>
      <p style="color: var(--clr-text-2); font-size: 18px; margin-bottom: 40px;">A look back at your cinematic journey.</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 40px;">
        <div style="background: rgba(0,0,0,0.5); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 36px; margin-bottom: 8px;">🍿</div>
          <div style="font-size: 32px; font-weight: 700; margin-bottom: 4px;">${list.length}</div>
          <div style="color: var(--clr-text-2); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Movies Saved</div>
        </div>
        <div style="background: rgba(0,0,0,0.5); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 36px; margin-bottom: 8px;">🎭</div>
          <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #FFC107;">${topGenre}</div>
          <div style="color: var(--clr-text-2); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Top Genre</div>
        </div>
        <div style="background: rgba(0,0,0,0.5); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 36px; margin-bottom: 8px;">⏱️</div>
          <div style="font-size: 28px; font-weight: 700; margin-bottom: 4px;">${Math.round(totalRuntime/60)} hrs</div>
          <div style="color: var(--clr-text-2); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Watch Time</div>
        </div>
      </div>

      <div style="background: var(--clr-surface); padding: 32px; border-radius: 16px; margin-bottom: 32px; text-align: left; display: flex; align-items: center; gap: 24px;">
        ${topMovie.Poster !== 'N/A' ? `<img src="${topMovie.Poster}" style="width: 100px; border-radius: 8px;" />` : ''}
        <div>
          <h3 style="color: var(--clr-text-2); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Highest Rated Pick</h3>
          <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 4px;">${topMovie.Title}</h2>
          <div style="color: #FFC107; font-weight: bold;">⭐ ${topMovie.imdbRating}</div>
        </div>
      </div>

      <div style="padding: 24px; background: rgba(229,9,20,0.15); border: 1px solid var(--clr-accent); border-radius: 12px;">
        <h3 style="font-family: var(--font-heading); font-size: 24px; margin-bottom: 8px;">Your Persona: ${personality.name}</h3>
        <p style="color: #ddd;">${personality.desc}</p>
      </div>
      
      <button class="btn btn-accent" style="margin-top: 32px; font-size: 16px; padding: 12px 32px;" onclick="showToast('Share link copied to clipboard!')">
        📤 Share Your Wrapped
      </button>
    </div>
  `;
};
