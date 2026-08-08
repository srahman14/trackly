import { randomUUID } from "node:crypto";
import { config } from "../config";
import { FIXTURES, loadFixtureHtml, type FixtureGroundTruth } from "../data/fixtures";
import { apiCall } from "../utils/httpClient";
import { FieldScorer, summarizeLatencies } from "../utils/metrics";
import { supabaseAdmin } from "../utils/supabaseAdmin";
import type { ExtractionAccuracyReport, FixtureResult } from "../types";

/**
 * Seeds a throwaway `companies` row + a `privacy_documents` row with the
 * fixture's raw HTML directly via the service-role client (there's no HTTP
 * route for "insert arbitrary raw_text" — that's only ever written by the
 * live scraper). Then calls the REAL `/api/privacy-documents/[id]/extract`
 * route, exactly as production traffic would, so this benchmark measures
 * your actual deployed extraction logic, not a re-implementation of it.
 */
async function seedFixture(fixture: FixtureGroundTruth): Promise<{ companyId: string; documentId: string }> {
  const html = loadFixtureHtml(fixture);
  const domain = `benchmark-${fixture.id}.example`;

  const { data: company, error: companyError } = await supabaseAdmin
    .from("companies")
    .insert({
      name: `[benchmark] ${fixture.id}`,
      domain,
      privacy_policy_url: fixture.baseUrl,
      privacy_scan_status: "found",
    })
    .select("id")
    .single();

  if (companyError || !company) {
    throw new Error(`Failed to seed company for fixture ${fixture.id}: ${companyError?.message}`);
  }

  const { data: document, error: docError } = await supabaseAdmin
    .from("privacy_documents")
    .insert({
      id: randomUUID(),
      company_id: company.id,
      privacy_policy_url: fixture.baseUrl,
      raw_text: html,
    })
    .select("id")
    .single();

  if (docError || !document) {
    throw new Error(`Failed to seed privacy_document for fixture ${fixture.id}: ${docError?.message}`);
  }

  return { companyId: company.id, documentId: document.id };
}

async function cleanupFixture(companyId: string): Promise<void> {
  if (config.keepFixtures) return;
  // privacy_documents/privacy_entities rows are expected to cascade or be
  // cleaned via FK constraints — if your schema doesn't cascade, delete
  // explicitly here before deleting the company.
  await supabaseAdmin.from("companies").delete().eq("id", companyId);
}

interface ExtractedEntity {
  dpo_email: string | null;
  contact_email: string | null;
  retention_period: string | null;
  data_request_url: string | null;
  shares_with_third_parties: boolean | null;
  uses_ai_screening: boolean | null;
}

/**
 * Records a total miss for a fixture: every field the fixture *expected* to
 * find is scored as a false negative (recorded as expected=true/actual=false).
 * Fields expected absent are scored as a correct true-negative (recorded as
 * expected=false/actual=false) — a fixture that errors out didn't produce
 * a false positive on those, so it shouldn't be penalized as if it did.
 * "unknown" fields are skipped, same as the success path.
 *
 * This is what actually happened before this patch was applied: fixture-level
 * errors (e.g. seeding failures, request failures, thrown exceptions) never
 * called `.record()` at all, so those fixtures silently dropped out of the
 * denominator entirely. With 0 tp/0 fp, the precision/recall fallback of
 * "no data = perfect score" kicked in — meaning a 100% failure rate could
 * still report F1 = 1. Scoring misses explicitly here closes that hole.
 */
function recordTotalMiss(
  fixture: FixtureGroundTruth,
  scorers: {
    dpo: FieldScorer;
    contact: FieldScorer;
    retention: FieldScorer;
    dataRequest: FieldScorer;
    sharing: FieldScorer;
    aiScreening: FieldScorer;
  }
): void {
  scorers.dpo.record(fixture.expected.dpoEmail !== null, false);
  scorers.contact.record(fixture.expected.contactEmail !== null, false);
  scorers.retention.record(fixture.expected.retentionPeriodPresent, false);
  scorers.dataRequest.record(fixture.expected.dataRequestUrlPresent, false);
  scorers.sharing.record(fixture.expected.sharesWithThirdParties, false);
  scorers.aiScreening.record(fixture.expected.usesAiScreening, false);
}

