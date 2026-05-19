"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MovieCard } from "./MovieCard";
import { Movie } from "@/types/movie";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return [];
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      return data.results.filter((item: any) => item.media_type === "movie" || item.media_type === "tv") as Movie[];
    },
    enabled: query.length > 2,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-md">
          {/* Header */}
          <div className="w-full p-6 md:px-12 md:py-8 flex items-center gap-4 border-b border-border">
            <Search className="w-6 h-6 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search movies, actors, genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-2xl md:text-4xl font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
            />
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
              <X className="w-8 h-8 text-foreground" />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
            {query.length > 2 && isLoading && (
              <div className="text-center text-muted-foreground">Searching cinematic universe...</div>
            )}
            
            {query.length > 2 && !isLoading && results?.length === 0 && (
              <div className="text-center text-muted-foreground text-xl">No matching movies found for "{query}"</div>
            )}

            {results && results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            )}
            
            {!query && (
              <div className="flex flex-col items-center justify-center h-full opacity-50 text-center pointer-events-none">
                <Search className="w-24 h-24 mb-6 text-muted-foreground" />
                <p className="text-2xl font-semibold">What are you in the mood for?</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
