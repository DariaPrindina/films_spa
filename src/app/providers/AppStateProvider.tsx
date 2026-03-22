import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import { loadState, saveState } from "../../shared/lib/storage";
import type { MovieSummary } from "../../shared/types";

interface AppStateContextValue {
  favorites: MovieSummary[];
  compareQueue: MovieSummary[];
  isFavorite: (movieId: number) => boolean;
  isCompared: (movieId: number) => boolean;
  addFavorite: (movie: MovieSummary) => void;
  removeFavorite: (movieId: number) => void;
  toggleCompare: (movie: MovieSummary) => void;
  clearCompare: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const initial = loadState();
  const [favorites, setFavorites] = useState<MovieSummary[]>(initial.favorites);
  const [compareQueue, setCompareQueue] = useState<MovieSummary[]>(initial.compareQueue);

  useEffect(() => {
    saveState({ favorites, compareQueue });
  }, [favorites, compareQueue]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      favorites,
      compareQueue,
      isFavorite: (movieId) => favorites.some((movie) => movie.id === movieId),
      isCompared: (movieId) => compareQueue.some((movie) => movie.id === movieId),
      addFavorite: (movie) => {
        setFavorites((current) => {
          if (current.some((item) => item.id === movie.id)) {
            return current;
          }

          return [movie, ...current];
        });
      },
      removeFavorite: (movieId) => {
        setFavorites((current) => current.filter((movie) => movie.id !== movieId));
      },
      toggleCompare: (movie) => {
        setCompareQueue((current) => {
          if (current.some((item) => item.id === movie.id)) {
            return current.filter((item) => item.id !== movie.id);
          }

          const next = [...current, movie];
          return next.length > 2 ? next.slice(1) : next;
        });
      },
      clearCompare: () => setCompareQueue([])
    }),
    [compareQueue, favorites]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
