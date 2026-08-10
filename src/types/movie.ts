export interface Movie {
  id: number;
  title: string;
  posterSrc?: string;
  releaseDate?: string;
  voteAverage?: number;
  genres?: string[];
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
