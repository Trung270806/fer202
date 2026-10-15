"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext";

type FavoriteAction =
  | { type: "SET"; payload: number[] }
  | { type: "ADD"; payload: number }
  | { type: "REMOVE"; payload: number };

function favoritesReducer(state: number[], action: FavoriteAction): number[] {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      return state.includes(action.payload) ? state : [...state, action.payload];
    case "REMOVE":
      return state.filter((id) => id !== action.payload);
    default:
      return state;
  }
}

interface FavoritesContextType {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      if (user) {
        const { data, error } = await supabase
          .from("favorites")
          .select("product_id");

        if (!error && data && isMounted) {
          const ids = data.map((row: { product_id: number }) => row.product_id);
          dispatch({ type: "SET", payload: ids });
        }
      } else {
        if (isMounted) {
          dispatch({ type: "SET", payload: [] });
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const isFavorite = (id: number) => favorites.includes(id);

  const toggleFavorite = async (id: number) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const currentlyFavorite = favorites.includes(id);

    if (currentlyFavorite) {
      // Optimistic remove
      dispatch({ type: "REMOVE", payload: id });
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("product_id", id);

      if (error) {
        // Rollback
        dispatch({ type: "ADD", payload: id });
      }
    } else {
      // Optimistic add
      dispatch({ type: "ADD", payload: id });
      const { error } = await supabase
        .from("favorites")
        .insert({ product_id: id });

      if (error) {
        // Rollback
        dispatch({ type: "REMOVE", payload: id });
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
