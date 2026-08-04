// lib/db/scanLogs.ts (new)
import { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@/lib/api/errors';

export async function createScanLog(
  supabase: SupabaseClient,
  log: {
    companyId: string;
    stage: 'discovery' | 'extraction';
    status: 'success' | 'not_found' | 'error' | 'cached' | 'unchanged';
    reason?: string;
    triggeredBy: 'job_creation' | 'manual' | 'system';
    privacyDocumentId?: string;
    privacyEntityId?: string;
  }
) {
  const { error } = await supabase.from('scan_logs').insert({
    company_id: log.companyId,
    privacy_document_id: log.privacyDocumentId ?? null,
    privacy_entity_id: log.privacyEntityId ?? null,
    stage: log.stage,
    status: log.status,
    reason: log.reason ?? null,
    triggered_by: log.triggeredBy,
  });
  // Deliberately non-throwing: a logging failure should never break the
  // actual scan/extraction it's trying to record.
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

export async function listActiveScans(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, domain, privacy_scan_status, last_scanned_at')
    .eq('privacy_scan_status', 'scanning');

  if (error) throw new ApiError(500, 'Failed to fetch active scans');
  return data;
}