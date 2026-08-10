import type { ApiMovie, ApiPaginatedResult, ApiPerson } from '../../types/api';
import type { Movie } from '../../types/movie';
import type { Person } from '../../types/person';
import { buildImageUrl, request } from './client';
import { ENDPOINTS } from './endpoints';
import { mapApiMovie } from './movie.service';

const PROFILE_SIZE = 'w185' as const;

function mapApiPerson(person: ApiPerson): Person {
  return {
    id: person.id,
    name: person.name,
    profileSrc: person.profile_path
      ? buildImageUrl(person.profile_path, PROFILE_SIZE)
      : undefined,
    character: person.character,
    department: person.known_for_department,
  };
}

export interface SearchMoviesOptions {
  page?: number;
  year?: number;
  genreId?: number;
  signal?: AbortSignal;
}

export interface SearchMoviesResult {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export async function searchMovies(
  query: string,
  options: SearchMoviesOptions = {}
): Promise<SearchMoviesResult> {
  const { page = 1, year, genreId, signal } = options;

  const params: Record<string, string | number | boolean | undefined> = { query };
  if (page > 1) {
    params.page = page;
  }
  if (year) {
    params.year = year;
  }

  const data = await request<ApiPaginatedResult<ApiMovie>>(ENDPOINTS.search.movie(), {
    params,
    signal,
  });

  const filtered = genreId
    ? data.results.filter((movie) => movie.genre_ids?.includes(genreId))
    : data.results;

  return {
    movies: filtered.map((movie) => mapApiMovie(movie)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function searchPeople(query: string, signal?: AbortSignal): Promise<Person[]> {
  const data = await request<ApiPaginatedResult<ApiPerson>>(ENDPOINTS.search.person(), {
    params: { query },
    signal,
  });
  return data.results.map(mapApiPerson);
}
