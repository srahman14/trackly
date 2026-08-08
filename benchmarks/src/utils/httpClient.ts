import { config } from "../config";

export interface TimedResponse<T> {
  status: number;
  ok: boolean;
  data: T | null;
  errorMessage: string | null;
  latencyMs: number;
}

function authHeaders(): Record<string, string> {
  if (config.authBearer) return { Authorization: `Bearer ${config.authBearer}` };
  if (config.authCookie) return { Cookie: config.authCookie };
  // config.ts already throws if neither is set, this is just for TS narrowing
  return {};
}

/**
 * Calls a route under API_BASE_URL, unwraps the project's `{ data }` / `{ error }`
 * response shape (see JobBoard.md — apiSuccess/apiErrorResponse), and always
 * returns rather than throwing so callers can tally errors as data points,
 * not exceptions.
 */
export async function apiCall<T = unknown>(
  path: string,
  init: RequestInit = {},
  timeoutMs = 15_000
): Promise<TimedResponse<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();

  try {
    const res = await fetch(`${config.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...(init.headers ?? {}),
      },
      signal: controller.signal,
    });
    const latencyMs = performance.now() - start;

    let body: any = null;
    try {
      body = await res.json();
    } catch {
      // non-JSON or empty body — leave as null
    }

    if (!res.ok) {
      return {
        status: res.status,
        ok: false,
        data: null,
        errorMessage: body?.error?.message ?? `HTTP ${res.status}`,
        latencyMs,
      };
    }

    return {
      status: res.status,
      ok: true,
      data: (body?.data ?? body) as T,
      errorMessage: null,
      latencyMs,
    };
  } catch (err) {
    const latencyMs = performance.now() - start;
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: 0,
      ok: false,
      data: null,
      errorMessage: controller.signal.aborted ? `Timed out after ${timeoutMs}ms` : message,
      latencyMs,
    };
  } finally {
    clearTimeout(timer);
  }
}
