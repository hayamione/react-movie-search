/**
 * Server-side TMDB tool engine for the AI Concierge.
 *
 * TMDB remains the single source of truth for movie data. Every exported
 * tool here:
 *   1. Validates its input (never trusts caller/LLM-supplied parameters).
 *   2. Calls a whitelisted TMDB endpoint with a whitelisted parameter set.
 *   3. Maps the raw TMDB response into the app's `Movie` shape itself —
 *      Groq / user input is never allowed to construct a `Movie`.
 *   4. Returns a bounded, small result set (see RESULT_LIMIT).
 *   5. Never throws — every function returns a `ToolResult<T>` so errors
 *      are structured and upstream/secret details never leak.
 */

import type {
  DiscoverMoviesInput,
  DiscoverMoviesOutput,
  DiscoverSortBy,
  GetRecommendationsInput,
  GetRecommendationsOutput,
  Genre,
  Movie,
  SearchMovieInput,
  SearchMovieOutput,
  TmdbEnv,
  TmdbErrorBody,
  TmdbGenre,
  TmdbMovie,
  TmdbPaginatedResult,
  ToolError,
  ToolResult,
} from './types';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * No configurable base URL exists in the current Worker architecture
 * (Phase A only introduced ENVIRONMENT/GROQ_API_KEY/TMDB_API_KEY), so per
 * the Phase B brief this stays a plain constant rather than adding new
 * unnecessary configuration.
 */
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_SIZE = 'w342';
const BACKDROP_SIZE = 'original';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

/** Small, bounded candidate set returned to the frontend (6–10 movies). */
const RESULT_LIMIT = 8;

const DISCOVER_SORT_VALUES: readonly DiscoverSortBy[] = [
  'popularity.desc',
  'popularity.asc',
  'vote_average.desc',
  'vote_average.asc',
  'primary_release_date.desc',
  'primary_release_date.asc',
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MIN_YEAR = 1870;
const MAX_YEAR = new Date().getUTCFullYear() + 5;

// ---------------------------------------------------------------------------
// Small result helpers
// ---------------------------------------------------------------------------

function ok<T>(data: T): ToolResult<T> {
  return { success: true, data };
}

function fail<T>(code: ToolError['code'], message: string): ToolResult<T> {
  return { success: false, error: { code, message } };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidYear(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= MIN_YEAR &&
    value <= MAX_YEAR
  );
}

function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime());
}

function isNumericIdArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((id) => typeof id === 'number' && Number.isInteger(id) && id > 0)
  );
}

function isValidSortBy(value: unknown): value is DiscoverSortBy {
  return typeof value === 'string' && (DISCOVER_SORT_VALUES as string[]).includes(value);
}

// ---------------------------------------------------------------------------
// TMDB fetch + mapping
// ---------------------------------------------------------------------------

class TmdbRequestError extends Error {
  code: 'UPSTREAM_ERROR' | 'NETWORK_ERROR' | 'NOT_FOUND';

  constructor(code: 'UPSTREAM_ERROR' | 'NETWORK_ERROR' | 'NOT_FOUND', message: string) {
    super(message);
    this.code = code;
  }
}

async function tmdbFetch<T>(
  env: TmdbEnv,
  path: string,
  params: Record<string, string | number | undefined>
): Promise<T> {
  if (!env.TMDB_API_KEY) {
    // Handled by callers as a CONFIG_ERROR; thrown here to keep one call site.
    throw new TmdbRequestError('UPSTREAM_ERROR', 'TMDB API key is not configured.');
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', env.TMDB_API_KEY);
  url.searchParams.set('language', 'en-US');
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new TmdbRequestError('NETWORK_ERROR', 'Failed to reach TMDB.');
  }

  if (response.status === 404) {
    throw new TmdbRequestError('NOT_FOUND', 'The requested TMDB resource was not found.');
  }

  if (!response.ok) {
    let message = `TMDB request failed with status ${response.status}.`;
    try {
      const body = (await response.json()) as TmdbErrorBody;
      if (body.status_message) {
        // Keep this generic-ish; never forward raw upstream payloads verbatim
        // beyond the message TMDB itself provides for the status.
        message = body.status_message;
      }
    } catch {
      // Non-JSON error body; keep the default message.
    }
    throw new TmdbRequestError('UPSTREAM_ERROR', message);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new TmdbRequestError('UPSTREAM_ERROR', 'TMDB returned an invalid response.');
  }
}

function buildImageUrl(path: string, size: string): string {
  return `${IMAGE_BASE_URL}${size}${path}`;
}

function mapTmdbGenres(movie: TmdbMovie, genreLookup?: Map<number, string>): Genre[] | undefined {
  if (movie.genres && movie.genres.length > 0) {
    return movie.genres.map((g) => ({ id: g.id, name: g.name }));
  }
  if (movie.genre_ids && movie.genre_ids.length > 0 && genreLookup) {
    const mapped = movie.genre_ids
      .map((id) => ({ id, name: genreLookup.get(id) ?? '' }))
      .filter((g) => g.name !== '');
    return mapped.length > 0 ? mapped : undefined;
  }
  return undefined;
}

/**
 * Normalizes a raw TMDB movie into the app's `Movie` shape. This is the
 * Worker's own mapper — see the Phase B write-up for why it isn't a direct
 * reuse of `src/services/api/movie.service.ts#mapApiMovie`.
 */
function mapTmdbMovie(movie: TmdbMovie, genreLookup?: Map<number, string>): Movie {
  return {
    id: movie.id,
    title: movie.title,
    posterSrc: movie.poster_path ? buildImageUrl(movie.poster_path, POSTER_SIZE) : undefined,
    backdropSrc: movie.backdrop_path
      ? buildImageUrl(movie.backdrop_path, BACKDROP_SIZE)
      : undefined,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    genres: mapTmdbGenres(movie, genreLookup),
    overview: movie.overview,
    tagline: movie.tagline,
  };
}

