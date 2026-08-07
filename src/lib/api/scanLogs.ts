export interface CompanyScanSummary {
  company_id: string;
  name: string;
  domain: string | null;
  privacy_scan_status: string;
  privacy_policy_url: string | null;
  last_scanned_at: string | null;
  privacy_score: number | null;
  summary: string | null;
  total_scan_logs: number;
  error_count: number;
  success_count: number;
  not_found_count: number;
  last_log_at: string | null;
}

export interface ScanLog {
  id: string;
  company_id: string;
  job_id: string | null;
  privacy_document_id: string | null;
  privacy_entity_id: string | null;
  stage: "discovery" | "extraction";
  status: "success" | "not_found" | "error" | "cached" | "unchanged";
  reason: string | null;
  triggered_by: "job_creation" | "manual" | "system";
  created_at: string;
  companies: { name: string; domain: string | null; privacy_scan_status: string };
}

export interface RecentScanLog {
  id: string;
  stage: "discovery" | "extraction";
  status: "success" | "not_found" | "error" | "cached" | "unchanged";
  reason: string | null;
  triggered_by: "job_creation" | "manual" | "system";
  created_at: string;
  companies: { name: string; domain: string | null };
}

interface ScanSummaryResponse {
  summaries: CompanyScanSummary[];
  recentLogs: RecentScanLog[];
}

interface ScanLogsListResponse {
  logs: ScanLog[];
  pagination: { page: number; limit: number; total: number };
}

async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? "Request failed");
  return json.data as T;
}

export async function fetchScanLogs(): Promise<ScanSummaryResponse> {
  const res = await fetch(`/api/scan-logs`);
  return unwrap<ScanSummaryResponse>(res);
}

// Scoped drill-down — chronological raw log stream for one company.
export async function fetchCompanyScanLogs(companyId: string): Promise<ScanLogsListResponse> {
  const res = await fetch(`/api/scan-logs?companyId=${companyId}`);
  return unwrap<ScanLogsListResponse>(res);
}