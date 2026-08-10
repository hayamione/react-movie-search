import type { EntityId } from './common';

export interface Person {
  id: EntityId;
  name: string;
  profileSrc?: string;
  character?: string;
  department?: string;
}
