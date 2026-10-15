import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const category =
    typeof params?.category === "string" ? params.category.trim() : "";

  const query = q.toLowerCase();
  const selectedCategory = category.toLowerCase();

  let filteredProducts = [...products];

  if (query) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === selectedCategory
    );
  }

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <main className="relative min-h-screen bg-slate-950 overflow-x-hidden text-white flex flex-col justify-between">
      {/* Background glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-cyan-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-64 h-64 bg-violet-700/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <Header />

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
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

        {/* URL-driven Search & Category Filter Form */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
          <form
            method="get"
            action="/"
            className="bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-2xl backdrop-blur-md shadow-xl flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                data-testid="search-input"
                defaultValue={q}
                placeholder="Search products by name or description..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="sm:w-48">
              <select
                name="category"
                data-testid="category-select"
                defaultValue={category}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              data-testid="btn-search"
              className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-md shadow-indigo-600/25 active:scale-95"
            >
              Search
            </button>
          </form>
        </section>

        {/* Product Grid or No Results */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {filteredProducts.length > 0 ? (
            <div
              data-testid="product-list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div
              data-testid="no-results"
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                No matching products found
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                We couldn&apos;t find any products matching your search criteria.
                Try adjusting your search terms or category filter.
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
              >
                Clear all filters
              </a>
            </div>
          )}
        </section>
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
