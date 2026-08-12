import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { Movie } from '../types/movie';

const STORAGE_KEY = 'movie-search:recentlyViewed';
const MAX_RECENT = 10;

interface RecentlyViewedContextValue {
  recentlyViewed: Movie[];
  addRecent: (movie: Movie) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | undefined>(undefined);

const RecentlyViewedProvider = ({ children }: PropsWithChildren) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Movie[]>(() => {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch {
      // Ignore storage failures (e.g. private mode or quota).
    }
  }, [recentlyViewed]);

  const addRecent = useCallback((movie: Movie) => {
    setRecentlyViewed((prev) => {
      const withoutDuplicate = prev.filter((existing) => existing.id !== movie.id);
      return [movie, ...withoutDuplicate].slice(0, MAX_RECENT);
    });
  }, []);

  const value = useMemo<RecentlyViewedContextValue>(
    () => ({ recentlyViewed, addRecent }),
    [recentlyViewed, addRecent]
  );

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
};

const useRecentlyViewed = (): RecentlyViewedContextValue => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

export { RecentlyViewedProvider, useRecentlyViewed };