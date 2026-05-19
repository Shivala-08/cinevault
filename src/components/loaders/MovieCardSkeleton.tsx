import { motion } from "framer-motion";

export function MovieCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary/20 isolate"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  );
}

export function MovieRowSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 w-full">
      {Array.from({ length: 12 }).map((_, i) => (
        <MovieCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
