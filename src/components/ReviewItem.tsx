"use client";

import { useState } from "react";
import { Review } from "@/lib/reviews";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { Star, Edit3, Trash2, Check, X } from "lucide-react";

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const { user } = useAuth();
  const { updateReview, deleteReview } = useReviews();

  const isOwner = user?.id === review.user_id;

  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState<number>(review.rating);
  const [editComment, setEditComment] = useState<string>(review.comment);
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editComment.trim()) {
      setEditError("Comment cannot be empty");
      return;
    }
    setEditError(null);
    setIsUpdating(true);

    const result = await updateReview(editRating, editComment.trim());
    setIsUpdating(false);

    if (result.error) {
      setEditError(result.error);
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteReview();
    setIsDeleting(false);
  };

  return (
    <div
      data-testid="review-item"
      className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all backdrop-blur-md shadow-lg"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
            {review.author ? review.author.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                data-testid="review-author"
                className="font-semibold text-white text-base"
              >
                {review.author}
              </span>
              {isOwner && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  You
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {review.created_at
                ? new Date(review.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recently"}
            </p>
          </div>
        </div>

        {/* Rating stars & badge */}
        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-600"
                }`}
              />
            ))}
          </div>
          <span
            data-testid="review-rating"
            className="text-sm font-black text-amber-300 ml-1"
          >
            {review.rating}
          </span>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Update Rating
            </label>
            <select
              value={editRating}
              onChange={(e) => setEditRating(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Terrible</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Update Comment
            </label>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {editError && (
            <p className="text-rose-400 text-xs font-medium">{editError}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {isUpdating ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditRating(review.rating);
                setEditComment(review.comment);
                setEditError(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p
            data-testid="review-comment"
            className="text-slate-300 text-sm leading-relaxed mt-2 whitespace-pre-wrap"
          >
            {review.comment}
          </p>

          {isOwner && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                data-testid="btn-edit-review"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700/50"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                Edit
              </button>
              <button
                type="button"
                data-testid="btn-delete-review"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-colors border border-rose-500/20 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
