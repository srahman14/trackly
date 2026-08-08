import { config } from "../config";
import { apiCall } from "../utils/httpClient";
import { runPool, summarizeLatencies } from "../utils/metrics";
import type { ApiPerformanceReport, EndpointPerfResult } from "../types";

interface JobRecord {
  id: string;
}

/**
 * Load-tests the real Jobs CRUD routes with N virtual users each firing M
 * sequential requests (so total load = concurrency, not concurrency*requests
 * all at once — closer to sustained traffic than a single burst).
 *
 * Each VU creates its own job first (so PATCH/DELETE/GET-by-id have a real
 * row to act on, scoped to this benchmark run) and cleans it up at the end
 * regardless of what happened in between.
 */
export async function runApiPerformanceTrack(): Promise<ApiPerformanceReport> {
  const { apiPerfConcurrency: concurrency, apiPerfRequestsPerVu: requestsPerVu } = config;

  const listLatencies: number[] = [];
  const createLatencies: number[] = [];
  const getLatencies: number[] = [];
  const patchLatencies: number[] = [];
  const deleteLatencies: number[] = [];
  let listErrors = 0;
  let createErrors = 0;
  let getErrors = 0;
  let patchErrors = 0;
  let deleteErrors = 0;

  const vus = Array.from({ length: concurrency }, (_, i) => i);

  await runPool(vus, concurrency, async (vuIndex) => {
    for (let i = 0; i < requestsPerVu; i++) {
      // GET /api/jobs (list)
      const listRes = await apiCall("/api/jobs?limit=10");
      listLatencies.push(listRes.latencyMs);
      if (!listRes.ok) listErrors += 1;

      // POST /api/jobs (create)
      const createRes = await apiCall<JobRecord>("/api/jobs", {
        method: "POST",
        body: JSON.stringify({
          job_title: `[benchmark] vu${vuIndex}-req${i}`,
          job_url: `https://benchmark-load-test.example/vu${vuIndex}/req${i}`,
          status: "saved",
        }),
      });
      createLatencies.push(createRes.latencyMs);
      if (!createRes.ok || !createRes.data) {
        createErrors += 1;
        continue; // nothing to GET/PATCH/DELETE if creation failed
      }

      const jobId = createRes.data.id;

      // GET /api/jobs/[id]
      const getRes = await apiCall(`/api/jobs/${jobId}`);
      getLatencies.push(getRes.latencyMs);
      if (!getRes.ok) getErrors += 1;

      // PATCH /api/jobs/[id]
      const patchRes = await apiCall(`/api/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "applied" }),
      });
      patchLatencies.push(patchRes.latencyMs);
      if (!patchRes.ok) patchErrors += 1;

      // DELETE /api/jobs/[id]
      const deleteRes = await apiCall(`/api/jobs/${jobId}`, { method: "DELETE" });
      deleteLatencies.push(deleteRes.latencyMs);
      if (!deleteRes.ok) deleteErrors += 1;
    }
  });

  const endpoints: EndpointPerfResult[] = [
    buildResult("GET /api/jobs", listLatencies, listErrors),
    buildResult("POST /api/jobs", createLatencies, createErrors),
    buildResult("GET /api/jobs/[id]", getLatencies, getErrors),
    buildResult("PATCH /api/jobs/[id]", patchLatencies, patchErrors),
    buildResult("DELETE /api/jobs/[id]", deleteLatencies, deleteErrors),
  ];

  return { concurrency, requestsPerVu, endpoints };
}

function buildResult(endpoint: string, latencies: number[], errors: number): EndpointPerfResult {
  return {
    endpoint,
    requests: latencies.length,
    errors,
    errorRate: latencies.length === 0 ? 0 : round(errors / latencies.length),
    latency: summarizeLatencies(latencies),
  };
}

function round(n: number, dp = 3): number {
  const factor = 10 ** dp;
  return Math.round(n * factor) / factor;
}
