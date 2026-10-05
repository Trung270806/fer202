import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Background glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-cyan-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-64 h-64 bg-violet-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Premium Tech Collection
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Next-Gen{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
              Gadgets
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Elevate your setup with our curated collection of premium tech
            accessories and gadgets.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div
          data-testid="product-list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8">
        <p className="text-center text-xs text-slate-500">
          © 2025 TrungTech. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
