import { useCallback, useEffect, useRef, useState } from 'react';
import type { Movie } from '../types/movie';
import { isAbortError } from '../services/api/client';
import { getMovieCollection } from '../services/api/collection.service';
import type { MovieCollectionEndpoint } from '../services/api/collection.service';

export interface UseMovieCollectionResult {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  page: number;
  totalPages: number;
  totalResults: number;
}

export function useMovieCollection(
  endpoint: MovieCollectionEndpoint,
  page = 1
): UseMovieCollectionResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState({ page: 1, totalPages: 0, totalResults: 0 });
  const controllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await getMovieCollection(endpoint, {
        page,
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
  }, [endpoint, page]);

  useEffect(() => {
    void refetch();
    return () => controllerRef.current?.abort();
  }, [refetch]);

  return { movies, loading, error, refetch, ...meta };
}
