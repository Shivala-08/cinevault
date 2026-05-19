import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "@/types/movie";

interface WatchlistState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (movie) => {
        if (!get().isInWatchlist(movie.id)) {
          set((state) => ({ watchlist: [...state.watchlist, movie] }));
        }
      },
      removeFromWatchlist: (movieId) => {
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== movieId),
        }));
      },
      isInWatchlist: (movieId) => {
        return get().watchlist.some((m) => m.id === movieId);
      },
    }),
    {
      name: "cinevault-watchlist",
    }
  )
);
