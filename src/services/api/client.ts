import type { PosterSize } from '../../types/common';

const config = {
  baseUrl: import.meta.env.VITE_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3',
  apiKey: import.meta.env.VITE_TMDB_API_KEY,
  imageBaseUrl: import.meta.env.VITE_TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p/',
};

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function buildImageUrl(path: string, size: PosterSize): string {
  return `${config.imageBaseUrl}${size}${path}`;
}

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!config.apiKey) {
    throw new ApiError('TMDB API key is not configured. Set VITE_TMDB_API_KEY.');
  }

  const url = new URL(`${config.baseUrl}${path}`);
  url.searchParams.set('api_key', config.apiKey);
  url.searchParams.set('language', 'en-US');

  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  let response: Response;
  try {
    response = await fetch(url, { signal: options.signal });
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    throw new ApiError('Network request failed.');
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = (await response.json()) as { status_message?: string };
      if (body.status_message) {
        message = body.status_message;
      }
    } catch {
      // Response body is not JSON; keep the default message.
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}
