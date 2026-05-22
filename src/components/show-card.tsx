"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export type Show = {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
};

interface ShowCardProps {
  show: Show;
  isFavorite: boolean;
  onToggleFavorite: (showId: number) => void;
  disabled?: boolean;
  priority?: boolean;
}

export function ShowCard({
  show,
  isFavorite,
  onToggleFavorite,
  disabled,
  priority,
}: ShowCardProps) {
  return (
    <div className="group relative aspect-2/3 w-full overflow-hidden rounded-xl cursor-pointer">
      <Image
        src={show.imageUrl}
        alt={show.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
      <button
        onClick={() => onToggleFavorite(show.id)}
        disabled={disabled}
        className="absolute right-2 top-2 rounded-full bg-black/40 p-2 backdrop-blur-md border border-white/10 transition-all hover:bg-black/60 hover:scale-110 disabled:opacity-50"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isFavorite
              ? "fill-red-500 text-red-500"
              : "fill-transparent text-white"
          )}
        />
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="font-heading text-sm font-700 leading-tight text-white">{show.name}</h3>
        <p className="mt-1 text-xs text-white/60 line-clamp-2 leading-snug">
          {show.description}
        </p>
      </div>
    </div>
  );
}
