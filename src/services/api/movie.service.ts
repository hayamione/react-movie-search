import type { ApiMovie, ApiPaginatedResult } from '../../types/api';
import type { Genre } from '../../types/genre';
import type { Movie, MovieDetails } from '../../types/movie';
import { buildImageUrl, request } from './client';
import { ENDPOINTS } from './endpoints';

const POSTER_SIZE = 'w342' as const;

export function mapApiMovie(movie: ApiMovie, genres: Genre[] = []): MovieDetails {
  const genreNames = new Map(genres.map((genre) => [genre.id, genre.name]));
  const mappedGenres =
    movie.genres && movie.genres.length > 0
      ? movie.genres
      : (movie.genre_ids ?? [])
          .map((id) => ({ id, name: genreNames.get(id) ?? '' }))
          .filter((genre) => genre.name !== '');

  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    runtime: movie.runtime,
    posterSrc: movie.poster_path ? buildImageUrl(movie.poster_path, POSTER_SIZE) : undefined,
    backdropSrc: movie.backdrop_path
      ? buildImageUrl(movie.backdrop_path, 'original')
      : undefined,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    genres: mappedGenres,
    overview: movie.overview,
    tagline: movie.tagline,
  };
}

export async function getMovieDetails(
  id: number,
  signal?: AbortSignal
): Promise<MovieDetails> {
  const data = await request<ApiMovie>(ENDPOINTS.movie.detail(id), { signal });
  return mapApiMovie(data);
}

export async function getRecommendedMovies(
  id: number,
  signal?: AbortSignal
): Promise<Movie[]> {
  const data = await request<ApiPaginatedResult<ApiMovie>>(
    ENDPOINTS.movie.recommendations(id),
    { signal }
  );
  return data.results.map((movie) => mapApiMovie(movie));
}

export type DiscoverSortBy = 'popularity' | 'vote_average' | 'release_date';

const DISCOVER_SORT: Record<DiscoverSortBy, string> = {
  popularity: 'popularity.desc',
  vote_average: 'vote_average.desc',
  release_date: 'primary_release_date.desc',
};

export interface DiscoverMoviesOptions {
  sortBy?: DiscoverSortBy;
  page?: number;
  minVoteCount?: number;
  signal?: AbortSignal;
}

export async function discoverMovies(
  genreId: number,
  options: DiscoverMoviesOptions = {}
): Promise<Movie[]> {
  const { sortBy = 'popularity', page = 1, minVoteCount, signal } = options;

  const params: Record<string, string | number | boolean | undefined> = {
    with_genres: genreId,
    sort_by: DISCOVER_SORT[sortBy],
  };
  if (page > 1) {
    params.page = page;
  }
  if (minVoteCount !== undefined) {
    params['vote_count.gte'] = minVoteCount;
  }

  const data = await request<ApiPaginatedResult<ApiMovie>>(ENDPOINTS.discover.movie(), {
    params,
    signal,
  });
  return data.results.map((movie) => mapApiMovie(movie));
}

export async function getPopularMovies(signal?: AbortSignal): Promise<Movie[]> {
  const data = await request<ApiPaginatedResult<ApiMovie>>(ENDPOINTS.movie.popular(), {
    signal,
  });
  return data.results.map((movie) => mapApiMovie(movie));
}

export async function getTopRatedMovies(signal?: AbortSignal): Promise<Movie[]> {
  const data = await request<ApiPaginatedResult<ApiMovie>>(ENDPOINTS.movie.topRated(), {
    signal,
  });
  return data.results.map((movie) => mapApiMovie(movie));
}

export async function getUpcomingMovies(signal?: AbortSignal): Promise<Movie[]> {
  const data = await request<ApiPaginatedResult<ApiMovie>>(ENDPOINTS.movie.upcoming(), {
    signal,
  });
  return data.results.map((movie) => mapApiMovie(movie));
}

export async function getNowPlayingMovies(signal?: AbortSignal): Promise<Movie[]> {
  const data = await request<ApiPaginatedResult<ApiMovie>>(ENDPOINTS.movie.nowPlaying(), {
    signal,
  });
  return data.results.map((movie) => mapApiMovie(movie));
}

export async function getTrendingMovies(signal?: AbortSignal): Promise<Movie[]> {
  const data = await request<ApiPaginatedResult<ApiMovie>>(ENDPOINTS.trending.movies(), {
    signal,
  });
  return data.results.map((movie) => mapApiMovie(movie));
}
