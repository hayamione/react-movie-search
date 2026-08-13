import type { Genre } from './genre';
import type { EntityId } from './common';

export interface Movie {
  id: EntityId;
  title: string;
  posterSrc?: string;
  backdropSrc?: string;
  releaseDate?: string;
  voteAverage?: number;
  genres?: Genre[];
  overview?: string;
  tagline?: string;
}

export interface ProductionCompany {
  id: EntityId;
  name: string;
  logoSrc?: string;
  originCountry?: string;
}

export interface SpokenLanguage {
  code: string;
  name: string;
}

export interface WatchProvider {
  id: number;
  name: string;
  logoSrc?: string;
  type: 'stream' | 'rent' | 'buy';
}

export interface MovieWatchProviders {
  link?: string;
  providers: WatchProvider[];
}

export interface MovieDetails extends Movie {
  originalTitle?: string;
  originalLanguage?: string;
  runtime?: number;
  status?: string;
  budget?: number;
  revenue?: number;
  voteCount?: number;
  popularity?: number;
  productionCompanies?: ProductionCompany[];
  spokenLanguages?: SpokenLanguage[];
  watchProviders?: MovieWatchProviders;
}
