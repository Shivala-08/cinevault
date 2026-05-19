"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, User, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/home/SearchOverlay";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-4",
          isScrolled || isMobileMenuOpen
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary tracking-tight z-50">
              CineVault <span className="text-foreground">2.0</span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-secondary-foreground">
              <Link href="/" className="hover:text-foreground transition-colors text-foreground">Home</Link>
              <Link href="/trending" className="hover:text-foreground transition-colors">Trending</Link>
              <Link href="/mood" className="hover:text-foreground transition-colors">Mood</Link>
              <Link href="/watchlist" className="hover:text-foreground transition-colors">Watchlist</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-6 z-50">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-secondary-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden md:block text-secondary-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="hidden md:flex w-8 h-8 rounded-full bg-secondary items-center justify-center cursor-pointer border border-border">
              <User className="w-4 h-4 text-secondary-foreground" />
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pt-8 pb-4 flex flex-col gap-4 text-lg font-medium text-secondary-foreground animate-in slide-in-from-top-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/trending" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors">Trending</Link>
            <Link href="/mood" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors">Mood</Link>
            <Link href="/watchlist" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors">Watchlist</Link>
          </nav>
        )}
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
