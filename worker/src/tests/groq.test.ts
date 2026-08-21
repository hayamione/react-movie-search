import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_TOOL_ROUNDS, runConcierge } from '../groq';
import type { ConciergeEnv } from '../types';

const env: ConciergeEnv = { GROQ_API_KEY: 'test-groq-key', TMDB_API_KEY: 'test-tmdb-key' };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const interstellarTmdb = {
  id: 157336,
  title: 'Interstellar',
  poster_path: '/interstellar.jpg',
  backdrop_path: '/interstellar-bg.jpg',
  release_date: '2014-11-05',
  vote_average: 8.4,
  genre_ids: [878, 18],
  overview: 'A team of explorers travel through a wormhole in space.',
};

const gravityTmdb = {
  id: 49047,
  title: 'Gravity',
  poster_path: '/gravity.jpg',
  backdrop_path: '/gravity-bg.jpg',
  release_date: '2013-10-03',
  vote_average: 7.3,
  genre_ids: [878, 18],
  overview: 'Two astronauts work together to survive after an accident.',
};

/** Builds a Groq chat-completion response with a single assistant message. */
function groqMessageResponse(message: Record<string, unknown>) {
  return jsonResponse({ choices: [{ index: 0, message, finish_reason: 'stop' }] });
}

function toolCallMessage(name: string, args: unknown, id = 'call_1') {
  return groqMessageResponse({
    role: 'assistant',
    content: null,
    tool_calls: [{ id, type: 'function', function: { name, arguments: JSON.stringify(args) } }],
  });
}

function finalMessage(payload: Record<string, unknown>) {
  return groqMessageResponse({ role: 'assistant', content: JSON.stringify(payload) });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('runConcierge — simple discovery request', () => {
  it('calls discover_movies and returns real TMDB movies with AI commentary', async () => {
    fetchMock
      .mockResolvedValueOnce(
        toolCallMessage('discover_movies', { with_genres: [878], sort_by: 'popularity.desc' })
      )
      .mockResolvedValueOnce(
        jsonResponse({ page: 1, results: [interstellarTmdb], total_pages: 1, total_results: 1 })
      )
      .mockResolvedValueOnce(
        finalMessage({
          commentary: 'Here are some popular sci-fi picks.',
          detectedMood: 'Adventurous',
          matchedGenres: ['Science Fiction'],
        })
      );

    const result = await runConcierge('Show me some popular sci-fi movies', env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.commentary).toBe('Here are some popular sci-fi picks.');
      expect(result.data.movies).toHaveLength(1);
      expect(result.data.movies[0]).toMatchObject({ id: 157336, title: 'Interstellar' });
    }

    // First call is to Groq, second to TMDB discover, third back to Groq.
    const discoverUrl = new URL(fetchMock.mock.calls[1][0] as string);
    expect(discoverUrl.pathname).toBe('/3/discover/movie');
  });
});

describe('runConcierge — movie reference request (search -> recommendations)', () => {
  it('resolves a title via search_movie before calling get_recommendations', async () => {
    fetchMock
      .mockResolvedValueOnce(toolCallMessage('search_movie', { query: 'Interstellar' }, 'call_search'))
      .mockResolvedValueOnce(
        jsonResponse({ page: 1, results: [interstellarTmdb], total_pages: 1, total_results: 1 })
      )
      .mockResolvedValueOnce(toolCallMessage('get_recommendations', { movieId: 157336 }, 'call_recs'))
      .mockResolvedValueOnce(
        jsonResponse({ page: 1, results: [gravityTmdb], total_pages: 1, total_results: 1 })
      )
      .mockResolvedValueOnce(
        finalMessage({
          commentary: 'Since you loved Interstellar, try Gravity next.',
          detectedMood: 'Awe-inspiring',
          matchedGenres: ['Science Fiction', 'Drama'],
        })
      );

    const result = await runConcierge('I loved Interstellar, what else should I watch?', env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.movies.map((m) => m.id)).toEqual([157336, 49047]);
    }

    // Verify get_recommendations was called with a numeric TMDB id, not a title.
    const recsUrl = new URL(fetchMock.mock.calls[3][0] as string);
    expect(recsUrl.pathname).toBe('/3/movie/157336/recommendations');
  });
});

