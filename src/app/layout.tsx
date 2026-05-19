import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineVault 2.0 - Cinema Beyond Streaming",
  description: "Discover trending blockbusters, timeless classics, and hidden gems curated for every mood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark antialiased h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
