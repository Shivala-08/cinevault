export interface MoodConfig {
  id: string;
  name: string;
  description: string;
  genreIds: string; // Comma separated genre IDs for TMDB discover
  gradient: string;
  icon: string;
}

export const MOODS: MoodConfig[] = [
  {
    id: "feel-good",
    name: "Feel Good",
    description: "Heartwarming stories and lighthearted comedies.",
    genreIds: "35,10751,16", // Comedy, Family, Animation
    gradient: "from-yellow-400 to-orange-500",
    icon: "Sun",
  },
  {
    id: "dark-gritty",
    name: "Dark & Gritty",
    description: "Intense thrillers and gripping crime dramas.",
    genreIds: "80,53,9648", // Crime, Thriller, Mystery
    gradient: "from-gray-900 to-red-900",
    icon: "Moon",
  },
  {
    id: "mind-bending",
    name: "Mind-Bending",
    description: "Complex sci-fi and reality-warping narratives.",
    genreIds: "878,9648", // Sci-Fi, Mystery
    gradient: "from-purple-600 to-indigo-900",
    icon: "Brain",
  },
  {
    id: "comfort-cinema",
    name: "Comfort Cinema",
    description: "Familiar favorites that feel like a warm hug.",
    genreIds: "10749,35", // Romance, Comedy
    gradient: "from-pink-400 to-rose-600",
    icon: "Heart",
  },
  {
    id: "epic-adventures",
    name: "Epic Adventures",
    description: "Grand journeys and spectacular worlds.",
    genreIds: "12,14", // Adventure, Fantasy
    gradient: "from-emerald-500 to-teal-800",
    icon: "Mountain",
  },
  {
    id: "scare-me",
    name: "Scare Me",
    description: "Terrifying horror and chilling supernatural tales.",
    genreIds: "27", // Horror
    gradient: "from-black to-gray-800",
    icon: "Ghost",
  }
];
