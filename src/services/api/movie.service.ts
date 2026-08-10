import type { ApiMovie, ApiPaginatedResult } from '../../types/api';
import type { Genre } from '../../types/genre';
import type { Movie } from '../../types/movie';
import { buildImageUrl, request } from './client';
import { ENDPOINTS } from './endpoints';

const POSTER_SIZE = 'w342' as const;

export function mapApiMovie(movie: ApiMovie, genres: Genre[] = []): Movie {
  const genreNames = new Map(genres.map((genre) => [genre.id, genre.name]));

  return {
    id: movie.id,
    title: movie.title,
    posterSrc: movie.poster_path ? buildImageUrl(movie.poster_path, POSTER_SIZE) : undefined,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    genres: (movie.genre_ids ?? [])
      .map((id) => ({ id, name: genreNames.get(id) ?? '' }))
      .filter((genre) => genre.name !== ''),
  };
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
