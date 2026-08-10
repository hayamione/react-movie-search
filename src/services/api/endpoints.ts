export const ENDPOINTS = {
  movie: {
    popular: () => '/movie/popular',
    topRated: () => '/movie/top_rated',
    upcoming: () => '/movie/upcoming',
    nowPlaying: () => '/movie/now_playing',
    detail: (id: number | string) => `/movie/${id}`,
    credits: (id: number | string) => `/movie/${id}/credits`,
  },
  genre: {
    list: () => '/genre/movie/list',
  },
  search: {
    movie: () => '/search/movie',
    person: () => '/search/person',
  },
  person: {
    detail: (id: number | string) => `/person/${id}`,
  },
} as const;
