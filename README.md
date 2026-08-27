<div align="center">
  <img src="./public/icons/watermark-logo-light.svg" alt="trackly-logo"/>
</div>

A privacy-first job application tracker. Trackly does the usual job-tracking things: log applications, track status, follow up, but its core differentiator is a **privacy-intelligence engine**: when you log a job, Trackly automatically discovers and analyzes the employer's privacy policy (retention periods, DPO contact, third-party data sharing) so you know what you're agreeing to for every application. 

Built as a full-stack web-app, with particular emphasis on architectural decision-making, graceful failure handling, and end-to-end delivery.

---

## Why this exists

Every job application means handing a company your CV, contact details, and often far more, yet almost nobody reads the privacy policy attached to that exchange. Trackly attacks that gap directly: alongside the normal "did I apply, did I hear back" tracking, it tells you what a company's privacy policy actually says, without you having to read it yourself.

---

## Core features

- **Job tracking**: full CRUD, status pipeline (saved → applied → interviewing → offer/rejected/withdrawn), role type, work mode, salary range, recruiter contact, notes
- **Automated privacy discovery**: on adding a job, Trackly visits the posting page, finds a linked privacy policy (footer/nav link detection), fetches it, and stores it — all in the background, without slowing down job creation
- **Structured privacy extraction**: pulls DPO/contact email, data retention period, data request/erasure link, and flags mentions of third-party sharing or AI-based screening
- **Rules-based privacy score**: a transparent, explainable 0–100 score computed from the extracted fields (no black box)
- **Manual override**: if automated discovery misses (it won't always find it — more on that below), you can paste the privacy policy URL directly
- **Scan history & observability**: a dedicated scan-logs page shows discovery/extraction outcomes per company, with an outcome breakdown chart and a "recent activity" feed on the dashboard
- **Dashboard**: real aggregate metrics (applications, rejections, avg. privacy score) and a weekly application trend chart

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL, Row-Level Security) |
| Validation | Zod |
| Data fetching / caching | TanStack Query |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Scraping | Cheerio + native `fetch` |
| Auth | Supabase Auth (`@supabase/ssr`, JWT-based via `getClaims()`) |

**Why Route Handlers instead of Server Actions:** future consumers (a Chrome extension, a Discord bot) will need real REST endpoints, not React-coupled server actions. Building on Route Handlers from day one means those integrations are additive, not a rewrite.

**Why Cheerio over Playwright/Puppeteer:** most privacy policy pages are server-rendered legal boilerplate, not JS-rendered SPAs. A full headless browser is unnecessary weight for that workload — Cheerio + `fetch` covers the large majority of real-world cases at a fraction of the resource cost. (Playwright remains a reasonable fallback for the minority of cases that need it, not implemented in v1.)

---

## Architecture

### Data model (simplified)

```
companies (shared reference data — not user-owned)
  ├─ privacy_documents (append-only: one row per successful scrape)
  │    └─ privacy_entities (append-only per extraction_method: rule_based | ai)
  └─ scan_logs (per-attempt log, success or failure, scoped to a job)

jobs (user-owned, RLS-scoped)
  └─ generated_emails (data deletion / access request drafts — schema ready, v2 feature)
```

**Companies are shared, not per-user.** Two users applying to the same company share its privacy policy record — the policy doesn't change per applicant. `company_id` is resolved once at job creation and never re-linked, even if the job URL is later edited, to prevent a URL typo fix from silently swapping which company's privacy data is attached.

**Privacy data is append-only and versioned.** Every successful scrape adds a new `privacy_documents` row rather than overwriting the last one; "current" is simply the latest row. This gives free version history (useful for tracking policy changes over time) and is the same design that lets a future AI-based extraction pass coexist with the rule-based one — it just becomes a second `privacy_entities` row with `extraction_method = 'ai'`, no migration required.

### The privacy pipeline

```
Job created
   → after() [runs post-response, never blocks job creation]
      → runPrivacyDiscovery
           robots.txt check → fetch job page → find privacy policy link
           → fetch privacy page → content-hash dedupe → store
      → runExtraction
           HTML → structured ExtractionInput (Layer 1, source-specific)
           → regex/keyword/structural extraction (Layer 2, source-agnostic)
           → rules-based privacy score + templated summary
      → scan_logs entry written for each stage
```

The Layer 1 / Layer 2 split in extraction is deliberate: Layer 1 (`htmlToExtractionInput.ts`) knows about HTML/Cheerio; Layer 2 (`extractor.ts`) only ever touches a source-agnostic shape (`{ fullText, sections, links }`). A future PDF-based source just needs a new Layer 1 function producing the same shape — the extraction logic itself never changes.

### Failure handling

- **Robots.txt compliance**: checked before every fetch; fails open on missing/unreachable `robots.txt` (absence isn't a disallow signal), fails closed on malformed responses
- **Freshness caching**: a company scanned within 24h is served from cache, no redundant network calls
- **Content-hash dedupe**: re-scans only create a new document row if the *normalized visible text* actually changed (not raw HTML, which includes per-request noise like CSRF tokens and analytics nonces)
- **RLS zero-rows-affected guards**: Postgres/Supabase RLS doesn't error on a blocked write, it just silently updates zero rows. Every mutating DB function checks the returned row count explicitly rather than assuming success from the absence of an error.
- **Malformed input handling**: invalid UUIDs in route params surface as `400`, not a generic `500`, via explicit Postgres error code (`22P02`) handling

---

## Known limitations (deliberate scope decisions)

Automated privacy policy discovery is a best-effort heuristic, not a guarantee: this is an honest limitation of the problem domain, not a flaw unique to this implementation. Specifically, out of scope for v1:

- **PDF-based privacy policies**: the fetcher currently rejects non-HTML content types; a real, observed occurrence, deferred to v2 by design (the Layer 1/2 split anticipates this)
- **AI-assisted extraction/link-finding**: reserved as a scoped fallback (e.g. classifying a page's existing anchor list, not full-page extraction) for the cases the rules-based approach misses, rather than a blanket AI-on-everything approach that wouldn't be cost-viable at scale
- **Negation-aware detection**: "third-party sharing" and "AI screening" flags are presence-detectors, not confirmed yes/no answers; a policy stating data is *not* shared would still register as detected. Surfaced in the UI as "auto-detected — verify against source," not hidden.
- **Region/role-specific privacy notices**: at companies with multiple postings, the first-discovered policy is used company-wide

---

## Getting started

```bash
git clone https://github.com/srahman14/trackly
cd trackly
npm install
```

Create a `.env.local` with your Supabase project credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

```bash
npm run dev
```

### Testing

```bash
npm run test        # Jest — DB layer + route handler tests, hand-rolled Supabase mocks
npm run test:ci      # same, as run in CI
```

A benchmarking suite (`benchmarks/`) measures extraction accuracy (precision/recall/F1 against fixture HTML) and pipeline/API latency (p50/p95/p99) against both local fixtures and live URLs.

---

## Roadmap

- **AI integration**: scoped, cost-bounded fallback for link discovery and extraction; AI-assisted email drafting for data deletion/access requests (`generated_emails` schema already in place)
- **PDF support**: new Layer 1 input function, no changes to extraction logic
- **Communal features**: friend connections and shared activity visibility (requires its own privacy-model design, given the app's core premise — deliberately not started until that's scoped properly)
- **Chrome extension / Discord bot**: enabled by the existing REST API surface (Route Handlers, not Server Actions, chosen specifically for this)
