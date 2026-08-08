# Trackly Benchmarks

Standalone benchmark suite that hits your **real, running app** (local dev or
a deployment) over HTTP and reports quantifiable metrics as JSON. This is
deliberately separate from `jest --coverage` — coverage tells you which
lines ran, not whether extraction is accurate, whether the pipeline works
against real sites, or how the API performs under load. See the
conversation this came from for the full reasoning; short version: your
scraping/extraction pipeline (the actual differentiator) has no unit tests
yet, so a coverage number would be misleading either way. This suite
measures *behavior*, not line execution.

## Three tracks

1. **Extraction accuracy** (`extraction`) — runs `POST /api/privacy-documents/[id]/extract`
   against local HTML fixtures with hand-labeled ground truth. No network
   calls to third-party sites, fully repeatable. Reports precision/recall/F1
   per field.
2. **Pipeline end-to-end** (`e2e`) — creates a real job via `POST /api/jobs`
   against a real live posting URL, then calls
   `POST /api/companies/[id]/analyze?force=true` (synchronous, so no
   polling needed) and records the outcome. Hits real third-party sites —
   run this one sparingly, not on every commit.
3. **API performance** (`api`) — concurrent load test against the Jobs CRUD
   routes (`GET/POST/PATCH/DELETE /api/jobs`). Reports p50/p95/p99 latency
   and error rate per endpoint.

## Setup

```bash
cd benchmarks
npm install --no-save tsx dotenv @supabase/supabase-js typescript @types/node
cp .env.example .env
# fill in .env — see "Auth" below for the tricky part
```

(If you'd rather these live in your main `package.json` as devDependencies,
that's fine too — nothing here assumes its own `package.json`.)

## Auth

Every route these tracks hit goes through your real `requireUser()`, so the
benchmark needs a valid session for a real user in your `auth.users` table.
Two options, pick whichever matches how `requireUser()` reads sessions:

- **Cookie (safest default, since your server client is cookie-based per
  `JobBoard.md`):** log into your app in a browser, open DevTools →
  Application → Cookies, copy the full `Cookie` header value (or use the
  Network tab on any authenticated request and copy the `cookie` request
  header verbatim) into `BENCHMARK_AUTH_COOKIE`.
- **Bearer token:** if you extend `requireUser()` to also accept
  `Authorization: Bearer <access_token>`, you can instead sign in via
  `supabase.auth.signInWithPassword()` for a dedicated benchmark user and
  put the resulting `access_token` in `BENCHMARK_AUTH_BEARER`. Not wired up
  automatically here since it depends on a change to your auth layer this
  doc can't assume you've made.

Either way, **use a dedicated benchmark account**, not your real one — the
API performance track creates and deletes real rows under this user.

`SUPABASE_SERVICE_ROLE_KEY` is used *only* to seed/clean up the raw HTML
fixture rows for the extraction-accuracy track (there's no HTTP route for
inserting arbitrary `raw_text`, since in production that's only ever
written by the live scraper). It's never used to call your app's own API —
every other read/write goes through real HTTP requests with the session
above, so RLS and `requireUser()` are actually exercised.

## Run

```bash
npx tsx src/run.ts                    # all three tracks
npx tsx src/run.ts --track=extraction # just one
npx tsx src/run.ts --track=extraction,api
```

Output: `benchmarks/results/<timestamp>.json` (also mirrored to
`results/latest.json` for easy scripting) plus a console summary.

## Extending

- **More fixtures:** add an HTML file to `src/data/fixtures/` and an entry
  to `FIXTURES` in `src/data/fixtures.ts` with hand-written ground truth.
  Three synthetic starter fixtures are included (`fernbank`, `halcyon`,
  `loopwell` — matching your existing fictional-company convention) —
  they're synthetic on purpose (real privacy policy text is copyrighted;
  writing your own avoids that entirely). Swap in real saved pages as you
  collect them — save the raw HTML (view-source, not the rendered page) so
  footer/nav structure survives.
- **More corpus entries:** add real job posting URLs to
  `src/data/corpus.ts`. Mix ATS platforms and include at least one you
  expect to fail (e.g. a LinkedIn-hosted posting your `robots.ts` should
  correctly refuse) — a corpus with zero expected failures isn't testing
  the failure paths.
- **Turning results into CV numbers:** `results/latest.json` has everything
  needed — e.g. `tracks.extractionAccuracy.overallF1`,
  `tracks.pipelineE2E.successRate`,
  `tracks.apiPerformance.endpoints[].latency.p95`. Re-run a few times over
  a week and report a range/average rather than a single lucky run.

## Known gaps (be upfront about these, don't paper over them)

- `sharesWithThirdParties` / `usesAiScreening` are presence-detectors, not
  true yes/no answers (documented limitation in `extractor.ts`). The
  `halcyon-negation` fixture is specifically designed to quantify this
  false-positive rate rather than hide it — if you "fix" that fixture's
  expected values to make the score look better, you've defeated the point.
- The e2e track's corpus is small (3 seed URLs) until you add your own —
  a 3-sample success rate isn't statistically meaningful on its own, treat
  it as a smoke test until the corpus grows to 15–20+.
