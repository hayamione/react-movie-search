import type { ApiMovie, ApiPaginatedResult } from '../../types/api';
import type { Movie } from '../../types/movie';
import { request } from './client';
import { ENDPOINTS } from './endpoints';
import { mapApiMovie } from './movie.service';

export type MovieCollectionEndpoint =
  | 'trending'
  | 'popular'
  | 'topRated'
  | 'upcoming'
  | 'nowPlaying'
  | 'movies';

const COLLECTION_ENDPOINTS: Record<MovieCollectionEndpoint, string> = {
  trending: ENDPOINTS.trending.movies(),
  popular: ENDPOINTS.movie.popular(),
  topRated: ENDPOINTS.movie.topRated(),
  upcoming: ENDPOINTS.movie.upcoming(),
  nowPlaying: ENDPOINTS.movie.nowPlaying(),
  movies: ENDPOINTS.discover.movie(),
};

export interface MovieCollectionResult {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface GetMovieCollectionOptions {
  page?: number;
  signal?: AbortSignal;
}

export async function getMovieCollection(
  endpoint: MovieCollectionEndpoint,
  options: GetMovieCollectionOptions = {}
): Promise<MovieCollectionResult> {
  const { page = 1, signal } = options;

  const params: Record<string, string | number | boolean | undefined> = {};
  if (page > 1) {
    params.page = page;
  }

  const data = await request<ApiPaginatedResult<ApiMovie>>(
    COLLECTION_ENDPOINTS[endpoint],
    { params, signal }
  );

  return {
    movies: data.results.map((movie) => mapApiMovie(movie)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}
