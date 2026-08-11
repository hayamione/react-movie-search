export const ENDPOINTS = {
  movie: {
    popular: () => '/movie/popular',
    topRated: () => '/movie/top_rated',
    upcoming: () => '/movie/upcoming',
    nowPlaying: () => '/movie/now_playing',
    detail: (id: number | string) => `/movie/${id}`,
    credits: (id: number | string) => `/movie/${id}/credits`,
    videos: (id: number | string) => `/movie/${id}/videos`,
    recommendations: (id: number | string) => `/movie/${id}/recommendations`,
    similar: (id: number | string) => `/movie/${id}/similar`,
  },
  trending: {
    movies: (timeWindow: 'day' | 'week' = 'week') => `/trending/movie/${timeWindow}`,
  },
  genre: {
    list: () => '/genre/movie/list',
  },
  discover: {
    movie: () => '/discover/movie',
  },
  search: {
    movie: () => '/search/movie',
    person: () => '/search/person',
  },
  person: {
    detail: (id: number | string) => `/person/${id}`,
  },
} as const;
