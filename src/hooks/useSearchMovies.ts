import { useCallback, useEffect, useRef, useState } from 'react';
import type { Movie } from '../types/movie';
import { isAbortError } from '../services/api/client';
import { searchMovies } from '../services/api/search.service';

export interface UseSearchMoviesParams {
  query: string;
  page?: number;
  year?: number;
  genreId?: number;
}

export interface UseSearchMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  page: number;
  totalPages: number;
  totalResults: number;
}

export function useSearchMovies({
  query,
  page = 1,
  year,
  genreId,
}: UseSearchMoviesParams): UseSearchMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<{ page: number; totalPages: number; totalResults: number }>({
    page: 1,
    totalPages: 0,
    totalResults: 0,
  });
  const controllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const trimmed = query.trim();
    if (!trimmed) {
      setMovies([]);
      setMeta({ page: 1, totalPages: 0, totalResults: 0 });
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(trimmed, {
        page,
        year,
        genreId,
        signal: controller.signal,
      });
      if (!controller.signal.aborted) {
        setMovies(data.movies);
        setMeta({
          page: data.page,
          totalPages: data.totalPages,
          totalResults: data.totalResults,
        });
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
  }, [query, page, year, genreId]);

  useEffect(() => {
    void refetch();
    return () => controllerRef.current?.abort();
  }, [refetch]);

  return { movies, loading, error, refetch, ...meta };
}
