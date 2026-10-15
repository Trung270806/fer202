import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <Header />

      <div
        data-testid="not-found"
        className="max-w-md mx-auto px-4 py-16 text-center space-y-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-3xl shadow-inner">
          404
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Page Not Found
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Sorry, we couldn&apos;t find the product or page you were looking for.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
          >
            Return to Store
          </Link>
        </div>
      </div>

      <footer className="border-t border-slate-800/60 py-8">
        <p className="text-center text-xs text-slate-500">
          © 2025 TrungTech. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
