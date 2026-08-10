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
