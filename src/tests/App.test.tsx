import '@testing-library/jest-dom/vitest';
import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

vi.mock('../hooks/useMovies', () => ({
  useTrendingMovies: () => ({
    movies: [
      {
        id: 1,
        title: 'Featured Movie',
        releaseDate: '2026-01-01',
        voteAverage: 8.5,
        genres: [{ id: 1, name: 'Action' }],
        overview: 'An overview of the featured movie.',
        tagline: 'The tagline.',
      },
    ],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  usePopularMovies: () => ({
    movies: [],
    loading: true,
    error: null,
    refetch: vi.fn(),
  }),
  useTopRatedMovies: () => ({
    movies: [],
    loading: true,
    error: null,
    refetch: vi.fn(),
  }),
  useUpcomingMovies: () => ({
    movies: [],
    loading: true,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock('../hooks/useGenres', () => ({
  useGenres: () => ({
    genres: [],
    loading: true,
    error: null,
    refetch: vi.fn(),
  }),
}));

test('renders the home page with the featured movie and all sections', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Featured Movie');
  expect(screen.getByRole('heading', { name: 'Trending Today' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Popular Movies' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Top Rated Movies' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Upcoming Movies' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Browse by Genre' })).toBeInTheDocument();
});
