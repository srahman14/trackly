/**
 * Central config for the benchmark suite. Everything is env-driven so this
 * folder can run against local dev, a staging deploy, or CI without code
 * changes.
 *
 * Required:
 *   API_BASE_URL                 e.g. http://localhost:3000
 *   SUPABASE_URL                 your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY    service-role key (seeding/cleanup only —
 *                                 never used to call your app's API)
 *
 * Auth (pick ONE — see README "Auth" section for how to obtain it):
 *   BENCHMARK_AUTH_BEARER        raw access_token, sent as `Authorization: Bearer <token>`
 *   BENCHMARK_AUTH_COOKIE        raw `Cookie:` header string copied from a
 *                                 logged-in browser session (needed if
 *                                 requireUser() only reads cookies, not
 *                                 bearer tokens)
 *
 * Optional tuning:
 *   KEEP_FIXTURES=true           don't delete seeded companies/documents
 *                                 after the extraction-accuracy track (handy
 *                                 for debugging a failing fixture)
 *   E2E_ANALYZE_TIMEOUT_MS       per-request timeout for the synchronous
 *                                 /analyze call (default 30000)
 *   API_PERF_CONCURRENCY         virtual users for the API perf track (default 5)
 *   API_PERF_REQUESTS_PER_VU     requests per virtual user per endpoint (default 10)
 */

import { config as loadDotenv } from "dotenv";
import path from "node:path";

loadDotenv({ path: path.resolve(__dirname, "../.env") });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Copy benchmarks/.env.example to benchmarks/.env and fill it in.`
    );
  }
  return value;
}

function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export const config = {
  apiBaseUrl: (process.env.API_BASE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  authBearer: process.env.BENCHMARK_AUTH_BEARER,
  authCookie: process.env.BENCHMARK_AUTH_COOKIE,

  keepFixtures: process.env.KEEP_FIXTURES === "true",
  e2eAnalyzeTimeoutMs: optionalInt("E2E_ANALYZE_TIMEOUT_MS", 30_000),
  apiPerfConcurrency: optionalInt("API_PERF_CONCURRENCY", 5),
  apiPerfRequestsPerVu: optionalInt("API_PERF_REQUESTS_PER_VU", 10),

  resultsDir: path.resolve(__dirname, "../results"),
  fixturesDir: path.resolve(__dirname, "data/fixtures"),
};

if (!config.authBearer && !config.authCookie) {
  throw new Error(
    "Set either BENCHMARK_AUTH_BEARER or BENCHMARK_AUTH_COOKIE in benchmarks/.env — see README for how to grab one."
  );
}
