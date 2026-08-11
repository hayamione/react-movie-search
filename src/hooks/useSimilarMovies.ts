import { createResourceHook } from './createResourceHook';
import type { Movie } from '../types/movie';
import { getSimilarMovies } from '../services/api/movie.service';

export const useSimilarMovies = createResourceHook<Movie[]>(getSimilarMovies);