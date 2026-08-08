export interface LatencySummary {
  count: number;
  p50: number;
  p95: number;
  p99: number;
  mean: number;
  min: number;
  max: number;
}

export interface FieldScore {
  field: string;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface FixtureResult {
  id: string;
  passed: boolean;
  latencyMs: number;
  mismatches: string[];
  raw: Record<string, unknown>;
}

export interface ExtractionAccuracyReport {
  sampleSize: number;
  overallF1: number;
  perField: FieldScore[];
  latency: LatencySummary;
  fixtures: FixtureResult[];
}

export type PipelineOutcome = "found" | "not_found" | "error" | "request_failed";

export interface PipelineRunResult {
  id: string;
  jobUrl: string;
  outcome: PipelineOutcome;
  reason?: string;
  latencyMs: number;
}

export interface PipelineE2EReport {
  sampleSize: number;
  successRate: number;
  outcomeBreakdown: Record<string, number>;
  reasonBreakdown: Record<string, number>;
  latency: LatencySummary;
  runs: PipelineRunResult[];
}

export interface EndpointPerfResult {
  endpoint: string;
  requests: number;
  errors: number;
  errorRate: number;
  latency: LatencySummary;
}

export interface ApiPerformanceReport {
  concurrency: number;
  requestsPerVu: number;
  endpoints: EndpointPerfResult[];
}

export interface BenchmarkReport {
  timestamp: string;
  environment: {
    node: string;
    apiBaseUrl: string;
  };
  tracks: {
    extractionAccuracy?: ExtractionAccuracyReport;
    pipelineE2E?: PipelineE2EReport;
    apiPerformance?: ApiPerformanceReport;
  };
}
