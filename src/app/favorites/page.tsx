"use client";

import { useEffect, useState, useCallback } from "react";
import { ShowCard, type Show } from "@/components/show-card";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchFavorites = useCallback(async () => {
    const res = await fetch("/api/favorites");
    const data: Show[] = await res.json();
    setFavorites(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeFavorite = useCallback(
    async (showId: number) => {
      setTogglingId(showId);
      await fetch(`/api/favorites/${showId}`, { method: "DELETE" });
      setFavorites((prev) => prev.filter((s) => s.id !== showId));
      setTogglingId(null);
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-muted-foreground">Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-800 tracking-tight">My Favorites</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Shows you&apos;ve added to your favorites. Click the heart to remove.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Heart className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">
            No favorites yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Go to Browse and tap the heart on shows you love.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {favorites.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              isFavorite={true}
              onToggleFavorite={removeFavorite}
              disabled={togglingId === show.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
