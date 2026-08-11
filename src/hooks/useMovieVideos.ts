import { createResourceHook } from './createResourceHook';
import type { MovieVideo } from '../types/video';
import { getMovieVideos } from '../services/api/movie.service';

export const useMovieVideos = createResourceHook<MovieVideo[]>(getMovieVideos);