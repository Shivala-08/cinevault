import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "@/types/movie";

interface FavoritesState {
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addToFavorites: (movie) => {
        if (!get().isFavorite(movie.id)) {
          set((state) => ({ favorites: [...state.favorites, movie] }));
        }
      },
      removeFromFavorites: (movieId) => {
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== movieId),
        }));
      },
      isFavorite: (movieId) => {
        return get().favorites.some((m) => m.id === movieId);
      },
    }),
    {
      name: "cinevault-favorites",
    }
  )
);
