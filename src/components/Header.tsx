"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center glow-effect group-hover:scale-105 transition-transform">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            TrungTech
          </span>
        </Link>

        {/* Navigation / Auth Buttons */}
        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/account"
                    className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Account
                  </Link>
                  <span
                    data-testid="user-email"
                    className="text-xs sm:text-sm font-medium text-violet-300 bg-violet-950/60 border border-violet-800/50 px-3 py-1.5 rounded-lg"
                  >
                    {user.email}
                  </span>
                  <button
                    data-testid="btn-logout"
                    onClick={() => signOut()}
                    className="text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/login"
                    data-testid="btn-login"
                    className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    data-testid="btn-register"
                    className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 rounded-xl transition-all shadow-md shadow-violet-500/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
