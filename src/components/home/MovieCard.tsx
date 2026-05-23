"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { Movie } from "@/types/movie";
import { Play, Plus, Check } from "lucide-react";
import { useState } from "react";
import { TrailerModal } from "./TrailerModal";
import { useWatchlistStore } from "@/store/useWatchlistStore";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export function MovieCard({ movie, index }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group origin-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
        whileHover={{
          scale: 1.05,
          zIndex: 10,
          boxShadow: "0px 10px 30px rgba(229, 9, 20, 0.3)", // Glow effect with primary color
        }}
      >
        {/* Movie Poster */}
        <Image
          src={getImageUrl(movie.poster_path)}
          alt={movie.title || movie.name || "Movie Poster"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          priority={index < 8}
        />

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4"
        >
          <h3 className="text-white font-bold text-sm md:text-base line-clamp-1 mb-1">
            {movie.title || movie.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-300 mb-3">
            <span className="font-semibold text-green-400">
              {Math.round((movie.vote_average || 0) * 10)}% Match
            </span>
            <span>{(movie.release_date || movie.first_air_date || "").split("-")[0]}</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex-1 bg-white text-black py-1.5 px-1 rounded flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-colors">
              <Play className="w-3 sm:w-4 h-3 sm:h-4 fill-current" /> Play
            </button>
            <button 
              onClick={handleWatchlistToggle}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${inWatchlist ? 'border-primary bg-primary/20 hover:bg-primary/40' : 'border-gray-400 hover:border-white hover:bg-white/20'}`}
            >
              {inWatchlist ? <Check className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-white" />}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Trailer Modal */}
      {isModalOpen && (
        <TrailerModal
          movieId={movie.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
