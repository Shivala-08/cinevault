import { Navbar } from "@/components/layout/Navbar";
import { TrendingMovies } from "@/components/home/TrendingMovies";

export default function TrendingPage() {
  return (
    <main className="flex-1 flex flex-col relative w-full min-h-screen">
      <Navbar />
      <div className="pt-24">
        <TrendingMovies />
      </div>
    </main>
  );
}
