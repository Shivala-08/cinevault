export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[85vh] bg-secondary/10 overflow-hidden isolate">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Content Skeleton */}
      <div className="absolute bottom-0 w-full p-6 md:p-12 z-20 pb-24 md:pb-32 bg-gradient-to-t from-background via-background/80 to-transparent h-[50vh] flex flex-col justify-end">
        <div className="max-w-2xl space-y-6">
          {/* Title Skeleton */}
          <div className="w-3/4 h-12 md:h-16 bg-secondary/30 rounded-lg" />
          
          {/* Details Row Skeleton */}
          <div className="flex gap-4">
            <div className="w-16 h-6 bg-secondary/30 rounded" />
            <div className="w-12 h-6 bg-secondary/30 rounded" />
            <div className="w-16 h-6 bg-secondary/30 rounded" />
          </div>
          
          {/* Overview Skeleton */}
          <div className="space-y-3">
            <div className="w-full h-4 bg-secondary/30 rounded" />
            <div className="w-full h-4 bg-secondary/30 rounded" />
            <div className="w-4/5 h-4 bg-secondary/30 rounded" />
          </div>
          
          {/* Buttons Skeleton */}
          <div className="flex gap-4 pt-4">
            <div className="w-32 h-12 bg-secondary/30 rounded-md" />
            <div className="w-40 h-12 bg-secondary/30 rounded-md border-2 border-secondary/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
