"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
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

  // Sync state if initialReviews updates from server revalidation
  useEffect(() => {
    dispatch({ type: "SET", payload: initialReviews });
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

      router.refresh();
      return { success: true };
    } catch (err: any) {
      // Rollback on error
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
