import { runConcierge } from './groq';
import type { ToolErrorCode } from './types';

export interface Env {
  GROQ_API_KEY?: string;
  TMDB_API_KEY?: string;
  /** Optional override for the Groq model id; defaults to DEFAULT_GROQ_MODEL in groq.ts. */
  GROQ_MODEL?: string;
  ENVIRONMENT?: string;
}

/** Maps a structured tool/orchestration error code to an HTTP status. */
function statusForErrorCode(code: ToolErrorCode): number {
  switch (code) {
    case 'VALIDATION_ERROR':
      return 400;
    case 'NOT_FOUND':
      return 404;
    case 'CONFIG_ERROR':
      return 500;
    case 'TOOL_LOOP_EXCEEDED':
      return 504;
    case 'NETWORK_ERROR':
    case 'UPSTREAM_ERROR':
    case 'MALFORMED_RESPONSE':
    default:
      return 502;
  }
}

const ALLOWED_ORIGINS = [
  'https://hayamione.github.io',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('Origin');
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function jsonResponse(
  data: Record<string, unknown>,
  status: number,
  request: Request,
  extraHeaders: HeadersInit = {}
): Response {
  const corsHeaders = getCorsHeaders(request);
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

/**
 * Isolated rate-limiting placeholder utility.
 * Can be expanded with Cloudflare KV / Durable Objects or in-memory checks in future phases.
 */
export function checkRateLimit(
  request: Request,
  _env: Env
): { allowed: boolean; retryAfterSeconds?: number } {
  // Placeholder: allow all requests for Phase A
  const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
  if (!clientIp) {
    return { allowed: true };
  }
  return { allowed: true };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
      });
    }

    // Only route /api/concierge
    if (url.pathname !== '/api/concierge') {
      return jsonResponse(
        { success: false, error: 'Endpoint not found.' },
        404,
        request
      );
    }

    // Validate HTTP Method
    if (request.method !== 'POST') {
      return jsonResponse(
        { success: false, error: 'Method not allowed. Use POST.' },
        405,
        request,
        { Allow: 'POST, OPTIONS' }
      );
    }

    // Validate Content-Type
    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.includes('application/json')) {
      return jsonResponse(
        { success: false, error: 'Content-Type must be application/json.' },
        415,
        request
      );
    }

    // Check rate limit placeholder
    const rateLimit = checkRateLimit(request, env);
    if (!rateLimit.allowed) {
      return jsonResponse(
        { success: false, error: 'Too many requests. Please try again later.' },
        429,
        request,
        { 'Retry-After': String(rateLimit.retryAfterSeconds || 60) }
      );
    }

    // Parse JSON payload
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        { success: false, error: 'Malformed JSON payload.' },
        400,
        request
      );
    }

    // Validate payload shape
    if (
      typeof body !== 'object' ||
      body === null ||
      !('prompt' in body) ||
      typeof (body as { prompt: unknown }).prompt !== 'string'
    ) {
      return jsonResponse(
        {
          success: false,
          error: "Request body must contain a string property 'prompt'.",
        },
        400,
        request
      );
    }

    const trimmedPrompt = (body as { prompt: string }).prompt.trim();

    if (trimmedPrompt.length < 3) {
      return jsonResponse(
        {
          success: false,
          error: 'Prompt must be at least 3 characters long.',
        },
        400,
        request
      );
    }

    if (trimmedPrompt.length > 300) {
      return jsonResponse(
        {
          success: false,
          error: 'Prompt must not exceed 300 characters.',
        },
        400,
        request
      );
    }

    const result = await runConcierge(trimmedPrompt, env);

    if (!result.success) {
      return jsonResponse(
        { success: false, error: result.error.message },
        statusForErrorCode(result.error.code),
        request
      );
    }

    return jsonResponse(
      {
        success: true,
        data: result.data,
      },
      200,
      request
    );
  },
};
