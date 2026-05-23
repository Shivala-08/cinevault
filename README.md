# CineVault 2.0 🎬

A modern, highly responsive movie discovery and watchlist application built with Next.js and Tailwind CSS. Explore trending movies, curate your own watchlist, and discover new cinematic experiences based on your mood.

Live Demo: [CineVault 2.0](https://cinevault-eight-red.vercel.app/)

## ✨ Key Features

- **Trending Movies**: Browse an infinitely scrolling list of popular films.
- **Search Universe**: Quickly search for any movie using the dynamic search overlay.
- **Mood Board**: Select your current vibe and let CineVault curate the perfect cinematic experience.
- **Watchlist & Favorites**: Save movies to your personal watchlist or favorites using local browser storage.
- **Immersive Details**: Click on any movie card to watch the trailer in a sleek cinematic modal, complete with cast details, genres, and a plot overview.
- **Cross-Device Responsiveness**: Fully optimized for a premium viewing experience across mobile phones, tablets, and desktop displays.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & UI components
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: React Query & TMDB API
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
You will need a free TMDB (The Movie Database) API key. Grab one at [TMDB API](https://developer.themoviedb.org/docs/getting-started).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shivala-08/cinevault.git
   cd cinevault
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your TMDB API key:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📦 Recent Updates
- Upgraded to Next.js 16.2.6 to resolve security vulnerabilities.
- Integrated fully responsive layouts scaling from `320px` mobile screens to ultra-wide desktop monitors.
- Re-styled component UI with polished Tailwind classes.

## 📄 License
This project is licensed under the MIT License.
