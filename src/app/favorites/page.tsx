"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { products } from "@/data/products";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { favorites } = useFavorites();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Background glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-cyan-700/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        <Header />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            data-testid="favorites-page"
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  My Favorites
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Saved products synced with your account
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {favoriteProducts.length}{" "}
                {favoriteProducts.length === 1 ? "item" : "items"}
              </span>
            </div>

            {favoriteProducts.length === 0 ? (
              <div
                data-testid="favorites-empty"
                className="text-center py-16 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">
                  No favorites yet
                </h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Explore our tech gadgets and click the heart icon on any card to
                  save items to your list.
                </p>
                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    data-testid="favorite-item"
                    className="bg-slate-900/90 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-lg"
                  >
                    <div>
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-800/50 mb-3">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-base font-bold text-white hover:text-indigo-300 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <FavoriteButton productId={product.id} size="sm" />
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800">
                      <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        ${product.price.toFixed(2)}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 transition-all"
                      >
                        View &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8">
        <p className="text-center text-xs text-slate-500">
          © 2025 TrungTech. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
