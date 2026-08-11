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

export interface MovieDetails extends Movie {
  originalTitle?: string;
  originalLanguage?: string;
  runtime?: number;
  status?: string;
  budget?: number;
  revenue?: number;
  voteCount?: number;
  popularity?: number;
}
