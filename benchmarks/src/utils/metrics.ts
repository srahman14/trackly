import type { FieldScore, LatencySummary } from "../types";

export function percentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sortedAsc.length) - 1;
  return sortedAsc[Math.min(Math.max(idx, 0), sortedAsc.length - 1)];
}

export function summarizeLatencies(samplesMs: number[]): LatencySummary {
  if (samplesMs.length === 0) {
    return { count: 0, p50: 0, p95: 0, p99: 0, mean: 0, min: 0, max: 0 };
  }
  const sorted = [...samplesMs].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  return {
    count: sorted.length,
    p50: percentile(sorted, 50),
    p95: percentile(sorted, 95),
    p99: percentile(sorted, 99),
    mean: Math.round((sum / sorted.length) * 100) / 100,
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

/**
 * Confusion-matrix accumulator for a single field across many fixtures.
 * Call `record()` once per fixture with what was expected vs. what the
 * extractor actually returned, then `score()` once at the end.
 */
export class FieldScorer {
  private tp = 0;
  private fp = 0;
  private fn = 0;
  private tn = 0;

  constructor(private readonly field: string) {}

  /**
   * expectedPresent: was this field supposed to be found/true?
   * actualPresent: did the extractor find/return it?
   * "unknown" expected values are skipped entirely (not scored) — used for
   * fields like sharesWithThirdParties where the fixture author couldn't
   * confidently label ground truth.
   */
  record(expectedPresent: boolean | "unknown", actualPresent: boolean): void {
    if (expectedPresent === "unknown") return;
    if (expectedPresent && actualPresent) this.tp += 1;
    else if (!expectedPresent && actualPresent) this.fp += 1;
    else if (expectedPresent && !actualPresent) this.fn += 1;
    else this.tn += 1;
  }

  score(): FieldScore {
    const precision = this.tp + this.fp === 0 ? 1 : this.tp / (this.tp + this.fp);
    const recall = this.tp + this.fn === 0 ? 1 : this.tp / (this.tp + this.fn);
    const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
    return {
      field: this.field,
      truePositives: this.tp,
      falsePositives: this.fp,
      falseNegatives: this.fn,
      trueNegatives: this.tn,
      precision: round(precision),
      recall: round(recall),
      f1: round(f1),
    };
  }
}

export function round(n: number, dp = 3): number {
  const factor = 10 ** dp;
  return Math.round(n * factor) / factor;
}

/** Simple fixed-concurrency worker pool for the API-performance track. */
export async function runPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>
): Promise<void> {
  let cursor = 0;
  async function runOne() {
    while (cursor < items.length) {
      const index = cursor++;
      await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runOne));
}
