import { createResourceHook } from './createResourceHook';
import type { MovieCredits } from '../types/credit';
import { getMovieCredits } from '../services/api/movie.service';

export const useMovieCredits = createResourceHook<MovieCredits>(getMovieCredits);