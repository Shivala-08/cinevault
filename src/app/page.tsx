import { HeroBanner } from "@/components/home/HeroBanner";
import { Navbar } from "@/components/layout/Navbar";
import { TrendingMovies } from "@/components/home/TrendingMovies";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative w-full">
      <Navbar />
      <HeroBanner />
      <TrendingMovies />
    </main>
  );
}
