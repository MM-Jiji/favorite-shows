import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import Link from "next/link";
import { Heart, Home, Trophy } from "lucide-react";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Favorite Shows",
  description: "Browse shows, pick your favorites, and create your monthly Top 3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-white/8 bg-background/85 backdrop-blur-md">
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="font-heading text-lg font-800 tracking-widest uppercase text-foreground hover:text-amber-400 transition-colors">
              Favorite<span className="text-amber-400">Shows</span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/6 hover:text-amber-400"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Browse</span>
              </Link>
              <Link
                href="/favorites"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/6 hover:text-amber-400"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favorites</span>
              </Link>
              <Link
                href="/top3"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-white/6 hover:text-amber-400"
              >
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Top 3</span>
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
