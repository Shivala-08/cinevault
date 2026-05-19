export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const PLACEHOLDER_IMAGE = "/placeholder-movie.png";

export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  heroAutoRotate: 8000,
};

export const API_ROUTES = {
  trendingMovies: "/trending/movie/day",
  movieDetails: (id: number) => `/movie/${id}?append_to_response=videos,credits,similar`,
  discoverMovies: "/discover/movie",
  searchMulti: "/search/multi",
};
