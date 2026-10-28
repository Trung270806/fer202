"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/contexts/ReviewsContext";
import ReviewItem from "@/components/ReviewItem";
import ReviewForm from "@/components/ReviewForm";

interface ReviewsSectionProps {
  productId: number;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { reviews, myReview } = useReviews();
  const { user, loading } = useAuth();
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const count = reviews.length;
  const average =
    count === 0
      ? 0
      : Number(
          (
            reviews.reduce((acc, curr) => acc + curr.rating, 0) / count
          ).toFixed(1)
        );

  return (
    <section className="mt-16 pt-12 border-t border-slate-800">
      {/* Header and Summary stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-indigo-400" />
            Customer Reviews
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ratings and feedback from verified purchasers
          </p>
        </div>

        {/* Rating summary */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 px-5 py-3 rounded-2xl backdrop-blur-md">
          <span
            data-testid="rating-average"
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300"
          >
            {average}
          </span>
          <div className="flex flex-col justify-center">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(average)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              <span data-testid="review-count" className="font-semibold text-slate-200">
                {count}
              </span>{" "}
              {count === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* Persistent success banner if review was submitted */}
      {successBanner && (
        <div
          data-testid="review-success"
          className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-between"
        >
          <span>{successBanner}</span>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-xs text-emerald-400/80 hover:text-emerald-300 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form or Login prompt or Already-reviewed banner */}
      <div className="mb-10">
        {loading ? (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-sm text-slate-400 animate-pulse">
            Checking authentication...
          </div>
        ) : !user ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center backdrop-blur-md">
            <p className="text-slate-300 text-base mb-4">
              Have you tried this product? Log in to leave your feedback and rating.
            </p>
            <Link
              href="/login"
              data-testid="link-login-to-review"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all text-sm"
            >
              Log In to Write a Review
            </Link>
          </div>
        ) : myReview ? (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm flex items-center justify-between">
            <span>
              You have already reviewed this product. You can update or delete your review below.
            </span>
          </div>
        ) : (
          <ReviewForm
            productId={productId}
            onSuccess={(msg) => setSuccessBanner(msg)}
          />
        )}
      </div>

      {/* Reviews list or Empty state */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">
          All Reviews ({count})
        </h3>

        {count === 0 ? (
          <div
            data-testid="reviews-empty"
            className="p-10 rounded-2xl bg-slate-900/30 border border-slate-800 text-center text-slate-400"
          >
            <p className="text-base font-medium text-slate-300 mb-1">
              No reviews yet
            </p>
            <p className="text-xs text-slate-500">
              Be the first to share your thoughts on this product!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
