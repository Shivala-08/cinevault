import { Movie, PaginatedResponse } from "@/types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const fetchTrendingMovies = async (page: number = 1): Promise<Movie[]> => {
  const res = await fetch(
    `${TMDB_BASE_URL}/trending/movie/day?api_key=${API_KEY}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  const data = await res.json();
  return data.results;
};

export const fetchPaginatedTrendingMovies = async (page: number = 1): Promise<PaginatedResponse<Movie>> => {
  const res = await fetch(
    `${TMDB_BASE_URL}/trending/movie/day?api_key=${API_KEY}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  return res.json();
};

export const fetchMoviesByMood = async (genreIds: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  const res = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreIds}&page=${page}&sort_by=popularity.desc`
  );
  if (!res.ok) throw new Error("Failed to fetch mood movies");
  return res.json();
};

export const fetchMovieDetails = async (id: number) => {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits,similar`
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
};

export const getImageUrl = (path: string | null, size: "w500" | "original" = "w500") => {
  if (!path) return "/placeholder-movie.png"; // Fallback if no image
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
