import { useCallback, useEffect, useRef, useState } from 'react';
import { isAbortError } from '../services/api/client';

export interface UseResourceResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

type ResourceFetcher<T> = (id: number, signal: AbortSignal) => Promise<T>;

const isValidId = (id: number | undefined): id is number =>
  id !== undefined && Number.isInteger(id) && id > 0;

export function createResourceHook<T>(fetcher: ResourceFetcher<T>) {
  return function useResource(id?: number): UseResourceResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const refetch = useCallback(async () => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      if (!isValidId(id)) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetcher(id, controller.signal);
        if (!controller.signal.aborted) {
          setData(result);
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
    }, [id, fetcher]);

    useEffect(() => {
      void refetch();
      return () => controllerRef.current?.abort();
    }, [refetch]);

    return { data, loading, error, refetch };
  };
}
