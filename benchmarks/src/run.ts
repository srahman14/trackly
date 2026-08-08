/**
 * Usage:
 *   npx tsx benchmarks/src/run.ts                       # run all tracks
 *   npx tsx benchmarks/src/run.ts --track=extraction     # one track only
 *   npx tsx benchmarks/src/run.ts --track=extraction,api # a subset
 *
 * Track names: extraction | e2e | api
 */
import { config } from "./config";

console.log(config.supabaseUrl, config.supabaseServiceRoleKey.slice(0,8))
import { runExtractionAccuracyTrack } from "./tracks/extractionAccuracy";
import { runPipelineE2ETrack } from "./tracks/pipelineE2E";
import { runApiPerformanceTrack } from "./tracks/apiPerformance";
import { printSummary, writeReport } from "./utils/reporter";
import type { BenchmarkReport } from "./types";

type TrackName = "extraction" | "e2e" | "api";

function parseTracks(): Set<TrackName> {
  const arg = process.argv.find((a) => a.startsWith("--track="));
  if (!arg) return new Set(["extraction", "e2e", "api"]);
  const names = arg
    .replace("--track=", "")
    .split(",")
    .map((s) => s.trim()) as TrackName[];
  return new Set(names);
}

async function main() {
  const tracks = parseTracks();

  const report: BenchmarkReport = {
    timestamp: new Date().toISOString(),
    environment: {
      node: process.version,
      apiBaseUrl: config.apiBaseUrl,
    },
    tracks: {},
  };

  if (tracks.has("extraction")) {
    console.log("Running extraction accuracy track...");
    report.tracks.extractionAccuracy = await runExtractionAccuracyTrack();
  }

  if (tracks.has("e2e")) {
    console.log("Running pipeline end-to-end track (hits live third-party sites)...");
    report.tracks.pipelineE2E = await runPipelineE2ETrack();
  }

  if (tracks.has("api")) {
    console.log("Running API performance track...");
    report.tracks.apiPerformance = await runApiPerformanceTrack();
  }

  const filepath = writeReport(report);
  printSummary(report);
  console.log(`Full report written to: ${filepath}`);
}

main().catch((err) => {
  console.error("Benchmark run failed:", err);
  process.exit(1);
});
