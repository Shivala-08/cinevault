"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingMovies, getImageUrl } from "@/lib/tmdb";
import { HeroSkeleton } from "@/components/loaders/HeroSkeleton";
import { ANIMATION_DURATIONS } from "@/utils/constants";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { TrailerModal } from "./TrailerModal";

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();

  const { data: movies, isLoading } = useQuery({
    queryKey: ["heroMovies"],
    queryFn: () => fetchTrendingMovies(1),
    select: (data) => data?.slice(0, 5) || [],
  });

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, ANIMATION_DURATIONS.heroAutoRotate);
    return () => clearInterval(interval);
  }, [movies]);

  if (isLoading) return <HeroSkeleton />;
  if (!movies || movies.length === 0) return null;

  const movie = movies[currentIndex];
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  };

  return (
    <section className="relative w-full h-[85vh] md:h-[95vh] flex items-center justify-start overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, "original")})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 px-6 md:px-12 w-full max-w-4xl mt-16 md:mt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${movie.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">
              Trending #{currentIndex + 1}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight mb-4 drop-shadow-xl line-clamp-2">
              {movie.title || movie.name}
            </h1>
            
            <div className="flex items-center gap-4 text-sm font-medium mb-6">
              <span className="text-green-400 font-bold">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
              <span className="text-gray-300">{(movie.release_date || movie.first_air_date || "").split("-")[0]}</span>
              <span className="border border-gray-600 text-gray-300 px-1.5 py-0.5 rounded text-xs">HD</span>
            </div>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8 leading-relaxed line-clamp-3 drop-shadow-md">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-full px-8 gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <Play className="w-5 h-5 fill-current" />
                Play Trailer
              </Button>
              <Button 
                onClick={handleWatchlistToggle}
                size="lg" 
                variant="secondary" 
                className={`backdrop-blur-md font-semibold rounded-full px-8 gap-2 shadow-lg transition-all ${inWatchlist ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30' : 'bg-secondary/50 text-foreground hover:bg-secondary border border-border hover:scale-105'}`}
              >
                {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {inWatchlist ? "In Watchlist" : "Add To Watchlist"}
              </Button>
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="icon" 
                variant="ghost" 
                className="rounded-full bg-secondary/30 backdrop-blur-md hover:bg-secondary border border-border h-11 w-11 shadow-lg hover:scale-105 transition-transform"
              >
                <Info className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Indicator Dots */}
      <div className="absolute bottom-12 left-6 md:left-12 z-20 flex gap-2">
        {movies?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-500 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      <TrailerModal
        movieId={movie.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
