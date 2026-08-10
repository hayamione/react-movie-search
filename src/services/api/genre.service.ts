import type { ApiGenreList } from '../../types/api';
import type { Genre } from '../../types/genre';
import { request } from './client';
import { ENDPOINTS } from './endpoints';

export async function getMovieGenres(signal?: AbortSignal): Promise<Genre[]> {
  const data = await request<ApiGenreList>(ENDPOINTS.genre.list(), { signal });
  return data.genres;
}
