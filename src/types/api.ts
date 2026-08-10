import type { EntityId, IsoDate } from './common';

export interface ApiMovie {
  id: EntityId;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: IsoDate;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: EntityId[];
  overview?: string;
  runtime?: number;
  tagline?: string;
}

export interface ApiGenre {
  id: EntityId;
  name: string;
}

export interface ApiPerson {
  id: EntityId;
  name: string;
  profile_path?: string | null;
  character?: string;
  known_for_department?: string;
}

export interface ApiPaginatedResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface ApiGenreList {
  genres: ApiGenre[];
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface MovieInfo {
  Error?: string;
  Poster?: string;
  Title?: string;
  Genre?: string;
  Plot?: string;
  Actors?: string;
  Director?: string;
  Writer?: string;
  BoxOffice?: string;
  Released?: string;
  Runtime?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Production?: string;
  Ratings?: Rating[];
}
