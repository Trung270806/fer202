"use client";

import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteButtonProps {
  productId: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({
  productId,
  className = "",
  size = "md",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(productId);

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      type="button"
      data-testid="btn-favorite"
      aria-pressed={favorited ? "true" : "false"}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
        favorited
          ? "bg-rose-500/20 text-rose-500 border border-rose-500/40 hover:bg-rose-500/30"
          : "bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-rose-400 hover:bg-slate-800"
      } ${
        size === "sm" ? "p-1.5" : size === "lg" ? "p-3" : "p-2"
      } ${className}`}
    >
      <svg
        className={`${iconSizes[size]} transition-transform duration-200 ${
          favorited ? "scale-110 fill-rose-500" : "fill-none stroke-current"
        }`}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>
    </button>
  );
}
