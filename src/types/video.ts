import type { IsoDateTime } from './common';

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site?: string;
  size?: number;
  type?: string;
  publishedAt?: IsoDateTime;
}