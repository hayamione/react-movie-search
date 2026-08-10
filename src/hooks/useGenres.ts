import { useCallback, useEffect, useRef, useState } from 'react';
import type { Genre } from '../types/genre';
import { isAbortError } from '../services/api/client';
import { getMovieGenres } from '../services/api/genre.service';

export interface UseGenresResult {
  genres: Genre[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGenres(): UseGenresResult {
  const [genres, setGenres] = useState<Genre[]>([]);
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
      const data = await getMovieGenres(controller.signal);
      if (!controller.signal.aborted) {
        setGenres(data);
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
  }, []);

  useEffect(() => {
    void refetch();
    return () => controllerRef.current?.abort();
  }, [refetch]);

  return { genres, loading, error, refetch };
}
