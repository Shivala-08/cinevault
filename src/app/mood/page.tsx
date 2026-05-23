"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MOODS, MoodConfig } from "@/data/moods";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchMoviesByMood } from "@/lib/tmdb";
import { MovieCard } from "@/components/home/MovieCard";
import { MovieRowSkeleton } from "@/components/loaders/MovieCardSkeleton";
import * as Icons from "lucide-react";

export default function MoodPage() {
  const [activeMood, setActiveMood] = useState<MoodConfig | null>(null);

  const { data: movies, isLoading } = useQuery({
    queryKey: ["moodMovies", activeMood?.id],
    queryFn: () => fetchMoviesByMood(activeMood!.genreIds),
    enabled: !!activeMood,
  });

  return (
    <main className="flex-1 flex flex-col relative w-full min-h-screen">
      <Navbar />
      <div className="px-4 sm:px-6 md:px-12 py-24 sm:py-32 relative z-10 bg-background flex-1 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-2xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">What's your mood?</h1>
          <p className="text-xl text-secondary-foreground">
            Select how you're feeling, and we'll curate the perfect cinematic experience for you.
          </p>
        </motion.div>
        
        {/* Mood Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full mb-16">
          {MOODS.map((mood, i) => {
            const Icon = (Icons as any)[mood.icon] || Icons.Film;
            const isActive = activeMood?.id === mood.id;
            
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveMood(mood)}
                className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  isActive 
                    ? "border-primary shadow-[0_0_30px_rgba(229,9,20,0.3)]" 
                    : "border-border hover:border-gray-500"
                }`}
              >
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${mood.gradient}`} />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <Icon className={`w-8 h-8 ${isActive ? "text-primary" : "text-white"}`} />
                  <span className={`font-semibold text-lg ${isActive ? "text-primary" : "text-white"}`}>
                    {mood.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {/* Results Section */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeMood && (
              <motion.div
                key={activeMood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <div className="mb-8 border-b border-border pb-8 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${activeMood.gradient} flex items-center justify-center shrink-0`}>
                    {(() => {
                      const Icon = (Icons as any)[activeMood.icon] || Icons.Film;
                      return <Icon className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{activeMood.name} Collection</h2>
                    <p className="text-secondary-foreground">{activeMood.description}</p>
                  </div>
                </div>

                {isLoading ? (
                  <MovieRowSkeleton />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {movies?.results.map((movie: any, index: number) => (
                      <MovieCard key={movie.id} movie={movie} index={index} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
