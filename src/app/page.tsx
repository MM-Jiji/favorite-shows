"use client";

import { useEffect, useState, useCallback } from "react";
import { ShowCard, type Show } from "@/components/show-card";

export default function HomePage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [showsRes, favsRes] = await Promise.all([
        fetch("/api/shows"),
        fetch("/api/favorites"),
      ]);
      const showsData: Show[] = await showsRes.json();
      const favsData: Show[] = await favsRes.json();
      setShows(showsData);
      setFavoriteIds(new Set(favsData.map((f) => f.id)));
      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleFavorite = useCallback(
    async (showId: number) => {
      setTogglingId(showId);
      const isFav = favoriteIds.has(showId);

      if (isFav) {
        await fetch(`/api/favorites/${showId}`, { method: "DELETE" });
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(showId);
          return next;
        });
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ showId }),
        });
        setFavoriteIds((prev) => new Set(prev).add(showId));
      }
      setTogglingId(null);
    },
    [favoriteIds]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-muted-foreground">Loading shows...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-800 tracking-tight">Browse Shows</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover our selection of shows. Tap the heart to add them to your
          favorites.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {shows.map((show, index) => (
          <ShowCard
            key={show.id}
            show={show}
            isFavorite={favoriteIds.has(show.id)}
            onToggleFavorite={toggleFavorite}
            disabled={togglingId === show.id}
            priority={index < 2}
          />
        ))}
      </div>
    </div>
  );
}
