import type { EntityId, IsoDate, IsoDateTime } from './common';

export interface ApiMovie {
  id: EntityId;
  title: string;
  original_title?: string;
  original_language?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: IsoDate;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: EntityId[];
  genres?: ApiGenre[];
  overview?: string;
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  popularity?: number;
  production_companies?: ApiProductionCompany[];
  spoken_languages?: ApiSpokenLanguage[];
}

export interface ApiGenre {
  id: EntityId;
  name: string;
}

export interface ApiProductionCompany {
  id: EntityId;
  name: string;
  logo_path?: string | null;
  origin_country?: string;
}

export interface ApiSpokenLanguage {
  iso_639_1: string;
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

export interface ApiCredit {
  id: EntityId;
  name: string;
  profile_path?: string | null;
  character?: string;
  job?: string;
  department?: string;
  order?: number;
}

export interface ApiCredits {
  id: EntityId;
  cast: ApiCredit[];
  crew: ApiCredit[];
}

export interface ApiVideo {
  id: string;
  key: string;
  name: string;
  site?: string;
  size?: number;
  type?: string;
  official?: boolean;
  published_at?: IsoDateTime;
}

export interface ApiVideos {
  id: EntityId;
  results: ApiVideo[];
}

export interface ApiWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path?: string | null;
  display_priority?: number;
}

export interface ApiWatchProviderRegion {
  link?: string;
  flatrate?: ApiWatchProvider[];
  rent?: ApiWatchProvider[];
  buy?: ApiWatchProvider[];
}

export interface ApiWatchProvidersResponse {
  id: number;
  results: Record<string, ApiWatchProviderRegion>;
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