export async function runExtractionAccuracyTrack(): Promise<ExtractionAccuracyReport> {
  const scorers = {
    dpo: new FieldScorer("dpoEmail"),
    contact: new FieldScorer("contactEmail"),
    retention: new FieldScorer("retentionPeriod"),
    dataRequest: new FieldScorer("dataRequestUrl"),
    sharing: new FieldScorer("sharesWithThirdParties"),
    aiScreening: new FieldScorer("usesAiScreening"),
  };

  const latencies: number[] = [];
  const fixtureResults: FixtureResult[] = [];

  for (const fixture of FIXTURES) {
    let companyId: string | null = null;
    try {
      const seeded = await seedFixture(fixture);
      companyId = seeded.companyId;

      const res = await apiCall<ExtractedEntity>(
        `/api/privacy-documents/${seeded.documentId}/extract?force=true`,
        { method: "POST", body: JSON.stringify({}) }
      );
      latencies.push(res.latencyMs);

      if (!res.ok || !res.data) {
        recordTotalMiss(fixture, scorers);
        fixtureResults.push({
          id: fixture.id,
          passed: false,
          latencyMs: res.latencyMs,
          mismatches: [`request failed: ${res.errorMessage}`],
          raw: {},
        });
        continue;
      }

      const entity = res.data;
      const mismatches: string[] = [];

      const dpoMatch = normalizedEquals(entity.dpo_email, fixture.expected.dpoEmail);
      scorers.dpo.record(fixture.expected.dpoEmail !== null, Boolean(entity.dpo_email));
      if (!dpoMatch) mismatches.push(`dpoEmail: expected ${fixture.expected.dpoEmail} got ${entity.dpo_email}`);

      const contactMatch = normalizedEquals(entity.contact_email, fixture.expected.contactEmail);
      scorers.contact.record(fixture.expected.contactEmail !== null, Boolean(entity.contact_email));
      if (!contactMatch)
        mismatches.push(`contactEmail: expected ${fixture.expected.contactEmail} got ${entity.contact_email}`);

      scorers.retention.record(fixture.expected.retentionPeriodPresent, Boolean(entity.retention_period));
      scorers.dataRequest.record(fixture.expected.dataRequestUrlPresent, Boolean(entity.data_request_url));
      scorers.sharing.record(fixture.expected.sharesWithThirdParties, Boolean(entity.shares_with_third_parties));
      scorers.aiScreening.record(fixture.expected.usesAiScreening, Boolean(entity.uses_ai_screening));

      fixtureResults.push({
        id: fixture.id,
        passed: mismatches.length === 0,
        latencyMs: res.latencyMs,
        mismatches,
        raw: entity as unknown as Record<string, unknown>,
      });
    } catch (err) {
      // Seeding failure or any other thrown error — still counts as a miss
      // against every field this fixture expected to find (see
      // recordTotalMiss doc comment above for why this matters).
      recordTotalMiss(fixture, scorers);
      fixtureResults.push({
        id: fixture.id,
        passed: false,
        latencyMs: 0,
        mismatches: [err instanceof Error ? err.message : String(err)],
        raw: {},
      });
    } finally {
      if (companyId) await cleanupFixture(companyId);
    }
  }

  const perField = [
    scorers.dpo.score(),
    scorers.contact.score(),
    scorers.retention.score(),
    scorers.dataRequest.score(),
    scorers.sharing.score(),
    scorers.aiScreening.score(),
  ];
  const overallF1 = round(perField.reduce((sum, f) => sum + f.f1, 0) / perField.length);

  return {
    sampleSize: FIXTURES.length,
    overallF1,
    perField,
    latency: summarizeLatencies(latencies),
    fixtures: fixtureResults,
  };
}

function normalizedEquals(a: string | null, b: string | null): boolean {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function round(n: number, dp = 3): number {
  const factor = 10 ** dp;
  return Math.round(n * factor) / factor;
}