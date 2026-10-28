import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { getReviewsForProduct } from "@/lib/reviews";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import { ReviewsProvider } from "@/contexts/ReviewsContext";
import ReviewsSection from "@/components/ReviewsSection";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  const product = products.find((p) => p.id === numericId);

  if (!product) {
    return {
      title: "Product Not Found | TrungTech",
    };
  }

  return {
    title: `${product.name} | TrungTech`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const product = products.find((p) => p.id === numericId);

  if (!product) {
    notFound();
  }

  const reviewsData = await getReviewsForProduct(numericId);

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-cyan-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            data-testid="link-back"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group"
          >
            <span className="p-1 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
              &larr;
            </span>
            Back to Products
          </Link>
        </div>

        {/* Product Detail Container */}
        <div
          data-testid="product-detail"
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Image Section */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-800/60 border border-slate-700/50 shadow-inner group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 backdrop-blur-md">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Information Section */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between gap-4">
                <span
                  data-testid="detail-category"
                  className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                >
                  {product.category}
                </span>

                <FavoriteButton productId={product.id} size="md" />
              </div>

              <h1
                data-testid="detail-name"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
              >
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4">
                <span
                  data-testid="detail-price"
                  className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"
                >
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  In stock & ready to ship
                </span>
              </div>

              <div className="border-t border-b border-slate-800/80 py-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </h3>
                <p
                  data-testid="detail-description"
                  className="text-base text-slate-300 leading-relaxed"
                >
                  {product.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="button"
                  className="flex-1 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section wrapped with ReviewsProvider */}
        <ReviewsProvider
          productId={numericId}
          initialReviews={reviewsData.reviews}
        >
          <ReviewsSection productId={numericId} />
        </ReviewsProvider>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 mt-20">
        <p className="text-center text-xs text-slate-500">
          © 2025 TrungTech. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
