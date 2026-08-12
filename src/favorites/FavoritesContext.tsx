import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { EntityId } from '../types/common';
import type { Movie } from '../types/movie';

const STORAGE_KEY = 'movie-search:favorites';

interface FavoritesContextValue {
  favorites: Movie[];
  isFavorite: (movieId: EntityId) => boolean;
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: EntityId) => void;
  toggleFavorite: (movie: Movie) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const FavoritesProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Movie[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage failures (e.g. private mode or quota).
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (movieId: EntityId) => favorites.some((movie) => movie.id === movieId),
    [favorites]
  );

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) =>
      prev.some((existing) => existing.id === movie.id) ? prev : [movie, ...prev]
    );
  }, []);

  const removeFavorite = useCallback((movieId: EntityId) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  }, []);

  const toggleFavorite = useCallback(
    (movie: Movie) => {
      setFavorites((prev) =>
        prev.some((existing) => existing.id === movie.id)
          ? prev.filter((existing) => existing.id !== movie.id)
          : [movie, ...prev]
      );
    },
    []
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }),
    [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export { FavoritesProvider, useFavorites };