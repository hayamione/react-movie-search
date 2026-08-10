import { useCallback, useEffect, useRef, useState } from 'react';
import type { Movie } from '../types/movie';
import { isAbortError } from '../services/api/client';
import { discoverMovies } from '../services/api/movie.service';

export interface UseGenrePageResult {
  popular: Movie[];
  topRated: Movie[];
  newest: Movie[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const isValidGenreId = (id: number | undefined): id is number =>
  id !== undefined && Number.isInteger(id) && id > 0;

export function useGenrePage(genreId?: number): UseGenrePageResult {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [newest, setNewest] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (!isValidGenreId(genreId)) {
      setPopular([]);
      setTopRated([]);
      setNewest([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [popularMovies, topMovies, newestMovies] = await Promise.all([
        discoverMovies(genreId, { sortBy: 'popularity', signal: controller.signal }),
        discoverMovies(genreId, {
          sortBy: 'vote_average',
          minVoteCount: 100,
          signal: controller.signal,
        }),
        discoverMovies(genreId, { sortBy: 'release_date', signal: controller.signal }),
      ]);
      if (!controller.signal.aborted) {
        setPopular(popularMovies);
        setTopRated(topMovies);
        setNewest(newestMovies);
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
  }, [genreId]);

  useEffect(() => {
    void refetch();
    return () => controllerRef.current?.abort();
  }, [refetch]);

  return { popular, topRated, newest, loading, error, refetch };
}
