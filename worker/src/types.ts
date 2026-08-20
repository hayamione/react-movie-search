/**
 * Worker-side types for the TMDB tool engine.
 *
 * `Movie` intentionally mirrors the frontend's `src/types/movie.ts` shape
 * (Movie/Genre) field-for-field. It is redeclared here rather than imported
 * because the Worker is a separate deployable (its own tsconfig, its own
 * build via Wrangler) and does not share a module boundary with the Vite
 * frontend. Keeping the field names identical means the JSON this Worker
 * returns can be assigned directly to the frontend's `Movie` type with no
 * translation layer on the client.
 */

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  posterSrc?: string;
  backdropSrc?: string;
  releaseDate?: string;
  voteAverage?: number;
  genres?: Genre[];
  overview?: string;
  tagline?: string;
}

/** Env bindings this module needs. A subset of the full Worker Env. */
export interface TmdbEnv {
  TMDB_API_KEY?: string;
}

// ---------------------------------------------------------------------------
// Raw TMDB API response shapes (only the fields we actually read).
// ---------------------------------------------------------------------------

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovie {
  id: number;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  genres?: TmdbGenre[];
  overview?: string;
  tagline?: string;
}

export interface TmdbPaginatedResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbErrorBody {
  status_message?: string;
  status_code?: number;
}

// ---------------------------------------------------------------------------
// Tool input/output contracts
// ---------------------------------------------------------------------------

export interface SearchMovieInput {
  query: string;
  year?: number;
}

export interface SearchMovieOutput {
  results: Movie[];
}

export interface GetRecommendationsInput {
  movieId: number;
}

export interface GetRecommendationsOutput {
  results: Movie[];
}

export type DiscoverSortBy =
  | 'popularity.desc'
  | 'popularity.asc'
  | 'vote_average.desc'
  | 'vote_average.asc'
  | 'primary_release_date.desc'
  | 'primary_release_date.asc';

export interface DiscoverMoviesInput {
  with_genres?: number[];
  without_genres?: number[];
  primary_release_year?: number;
  primary_release_date_gte?: string;
  primary_release_date_lte?: string;
  sort_by?: DiscoverSortBy;
  vote_count_gte?: number;
}

export interface DiscoverMoviesOutput {
  results: Movie[];
}

// ---------------------------------------------------------------------------
// Structured error contract
//
// Tools never throw across the public boundary — every exported function
// returns a ToolResult so a future tool-calling layer (Groq, etc.) can
// serialize the outcome without a try/catch per call, and so upstream
// TMDB errors/secrets never leak to the caller.
// ---------------------------------------------------------------------------

export type ToolErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UPSTREAM_ERROR'
  | 'NETWORK_ERROR'
  | 'CONFIG_ERROR';

export interface ToolError {
  code: ToolErrorCode;
  message: string;
}

export type ToolResult<T> = { success: true; data: T } | { success: false; error: ToolError };
