import { createResourceHook } from './createResourceHook';
import type { MovieDetails } from '../types/movie';
import { getMovieDetails } from '../services/api/movie.service';

export const useMovieDetails = createResourceHook<MovieDetails>(getMovieDetails);
