export interface ScanLog {
  id: string;
  company_id: string;
  privacy_document_id: string | null;
  privacy_entity_id: string | null;
  stage: 'discovery' | 'extraction';
  status: 'success' | 'not_found' | 'error' | 'cached' | 'unchanged';
  reason: string | null;
  triggered_by: 'job_creation' | 'manual' | 'system';
  created_at: string;
  companies: { name: string; domain: string | null; privacy_scan_status: string };
}

interface ScanLogsResponse {
  logs: ScanLog[];
  pagination: { page: number; limit: number; total: number };
  activeScans: { id: string; name: string; domain: string | null; last_scanned_at: string | null }[];
}

export async function fetchScanLogs(page = 1): Promise<ScanLogsResponse> {
  const res = await fetch(`/api/scan-logs?page=${page}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? 'Failed to load scan logs');
  return json.data;
}