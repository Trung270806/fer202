import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/data/products";
import FavoriteButton from "./FavoriteButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div data-testid="product-card" className="group relative">
      <Card className="h-full overflow-hidden bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col justify-between">
        <div className="relative">
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  product.badge === "Best Seller"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : product.badge === "New"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : product.badge === "Hot"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : product.badge === "Sale"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                }`}
              >
                {product.badge}
              </span>
            </div>
          )}

          {/* Favorite button and Category tag */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <span className="text-xs text-slate-400 bg-slate-900/80 border border-slate-700/60 px-2 py-1 rounded-full backdrop-blur-sm">
              {product.category}
            </span>
            <FavoriteButton productId={product.id} size="sm" />
          </div>

          {/* Product Image */}
          <div className="relative w-full aspect-square overflow-hidden bg-slate-800/50">
            <Image
              data-testid="product-image"
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className="p-4 flex flex-col gap-2">
            {/* Product Name linking to detail page */}
            <h3 className="text-base font-bold text-white leading-tight line-clamp-1 group-hover:text-indigo-300 transition-colors">
              <Link
                href={`/products/${product.id}`}
                data-testid="link-detail"
                className="hover:underline"
              >
                <span data-testid="product-name">{product.name}</span>
              </Link>
            </h3>

            {/* Product Description */}
            <p
              data-testid="product-description"
              className="text-xs text-slate-400 leading-relaxed line-clamp-2"
            >
              {product.description}
            </p>
          </CardContent>
        </div>

        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between mt-auto">
          {/* Product Price */}
          <span
            data-testid="product-price"
            className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"
          >
            ${product.price.toFixed(2)}
          </span>

          <Link
            href={`/products/${product.id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all duration-200"
          >
            Details &rarr;
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
