import { createResourceHook } from './createResourceHook';
import type { Movie } from '../types/movie';
import { getRecommendedMovies } from '../services/api/movie.service';

export const useRecommendedMovies = createResourceHook<Movie[]>(getRecommendedMovies);
