import fs from "node:fs";
import path from "node:path";
import { config } from "../config";
import type { BenchmarkReport } from "../types";

export function writeReport(report: BenchmarkReport): string {
  fs.mkdirSync(config.resultsDir, { recursive: true });
  const filename = `${report.timestamp.replace(/[:.]/g, "-")}.json`;
  const filepath = path.join(config.resultsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2), "utf-8");

  // Also write/overwrite a stable "latest.json" so CI or a CV script can
  // always point at one predictable path.
  fs.writeFileSync(path.join(config.resultsDir, "latest.json"), JSON.stringify(report, null, 2), "utf-8");

  return filepath;
}

export function printSummary(report: BenchmarkReport): void {
  const { extractionAccuracy, pipelineE2E, apiPerformance } = report.tracks;

  console.log("\n=== Benchmark summary ===");
  console.log(`Run at: ${report.timestamp}`);
  console.log(`Target: ${report.environment.apiBaseUrl}\n`);

  if (extractionAccuracy) {
    console.log("-- Extraction accuracy --");
    console.log(
      `  Overall F1: ${extractionAccuracy.overallF1}  (n=${extractionAccuracy.sampleSize} fixtures)`
    );
    for (const f of extractionAccuracy.perField) {
      console.log(
        `  ${f.field.padEnd(24)} precision=${f.precision}  recall=${f.recall}  f1=${f.f1}`
      );
    }
    console.log(
      `  extraction latency p50=${extractionAccuracy.latency.p50}ms p95=${extractionAccuracy.latency.p95}ms\n`
    );
  }

  if (pipelineE2E) {
    console.log("-- Pipeline end-to-end (live sites) --");
    console.log(
      `  Success rate: ${(pipelineE2E.successRate * 100).toFixed(1)}%  (n=${pipelineE2E.sampleSize})`
    );
    console.log(`  Outcomes: ${JSON.stringify(pipelineE2E.outcomeBreakdown)}`);
    if (Object.keys(pipelineE2E.reasonBreakdown).length > 0) {
      console.log(`  Failure reasons: ${JSON.stringify(pipelineE2E.reasonBreakdown)}`);
    }
    console.log(
      `  analyze() latency p50=${pipelineE2E.latency.p50}ms p95=${pipelineE2E.latency.p95}ms\n`
    );
  }

  if (apiPerformance) {
    console.log("-- API performance --");
    console.log(`  concurrency=${apiPerformance.concurrency} requestsPerVU=${apiPerformance.requestsPerVu}`);
    for (const e of apiPerformance.endpoints) {
      console.log(
        `  ${e.endpoint.padEnd(24)} p50=${e.latency.p50}ms p95=${e.latency.p95}ms errorRate=${(e.errorRate * 100).toFixed(1)}%`
      );
    }
    console.log("");
  }
}
