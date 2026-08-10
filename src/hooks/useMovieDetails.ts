import { useCallback, useEffect, useRef, useState } from 'react';
import type { EntityId } from '../types/common';
import type { MovieDetails } from '../types/movie';
import { isAbortError } from '../services/api/client';
import { getMovieDetails } from '../services/api/movie.service';

export interface UseMovieDetailsResult {
  movie: MovieDetails | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const isInvalidMovieId = (id: EntityId | undefined) =>
  id === undefined || !Number.isInteger(id) || id <= 0;

export function useMovieDetails(movieId?: EntityId): UseMovieDetailsResult {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (isInvalidMovieId(movieId)) {
      setMovie(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMovieDetails(movieId, controller.signal);
      if (!controller.signal.aborted) {
        setMovie(data);
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
  }, [movieId]);

  useEffect(() => {
    void refetch();
    return () => controllerRef.current?.abort();
  }, [refetch]);

  return { movie, loading, error, refetch };
}
