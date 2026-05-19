export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Movie {
  id: number;
  title?: string;
  name?: string; // For TV shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  genres?: Genre[];
  videos?: {
    results: Video[];
  };
  credits?: {
    cast: Cast[];
  };
  similar?: {
    results: Movie[];
  };
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