describe('runConcierge — discover request with genre/year filters', () => {
  it('forwards whitelisted filters to discoverMovies', async () => {
    fetchMock
      .mockResolvedValueOnce(
        toolCallMessage('discover_movies', {
          with_genres: [18],
          primary_release_year: 2014,
          vote_count_gte: 200,
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({ page: 1, results: [interstellarTmdb], total_pages: 1, total_results: 1 })
      )
      .mockResolvedValueOnce(finalMessage({ commentary: 'A strong drama pick from 2014.' }));

    const result = await runConcierge('Find a good drama from 2014', env);

    expect(result.success).toBe(true);

    const discoverUrl = new URL(fetchMock.mock.calls[1][0] as string);
    expect(discoverUrl.searchParams.get('with_genres')).toBe('18');
    expect(discoverUrl.searchParams.get('primary_release_year')).toBe('2014');
    expect(discoverUrl.searchParams.get('vote_count.gte')).toBe('200');
  });
});

describe('runConcierge — unknown tool call', () => {
  it('rejects a tool name outside the whitelist without executing anything', async () => {
    fetchMock.mockResolvedValueOnce(toolCallMessage('delete_all_movies', {}));

    const result = await runConcierge('Do something unexpected', env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
    // Only the one Groq call happened — no downstream TMDB call.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('runConcierge — invalid tool arguments', () => {
  it('rejects malformed JSON arguments', async () => {
    fetchMock.mockResolvedValueOnce(
      groqMessageResponse({
        role: 'assistant',
        content: null,
        tool_calls: [
          { id: 'call_1', type: 'function', function: { name: 'search_movie', arguments: '{not json' } },
        ],
      })
    );

    const result = await runConcierge('Find a movie', env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('surfaces tmdb.ts validation failures (e.g. a negative movieId)', async () => {
    fetchMock.mockResolvedValueOnce(toolCallMessage('get_recommendations', { movieId: -1 }));

    const result = await runConcierge('Recommend something', env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
    // Rejected before any TMDB HTTP call.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('runConcierge — Groq API failure', () => {
  it('returns a structured error on network failure', async () => {
    fetchMock.mockRejectedValueOnce(new Error('boom'));

    const result = await runConcierge('Find a movie', env);

    expect(result).toEqual({
      success: false,
      error: { code: 'NETWORK_ERROR', message: expect.any(String) },
    });
  });

  it('returns a structured error on a non-2xx response without leaking the body', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: { message: 'invalid_api_key' } }, 401));

    const result = await runConcierge('Find a movie', env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('UPSTREAM_ERROR');
      expect(result.error.message).not.toContain('invalid_api_key');
    }
  });
});

describe('runConcierge — missing Groq API key', () => {
  it('fails fast with a config error and never calls fetch', async () => {
    const result = await runConcierge('Find a movie', { TMDB_API_KEY: 'test-tmdb-key' });

    expect(result).toEqual({
      success: false,
      error: { code: 'CONFIG_ERROR', message: expect.any(String) },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('runConcierge — TMDB tool failure', () => {
  it('propagates a TMDB upstream failure as a structured error', async () => {
    fetchMock
      .mockResolvedValueOnce(toolCallMessage('search_movie', { query: 'Interstellar' }))
      .mockResolvedValueOnce(jsonResponse({ status_message: 'Invalid API key' }, 401));

    const result = await runConcierge('Find Interstellar', env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('UPSTREAM_ERROR');
    }
  });
});

describe('runConcierge — maximum tool-call rounds', () => {
  it('stops after MAX_TOOL_ROUNDS and returns a structured error', async () => {
    for (let i = 0; i < MAX_TOOL_ROUNDS; i++) {
      fetchMock
        .mockResolvedValueOnce(toolCallMessage('search_movie', { query: 'Interstellar' }, `call_${i}`))
        .mockResolvedValueOnce(
          jsonResponse({ page: 1, results: [interstellarTmdb], total_pages: 1, total_results: 1 })
        );
    }

    const result = await runConcierge('Keep searching forever', env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('TOOL_LOOP_EXCEEDED');
    }
    // Exactly MAX_TOOL_ROUNDS Groq calls + MAX_TOOL_ROUNDS TMDB calls, then stop.
    expect(fetchMock).toHaveBeenCalledTimes(MAX_TOOL_ROUNDS * 2);
  });
});

describe('runConcierge — final response contract', () => {
  it('returns real TMDB Movie objects, not AI-generated ones', async () => {
    fetchMock
      .mockResolvedValueOnce(toolCallMessage('search_movie', { query: 'Interstellar' }))
      .mockResolvedValueOnce(
        jsonResponse({ page: 1, results: [interstellarTmdb], total_pages: 1, total_results: 1 })
      )
      .mockResolvedValueOnce(
        finalMessage({
          commentary: 'Interstellar is a great pick.',
          // An adversarial/hallucinating model might try to smuggle a movie in here;
          // matchedGenres is a plain string array and cannot carry a Movie object.
          matchedGenres: ['Science Fiction'],
        })
      );

    const result = await runConcierge('Tell me about Interstellar', env);

    expect(result.success).toBe(true);
    if (result.success) {
      // Every field on the returned movie must trace back to the TMDB fixture,
      // proving it was constructed by tmdb.ts's mapper, not by Groq.
      expect(result.data.movies).toEqual([
        {
          id: 157336,
          title: 'Interstellar',
          posterSrc: expect.stringContaining('/interstellar.jpg'),
          backdropSrc: expect.stringContaining('/interstellar-bg.jpg'),
          releaseDate: '2014-11-05',
          voteAverage: 8.4,
          genres: undefined,
          overview: interstellarTmdb.overview,
          tagline: undefined,
        },
      ]);
      expect(result.data.detectedMood).toBeUndefined();
      expect(result.data.matchedGenres).toEqual(['Science Fiction']);
    }
  });
});
