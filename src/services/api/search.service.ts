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

export async function searchMovies(query: string, signal?: AbortSignal): Promise<Movie[]> {
  const data = await request<ApiPaginatedResult<ApiMovie>>(ENDPOINTS.search.movie(), {
    params: { query },
    signal,
  });
  return data.results.map((movie) => mapApiMovie(movie));
}

export async function searchPeople(query: string, signal?: AbortSignal): Promise<Person[]> {
  const data = await request<ApiPaginatedResult<ApiPerson>>(ENDPOINTS.search.person(), {
    params: { query },
    signal,
  });
  return data.results.map(mapApiPerson);
}
