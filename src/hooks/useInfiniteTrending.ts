import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPaginatedTrendingMovies } from "@/lib/tmdb";

export function useInfiniteTrending() {
  return useInfiniteQuery({
    queryKey: ["infiniteTrendingMovies"],
    queryFn: ({ pageParam = 1 }) => fetchPaginatedTrendingMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // TMDB paginates up to total_pages, but we can limit to 500 for safety
      if (lastPage.page < lastPage.total_pages && lastPage.page < 500) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}
