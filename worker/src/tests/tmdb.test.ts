import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { discoverMovies, getRecommendations, searchMovie } from '../tmdb';
import type { TmdbEnv } from '../types';

const env: TmdbEnv = { TMDB_API_KEY: 'test-key' };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const interstellar = {
  id: 157336,
  title: 'Interstellar',
  poster_path: '/interstellar.jpg',
  backdrop_path: '/interstellar-bg.jpg',
  release_date: '2014-11-05',
  vote_average: 8.4,
  genre_ids: [878, 18],
  overview: 'A team of explorers travel through a wormhole.',
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('searchMovie', () => {
  it('resolves a known movie to a real TMDB record', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ page: 1, results: [interstellar], total_pages: 1, total_results: 1 })
    );

    const result = await searchMovie({ query: 'Interstellar' }, env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.results).toHaveLength(1);
      expect(result.data.results[0]).toMatchObject({
        id: 157336,
        title: 'Interstellar',
        posterSrc: expect.stringContaining('/interstellar.jpg'),
      });
    }

    const calledUrl = new URL(
      (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    );
    expect(calledUrl.pathname).toBe('/3/search/movie');
    expect(calledUrl.searchParams.get('query')).toBe('Interstellar');
    expect(calledUrl.searchParams.get('api_key')).toBe('test-key');
  });

  it('handles no results', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ page: 1, results: [], total_pages: 0, total_results: 0 })
    );

    const result = await searchMovie({ query: 'zzz-not-a-real-movie-zzz' }, env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.results).toEqual([]);
    }
  });

  it('rejects an empty query without calling TMDB', async () => {
    const result = await searchMovie({ query: '   ' }, env);

    expect(result).toEqual({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: expect.any(String) },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects an unreasonable year', async () => {
    const result = await searchMovie({ query: 'Interstellar', year: 1066 }, env);

    expect(result.success).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('getRecommendations', () => {
  it('works from a resolved TMDB id', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({
        page: 1,
        results: [interstellar],
        total_pages: 1,
        total_results: 1,
      })
    );

    const result = await getRecommendations({ movieId: 157336 }, env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.results[0].id).toBe(157336);
    }

    const calledUrl = new URL(
      (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    );
    expect(calledUrl.pathname).toBe('/3/movie/157336/recommendations');
  });

  it('rejects a non-positive-integer movieId without calling TMDB', async () => {
    const result = await getRecommendations({ movieId: -5 }, env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it('reports NOT_FOUND when TMDB returns 404', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ status_message: 'The resource could not be found.' }, 404)
    );

    const result = await getRecommendations({ movieId: 999999999 }, env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('NOT_FOUND');
    }
  });
});

describe('discoverMovies', () => {
  it('supports genre/year/rating filters', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({
        page: 1,
        results: [interstellar],
        total_pages: 1,
        total_results: 1,
      })
    );

    const result = await discoverMovies(
      {
        with_genres: [878],
        primary_release_year: 2014,
        vote_count_gte: 500,
        sort_by: 'vote_average.desc',
      },
      env
    );

    expect(result.success).toBe(true);

    const calledUrl = new URL(
      (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    );
    expect(calledUrl.pathname).toBe('/3/discover/movie');
    expect(calledUrl.searchParams.get('with_genres')).toBe('878');
    expect(calledUrl.searchParams.get('primary_release_year')).toBe('2014');
    expect(calledUrl.searchParams.get('vote_count.gte')).toBe('500');
    expect(calledUrl.searchParams.get('sort_by')).toBe('vote_average.desc');
  });

  it('rejects invalid parameters without calling TMDB', async () => {
    const badSortBy = await discoverMovies({ sort_by: 'not-a-real-sort' as never }, env);
    expect(badSortBy.success).toBe(false);

    const badDate = await discoverMovies({ primary_release_date_gte: '14-2014' }, env);
    expect(badDate.success).toBe(false);

    const badGenres = await discoverMovies({ with_genres: [-1] }, env);
    expect(badGenres.success).toBe(false);

    expect(fetch).not.toHaveBeenCalled();
  });

  it('enforces the result limit even when TMDB returns a full page', async () => {
    const manyResults = Array.from({ length: 20 }, (_, i) => ({
      ...interstellar,
      id: interstellar.id + i,
    }));
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ page: 1, results: manyResults, total_pages: 1, total_results: 20 })
    );

    const result = await discoverMovies({}, env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.results.length).toBeLessThanOrEqual(10);
      expect(result.data.results.length).toBeGreaterThanOrEqual(6);
    }
  });
});

describe('TMDB error handling', () => {
  it('handles network errors safely', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('boom'));

    const result = await searchMovie({ query: 'Interstellar' }, env);

    expect(result).toEqual({
      success: false,
      error: { code: 'NETWORK_ERROR', message: expect.any(String) },
    });
  });

  it('handles non-2xx TMDB responses without leaking upstream details', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      jsonResponse({ status_message: 'Invalid API key' }, 401)
    );

    const result = await searchMovie({ query: 'Interstellar' }, env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('UPSTREAM_ERROR');
    }
  });

  it('reports a config error when the API key is missing, without calling fetch again', async () => {
    const result = await searchMovie({ query: 'Interstellar' }, {});

    expect(result).toEqual({
      success: false,
      error: { code: 'CONFIG_ERROR', message: expect.any(String) },
    });
    expect(fetch).not.toHaveBeenCalled();
  });
});
