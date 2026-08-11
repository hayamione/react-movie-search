import type {
  ApiCredit,
  ApiCredits,
  ApiMovie,
  ApiPaginatedResult,
  ApiVideo,
  ApiVideos,
} from '../../types/api';
import type { Credit, MovieCredits } from '../../types/credit';
import type { Genre } from '../../types/genre';
import type { Movie, MovieDetails } from '../../types/movie';
import type { MovieVideo } from '../../types/video';
import { buildImageUrl, request } from './client';
import { ENDPOINTS } from './endpoints';

const POSTER_SIZE = 'w342' as const;
const PROFILE_SIZE = 'w185' as const;

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
    originalLanguage: movie.original_language,
    runtime: movie.runtime,
    status: movie.status,
    budget: movie.budget,
    revenue: movie.revenue,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
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

export async function getSimilarMovies(
  id: number,
  signal?: AbortSignal
): Promise<Movie[]> {
  const data = await request<ApiPaginatedResult<ApiMovie>>(ENDPOINTS.movie.similar(id), {
    signal,
  });
  return data.results.map((movie) => mapApiMovie(movie));
}

function mapApiCredit(credit: ApiCredit): Credit {
  return {
    id: credit.id,
    name: credit.name,
    profileSrc: credit.profile_path
      ? buildImageUrl(credit.profile_path, PROFILE_SIZE)
      : undefined,
    character: credit.character,
    job: credit.job,
    order: credit.order,
  };
}

export async function getMovieCredits(
  id: number,
  signal?: AbortSignal
): Promise<MovieCredits> {
  const data = await request<ApiCredits>(ENDPOINTS.movie.credits(id), { signal });
  return {
    id: data.id,
    cast: data.cast.map(mapApiCredit),
    crew: data.crew.map(mapApiCredit),
  };
}

function mapApiVideo(video: ApiVideo): MovieVideo {
  return {
    id: video.id,
    key: video.key,
    name: video.name,
    site: video.site,
    size: video.size,
    type: video.type,
    publishedAt: video.published_at,
  };
}

export async function getMovieVideos(
  id: number,
  signal?: AbortSignal
): Promise<MovieVideo[]> {
  const data = await request<ApiVideos>(ENDPOINTS.movie.videos(id), { signal });
  return data.results.map(mapApiVideo);
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
