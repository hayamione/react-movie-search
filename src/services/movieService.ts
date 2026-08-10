import type { MovieInfo } from '../types/api';

const BASE_URL = 'https://omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY as string;

export async function getMovieData(title: string): Promise<MovieInfo> {
  const response = await fetch(`${BASE_URL}?t=${encodeURIComponent(title)}&plot=full&apikey=${API_KEY}`);
  if (!response.ok) {
    throw new Error(`OMDB API request failed with status ${response.status}`);
  }

  return response.json();
}
