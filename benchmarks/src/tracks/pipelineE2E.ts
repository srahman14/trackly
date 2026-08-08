import { config } from "../config";
import { CORPUS } from "../data/corpus";
import { apiCall } from "../utils/httpClient";
import { summarizeLatencies } from "../utils/metrics";
import type { PipelineE2EReport, PipelineOutcome, PipelineRunResult } from "../types";

interface JobCreateResponse {
  id: string;
  company: { id: string };
}

interface AnalyzeResponse {
  status: "found" | "not_found" | "error";
  reason?: string;
}

/**
 * For each corpus entry:
 *   1. POST /api/jobs — creates the job (and, via findOrCreateCompanyByUrl,
 *      the company row if this domain hasn't been seen before).
 *   2. POST /api/companies/{id}/analyze?force=true — runs discovery +
 *      extraction SYNCHRONOUSLY (per "Scraping Engine - After coming back 2
 *      weeks later" — this route exists specifically so callers don't have
 *      to poll) and `force=true` bypasses the 24h freshness cache, so
 *      repeat benchmark runs measure a real scan, not a cache hit.
 *   3. DELETE /api/jobs/{id} — tidy up the jobs board; companies are shared
 *      reference data and are intentionally left behind (matches the
 *      project's own "no companies list/delete" design).
 */
export async function runPipelineE2ETrack(): Promise<PipelineE2EReport> {
  const latencies: number[] = [];
  const runs: PipelineRunResult[] = [];
  const outcomeBreakdown: Record<string, number> = {};
  const reasonBreakdown: Record<string, number> = {};

  for (const entry of CORPUS) {
    const createRes = await apiCall<JobCreateResponse>("/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        job_title: entry.jobTitle,
        job_url: entry.jobUrl,
        status: "saved",
      }),
    });

    if (!createRes.ok || !createRes.data) {
      const result: PipelineRunResult = {
        id: entry.id,
        jobUrl: entry.jobUrl,
        outcome: "request_failed",
        reason: createRes.errorMessage ?? "job creation failed",
        latencyMs: createRes.latencyMs,
      };
      runs.push(result);
      tally(outcomeBreakdown, result.outcome);
      continue;
    }

    const { id: jobId, company } = createRes.data;

    const analyzeRes = await apiCall<AnalyzeResponse>(
      `/api/companies/${company.id}/analyze?force=true`,
      { method: "POST", body: JSON.stringify({}) },
      config.e2eAnalyzeTimeoutMs
    );
    latencies.push(analyzeRes.latencyMs);

    let outcome: PipelineOutcome;
    let reason: string | undefined;

    if (!analyzeRes.ok || !analyzeRes.data) {
      outcome = "request_failed";
      reason = analyzeRes.errorMessage ?? "analyze request failed";
    } else {
      outcome = analyzeRes.data.status;
      reason = analyzeRes.data.reason;
    }

    const result: PipelineRunResult = {
      id: entry.id,
      jobUrl: entry.jobUrl,
      outcome,
      reason,
      latencyMs: analyzeRes.latencyMs,
    };
    runs.push(result);
    tally(outcomeBreakdown, outcome);
    if (reason) tally(reasonBreakdown, reason);

    // Cleanup — don't let cleanup failures abort the benchmark run.
    await apiCall(`/api/jobs/${jobId}`, { method: "DELETE" }).catch(() => undefined);
  }

  const successCount = runs.filter((r) => r.outcome === "found").length;

  return {
    sampleSize: CORPUS.length,
    successRate: CORPUS.length === 0 ? 0 : round(successCount / CORPUS.length),
    outcomeBreakdown,
    reasonBreakdown,
    latency: summarizeLatencies(latencies),
    runs,
  };
}

function tally(map: Record<string, number>, key: string): void {
  map[key] = (map[key] ?? 0) + 1;
}

function round(n: number, dp = 3): number {
  const factor = 10 ** dp;
  return Math.round(n * factor) / factor;
}
