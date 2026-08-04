// lib/db/scanLogs.ts (new)
import { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@/lib/api/errors';

export async function getCompanyScanSummaries(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.rpc('get_company_scan_summary', { p_user_id: userId });
  if (error) throw new ApiError(500, 'Failed to fetch company scan summaries');
  return data;
}

export async function listActiveScans(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, domain, privacy_scan_status, last_scanned_at, jobs!inner(user_id)')
    .eq('privacy_scan_status', 'scanning')
    .eq('jobs.user_id', userId);

  if (error) throw new ApiError(500, 'Failed to fetch active scans');
  return data;
}

export async function createScanLog(supabase: SupabaseClient, log: {
  companyId: string; jobId?: string; stage: 'discovery' | 'extraction';
  status: 'success' | 'not_found' | 'error' | 'cached' | 'unchanged';
  reason?: string; triggeredBy: 'job_creation' | 'manual' | 'system';
  privacyDocumentId?: string; privacyEntityId?: string;
}) {
  const { error } = await supabase.from('scan_logs').insert({
    company_id: log.companyId, job_id: log.jobId ?? null,
    privacy_document_id: log.privacyDocumentId ?? null,
    privacy_entity_id: log.privacyEntityId ?? null,
    stage: log.stage, status: log.status, reason: log.reason ?? null,
    triggered_by: log.triggeredBy,
  });
  if (error) console.error('Failed to write scan log:', error);
}

export async function listScanLogs(
  supabase: SupabaseClient,
  options: { companyId?: string; page?: number; limit?: number } = {}
) {
  const page = options.page ?? 1;
  const limit = options.limit ?? 50;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('scan_logs')
    .select('*, companies(name, domain, privacy_scan_status)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (options.companyId) query = query.eq('company_id', options.companyId);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, 'Failed to fetch scan logs');
  return { logs: data, pagination: { page, limit, total: count ?? 0 } };
}

export async function getRecentScanLogs(supabase: SupabaseClient, userId: string, limit = 6) {
  const { data, error } = await supabase
    .from('scan_logs')
    .select('id, stage, status, reason, triggered_by, created_at, companies(name, domain), job_id, jobs!inner(user_id)')
    .eq('jobs.user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new ApiError(500, 'Failed to fetch recent scan logs');
  return data;
}