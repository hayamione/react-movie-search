import type { Genre } from './genre';
import type { EntityId } from './common';

export interface Movie {
  id: EntityId;
  title: string;
  posterSrc?: string;
  releaseDate?: string;
  voteAverage?: number;
  genres?: Genre[];
}