function toToolError<T>(error: unknown): ToolResult<T> {
  if (error instanceof TmdbRequestError) {
    if (error.code === 'UPSTREAM_ERROR' && error.message === 'TMDB API key is not configured.') {
      return fail('CONFIG_ERROR', 'The movie service is not configured.');
    }
    return fail(error.code, error.message);
  }
  return fail('UPSTREAM_ERROR', 'An unexpected error occurred while contacting TMDB.');
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

/**
 * Resolves a natural-language movie title to real TMDB movie records.
 * Always call this before `getRecommendations` — never pass a fuzzy title
 * directly into a recommendations lookup.
 */
export async function searchMovie(
  input: SearchMovieInput,
  env: TmdbEnv
): Promise<ToolResult<SearchMovieOutput>> {
  if (!isNonEmptyString(input?.query)) {
    return fail('VALIDATION_ERROR', 'query must be a non-empty string.');
  }
  if (input.year !== undefined && !isValidYear(input.year)) {
    return fail('VALIDATION_ERROR', `year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}.`);
  }

  try {
    const data = await tmdbFetch<TmdbPaginatedResult<TmdbMovie>>(env, '/search/movie', {
      query: input.query.trim(),
      year: input.year,
    });

    const results = data.results.slice(0, RESULT_LIMIT).map((movie) => mapTmdbMovie(movie));
    return ok({ results });
  } catch (error) {
    return toToolError(error);
  }
}

/**
 * Returns TMDB recommendations for an already-resolved TMDB movie ID.
 * Callers must resolve a title with `searchMovie` first.
 */
export async function getRecommendations(
  input: GetRecommendationsInput,
  env: TmdbEnv
): Promise<ToolResult<GetRecommendationsOutput>> {
  if (!isPositiveInteger(input?.movieId)) {
    return fail('VALIDATION_ERROR', 'movieId must be a positive integer.');
  }

  try {
    const data = await tmdbFetch<TmdbPaginatedResult<TmdbMovie>>(
      env,
      `/movie/${input.movieId}/recommendations`,
      {}
    );

    const results = data.results.slice(0, RESULT_LIMIT).map((movie) => mapTmdbMovie(movie));
    return ok({ results });
  } catch (error) {
    if (error instanceof TmdbRequestError && error.code === 'NOT_FOUND') {
      return fail('NOT_FOUND', 'No movie was found for the given movieId.');
    }
    return toToolError(error);
  }
}

/**
 * Discovers movies using a whitelisted subset of TMDB's /discover/movie
 * filters. Arbitrary TMDB query parameters are never accepted — only the
 * fields declared on `DiscoverMoviesInput` are read.
 */
export async function discoverMovies(
  input: DiscoverMoviesInput,
  env: TmdbEnv
): Promise<ToolResult<DiscoverMoviesOutput>> {
  const safeInput = input ?? {};

  if (safeInput.with_genres !== undefined && !isNumericIdArray(safeInput.with_genres)) {
    return fail('VALIDATION_ERROR', 'with_genres must be a non-empty array of positive integer genre ids.');
  }
  if (safeInput.without_genres !== undefined && !isNumericIdArray(safeInput.without_genres)) {
    return fail('VALIDATION_ERROR', 'without_genres must be a non-empty array of positive integer genre ids.');
  }
  if (safeInput.primary_release_year !== undefined && !isValidYear(safeInput.primary_release_year)) {
    return fail('VALIDATION_ERROR', `primary_release_year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}.`);
  }
  if (
    safeInput.primary_release_date_gte !== undefined &&
    !isValidDateString(safeInput.primary_release_date_gte)
  ) {
    return fail('VALIDATION_ERROR', 'primary_release_date_gte must be a valid YYYY-MM-DD date.');
  }
  if (
    safeInput.primary_release_date_lte !== undefined &&
    !isValidDateString(safeInput.primary_release_date_lte)
  ) {
    return fail('VALIDATION_ERROR', 'primary_release_date_lte must be a valid YYYY-MM-DD date.');
  }
  if (safeInput.sort_by !== undefined && !isValidSortBy(safeInput.sort_by)) {
    return fail(
      'VALIDATION_ERROR',
      `sort_by must be one of: ${DISCOVER_SORT_VALUES.join(', ')}.`
    );
  }
  if (
    safeInput.vote_count_gte !== undefined &&
    !(typeof safeInput.vote_count_gte === 'number' && safeInput.vote_count_gte >= 0)
  ) {
    return fail('VALIDATION_ERROR', 'vote_count_gte must be a non-negative number.');
  }

  // Explicit whitelist: only these params are ever forwarded to TMDB.
  const params: Record<string, string | number | undefined> = {
    with_genres: safeInput.with_genres?.join(','),
    without_genres: safeInput.without_genres?.join(','),
    primary_release_year: safeInput.primary_release_year,
    'primary_release_date.gte': safeInput.primary_release_date_gte,
    'primary_release_date.lte': safeInput.primary_release_date_lte,
    sort_by: safeInput.sort_by,
    'vote_count.gte': safeInput.vote_count_gte,
  };

  try {
    const data = await tmdbFetch<TmdbPaginatedResult<TmdbMovie>>(env, '/discover/movie', params);
    const results = data.results.slice(0, RESULT_LIMIT).map((movie) => mapTmdbMovie(movie));
    return ok({ results });
  } catch (error) {
    return toToolError(error);
  }
}

// Exported for tests only.
export const __internal = {
  RESULT_LIMIT,
  isValidYear,
  isValidDateString,
  isNumericIdArray,
  isValidSortBy,
  mapTmdbMovie,
};
