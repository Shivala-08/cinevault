"use client";

import { useEffect, useRef, useCallback } from "react";
import { MovieCard } from "./MovieCard";
import { MovieRowSkeleton } from "@/components/loaders/MovieCardSkeleton";
import { useInfiniteTrending } from "@/hooks/useInfiniteTrending";
import { Loader2 } from "lucide-react";

export function TrendingMovies() {
  const { 
    data, 
    isLoading, 
    isError, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteTrending();

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Fetch before hitting the exact bottom
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten the paginated arrays into one single array of movies
  const movies = data?.pages.flatMap((page) => page.results) || [];

  return (
    <section className="px-6 md:px-12 py-12 relative z-10 bg-background mt-[-100px] min-h-[50vh]">
      <h2 className="text-2xl font-semibold text-white mb-6">Trending Movies</h2>
      
      {isLoading && <MovieRowSkeleton />}

      {isError && (
        <div className="text-red-500 bg-red-900/20 p-4 rounded-md border border-red-900">
          Failed to load trending movies. Please check your API key and network connection.
        </div>
      )}

      {movies.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie: any, index: number) => (
              <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index % 20} />
            ))}
          </div>

          {/* Infinite Scroll Sentinel */}
          <div ref={observerTarget} className="w-full h-24 flex items-center justify-center mt-8">
            {isFetchingNextPage && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm font-medium animate-pulse">Loading more cinematic moments...</span>
              </div>
            )}
            {!hasNextPage && !isLoading && (
              <p className="text-muted-foreground font-medium">You've reached the end of the universe.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
