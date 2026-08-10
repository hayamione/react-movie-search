import { useCallback, useEffect, useRef, useState } from 'react';
import type { Movie } from '../types/movie';
import { isAbortError } from '../services/api/client';
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from '../services/api/movie.service';

export interface UseMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

type MovieFetcher = (signal: AbortSignal) => Promise<Movie[]>;

function createMoviesHook(fetcher: MovieFetcher) {
  return function useMovies(): UseMoviesResult {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const refetch = useCallback(async () => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const data = await fetcher(controller.signal);
        if (!controller.signal.aborted) {
          setMovies(data);
        }
      } catch (err) {
        if (isAbortError(err)) {
          return;
        }
        setError(err instanceof Error ? err : new Error('An unexpected error occurred.'));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, [fetcher]);

    useEffect(() => {
      void refetch();
      return () => controllerRef.current?.abort();
    }, [refetch]);

    return { movies, loading, error, refetch };
  };
}

export const useTrendingMovies = createMoviesHook(getTrendingMovies);
export const usePopularMovies = createMoviesHook(getPopularMovies);
export const useTopRatedMovies = createMoviesHook(getTopRatedMovies);
export const useUpcomingMovies = createMoviesHook(getUpcomingMovies);
