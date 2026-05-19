"use client";

import { useWatchlistStore } from "@/store/useWatchlistStore";
import { MovieCard } from "@/components/home/MovieCard";
import { Navbar } from "@/components/layout/Navbar";

export default function WatchlistPage() {
  const { watchlist } = useWatchlistStore();

  return (
    <main className="flex-1 flex flex-col relative w-full min-h-screen">
      <Navbar />
      <div className="px-6 md:px-12 py-32 relative z-10 bg-background flex-1">
        <h1 className="text-4xl font-bold text-white mb-8">My Watchlist</h1>
        
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-secondary-foreground">
            <p className="text-xl mb-4">Your watchlist is currently empty.</p>
            <p>Explore movies and add them to your list!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {watchlist.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
