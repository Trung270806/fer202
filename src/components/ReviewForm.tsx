"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormData } from "@/lib/reviewSchema";
import { useReviews } from "@/contexts/ReviewsContext";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";

interface ReviewFormProps {
  productId: number;
  onSuccess?: (msg: string) => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { submitReview } = useReviews();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      product_id: productId,
      rating: "" as any,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const result = await submitReview(data.rating, data.comment);
    setIsSubmitting(false);

    if (result.error) {
      setServerError(result.error);
    } else {
      const msg = "Review submitted successfully!";
      setSuccessMessage(msg);
      reset({ product_id: productId, rating: "" as any, comment: "" });
      if (onSuccess) {
        onSuccess(msg);
      }
    }
  };

  return (
    <form
      data-testid="review-form"
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5"
    >
      <input
        type="hidden"
        {...register("product_id", { valueAsNumber: true, value: productId })}
      />

      <div>
        <h3 className="text-lg font-bold text-white mb-1">Leave a Review</h3>
        <p className="text-xs text-slate-400">
          Share your experience with this product with the community.
        </p>
      </div>

      {/* Rating Field */}
      <div>
        <label
          htmlFor="input-rating"
          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
        >
          Rating <span className="text-indigo-400">*</span>
        </label>
        <select
          id="input-rating"
          data-testid="input-rating"
          {...register("rating", { valueAsNumber: true })}
          defaultValue=""
          className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
        >
          <option value="" disabled>
            -- Select rating (1 to 5 stars) --
          </option>
          <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
          <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
          <option value="3">⭐⭐⭐ 3 - Average</option>
          <option value="2">⭐⭐ 2 - Poor</option>
          <option value="1">⭐ 1 - Terrible</option>
        </select>
        {errors.rating && (
          <p
            data-testid="error-rating"
            className="text-rose-400 text-xs font-medium mt-1.5 flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.rating.message || "Please select a rating"}
          </p>
        )}
      </div>

      {/* Comment Field */}
      <div>
        <label
          htmlFor="input-comment"
          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
        >
          Comment <span className="text-indigo-400">*</span>
        </label>
        <textarea
          id="input-comment"
          data-testid="input-comment"
          rows={4}
          maxLength={500}
          {...register("comment")}
          placeholder="What did you like or dislike? (1-500 characters)"
          className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
        />
        {errors.comment && (
          <p
            data-testid="error-comment"
            className="text-rose-400 text-xs font-medium mt-1.5 flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.comment.message || "Please write a comment"}
          </p>
        )}
      </div>

      {/* Server Error Message */}
      {serverError && (
        <div
          data-testid="error-review"
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div
          data-testid="review-success"
          className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        data-testid="btn-submit-review"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
