"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Plus, Check, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails, getImageUrl } from "@/lib/tmdb";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";

interface TrailerModalProps {
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function TrailerModal({ movieId, isOpen, onClose }: TrailerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: movieDetails, isLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: isOpen,
  });

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const inWatchlist = movieDetails ? isInWatchlist(movieDetails.id) : false;
  const inFavorites = movieDetails ? isFavorite(movieDetails.id) : false;

  const handleWatchlistToggle = () => {
    if (!movieDetails) return;
    if (inWatchlist) removeFromWatchlist(movieDetails.id);
    else addToWatchlist(movieDetails);
  };

  const handleFavoriteToggle = () => {
    if (!movieDetails) return;
    if (inFavorites) removeFromFavorites(movieDetails.id);
    else addToFavorites(movieDetails);
  };

  // Try to find a Trailer, if not, find a Teaser, if not, any YouTube video
  const videos = movieDetails?.videos?.results || [];
  const trailer = videos.find((vid: any) => vid.type === "Trailer" && vid.site === "YouTube") 
    || videos.find((vid: any) => vid.type === "Teaser" && vid.site === "YouTube")
    || videos.find((vid: any) => vid.site === "YouTube");
  
  const cast = movieDetails?.credits?.cast?.slice(0, 5) || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-12 mt-12 sm:mt-0">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#141414] rounded-xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-[#181818]/50 hover:bg-[#181818] rounded-full flex items-center justify-center transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar">
            {/* Player / Hero Section */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {isLoading || !mounted ? (
                <div className="absolute inset-0 flex items-center justify-center text-white/50">
                  Loading cinematic experience...
                </div>
              ) : trailer ? (
                <div className="w-full h-full relative z-10 pt-4 pb-4">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&modestbranding=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{ backgroundImage: `url(${getImageUrl(movieDetails?.backdrop_path, "original")})` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-lg bg-black/80 px-4 py-2 rounded-md">Trailer currently unavailable.</p>
                  </div>
                </div>
              )}
              
              {/* Fade to content gradient */}
              <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none z-20" />
            </div>

            {/* Movie Info Section */}
            {movieDetails && (
              <div className="px-4 sm:px-6 md:px-8 pb-8 -mt-12 relative z-30 flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Poster Thumbnail */}
                <div className="w-32 md:w-48 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-gray-800 bg-[#141414] mx-auto md:mx-0 -mt-20 md:-mt-12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={getImageUrl(movieDetails.poster_path)} 
                    alt={movieDetails.title}
                    className="w-full h-auto object-cover block"
                  />
                </div>

                <div className="flex-1 mt-4 md:mt-0 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
                    {movieDetails.title || movieDetails.name}
                  </h2>
                  
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Left Column: Details & Overview */}
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                        <span className="text-green-400 font-bold">{Math.round((movieDetails.vote_average || 0) * 10)}% Match</span>
                        <span className="text-gray-300">{(movieDetails.release_date || movieDetails.first_air_date || "").split("-")[0]}</span>
                        <span className="border border-gray-600 text-gray-300 px-1.5 py-0.5 rounded text-xs">
                          {movieDetails.runtime || 120}m
                        </span>
                        <span className="text-gray-300">HD</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <button className="bg-white text-black px-6 py-2 rounded flex items-center justify-center gap-2 font-bold hover:bg-gray-200 transition-colors">
                          <Play className="w-5 h-5 fill-current" /> Play
                        </button>
                        <button 
                          onClick={handleWatchlistToggle}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${inWatchlist ? 'border-primary bg-primary/20' : 'border-gray-400 hover:border-white hover:bg-white/10'}`}
                        >
                          {inWatchlist ? <Check className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-white" />}
                        </button>
                        <button 
                          onClick={handleFavoriteToggle}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${inFavorites ? 'border-primary bg-primary/20' : 'border-gray-400 hover:border-white hover:bg-white/10'}`}
                        >
                          <ThumbsUp className={`w-5 h-5 ${inFavorites ? 'text-primary fill-primary' : 'text-white'}`} />
                        </button>
                      </div>

                      <p className="text-gray-100 leading-relaxed text-sm md:text-base text-left">
                        {movieDetails.overview}
                      </p>
                    </div>

                    {/* Right Column: Cast & Genres */}
                    <div className="w-full md:w-1/3 space-y-4 text-sm text-left">
                      <div className="text-gray-400">
                        <span className="text-gray-500 mr-2">Cast:</span>
                        <span className="text-gray-200">
                          {cast.map((c: any) => c.name).join(", ")}
                        </span>
                      </div>
                      <div className="text-gray-400">
                        <span className="text-gray-500 mr-2">Genres:</span>
                        <span className="text-gray-200">
                          {movieDetails.genres?.map((g: any) => g.name).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
