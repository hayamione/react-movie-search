import type { EntityId } from './common';

export interface Credit {
  id: EntityId;
  name: string;
  profileSrc?: string;
  character?: string;
  job?: string;
  order?: number;
}

export interface MovieCredits {
  id: EntityId;
  cast: Credit[];
  crew: Credit[];
}