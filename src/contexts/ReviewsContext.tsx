"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Review } from "@/lib/reviews";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

type ReviewAction =
  | { type: "SET"; payload: Review[] }
  | { type: "ADD"; payload: Review }
  | { type: "UPDATE"; payload: Review }
  | { type: "REMOVE"; payload: number };

function reviewsReducer(state: Review[], action: ReviewAction): Review[] {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      return [action.payload, ...state.filter((r) => r.id !== action.payload.id)];
    case "UPDATE":
      return state.map((r) => (r.id === action.payload.id ? action.payload : r));
    case "REMOVE":
      return state.filter((r) => r.id !== action.payload);
    default:
      return state;
  }
}

interface ReviewsContextType {
  reviews: Review[];
  myReview: Review | null;
  submitReview: (
    rating: number,
    comment: string
  ) => Promise<{ data?: Review; error?: string }>;
  updateReview: (
    rating: number,
    comment: string
  ) => Promise<{ data?: Review; error?: string }>;
  deleteReview: () => Promise<{ success?: boolean; error?: string }>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

interface ReviewsProviderProps {
  productId: number;
  initialReviews: Review[];
  children: ReactNode;
}

export function ReviewsProvider({
  productId,
  initialReviews,
  children,
}: ReviewsProviderProps) {
  const [reviews, dispatch] = useReducer(reviewsReducer, initialReviews);
  const { user, session } = useAuth();
  const router = useRouter();

  const deletedIdsRef = useRef<Set<number>>(new Set());
  const updatedReviewsRef = useRef<Map<number, Partial<Review>>>(new Map());
  const addedReviewsRef = useRef<Map<number, Review>>(new Map());

  // Sync state if initialReviews updates from server revalidation,
  // while preserving optimistic additions, updates, and deletions
  useEffect(() => {
    const synced = initialReviews
      .filter((r) => !deletedIdsRef.current.has(r.id))
      .map((r) => {
        const updated = updatedReviewsRef.current.get(r.id);
        return updated ? { ...r, ...updated } : r;
      });

    // Remove any items from addedReviewsRef that have now arrived in initialReviews
    const syncedIds = new Set(synced.map((r) => r.id));
    for (const id of syncedIds) {
      addedReviewsRef.current.delete(id);
    }

    // Keep any newly added reviews that are not yet reflected in initialReviews (due to server cache)
    const pendingAdded = Array.from(addedReviewsRef.current.values()).filter(
      (r) => !deletedIdsRef.current.has(r.id)
    );

    dispatch({ type: "SET", payload: [...pendingAdded, ...synced] });
  }, [initialReviews]);

  // Find the logged-in user's review
  const myReview = useMemo(() => {
    if (!user) return null;
    return reviews.find((r) => r.user_id === user.id) || null;
  }, [reviews, user]);

  // 1. submitReview via POST /api/reviews
  const submitReview = async (rating: number, comment: string) => {
    try {
      let token = session?.access_token;
      if (!token) {
        const { data: sessionData } = await supabase.auth.getSession();
        token = sessionData.session?.access_token;
      }

      if (!token) {
        return { error: "Unauthorized" };
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Failed to submit review" };
      }

      addedReviewsRef.current.set(data.id, data);
      deletedIdsRef.current.delete(data.id);
      dispatch({ type: "ADD", payload: data });
      router.refresh();
      return { data };
    } catch (err: any) {
      return { error: err.message || "Failed to submit review" };
    }
  };

  // 2. updateReview calls Supabase directly (RLS protected)
  const updateReview = async (rating: number, comment: string) => {
    if (!myReview) {
      return { error: "No review found to update" };
    }

    try {
      const { data, error } = await supabase
        .from("reviews")
        .update({ rating, comment })
        .eq("id", myReview.id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      updatedReviewsRef.current.set(myReview.id, { rating, comment });
      dispatch({ type: "UPDATE", payload: data });
      router.refresh();
      return { data };
    } catch (err: any) {
      return { error: err.message || "Failed to update review" };
    }
  };

  // 3. deleteReview calls Supabase directly with optimistic update & rollback
  const deleteReview = async () => {
    if (!myReview) {
      return { error: "No review found to delete" };
    }

    const previousReviews = reviews;
    const reviewToDelete = myReview;

    // Optimistic remove
    dispatch({ type: "REMOVE", payload: reviewToDelete.id });

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewToDelete.id);

      if (error) {
        // Rollback on error
        dispatch({ type: "SET", payload: previousReviews });
        return { error: error.message };
      }

      deletedIdsRef.current.add(reviewToDelete.id);
      addedReviewsRef.current.delete(reviewToDelete.id);
      updatedReviewsRef.current.delete(reviewToDelete.id);
      router.refresh();
      return { success: true };
    } catch (err: any) {
      // Rollback on error
      deletedIdsRef.current.delete(reviewToDelete.id);
      dispatch({ type: "SET", payload: previousReviews });
      return { error: err.message || "Failed to delete review" };
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        myReview,
        submitReview,
        updateReview,
        deleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
