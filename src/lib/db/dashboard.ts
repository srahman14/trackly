import { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@/lib/api/errors';

function monthRange(offsetMonths: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 1);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

async function countJobs(supabase: SupabaseClient, userId: string, apply: (q: any) => any) {
  const { count, error } = await apply(
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('user_id', userId)
  );
  if (error) throw new ApiError(500, 'Failed to compute dashboard metric');
  return count ?? 0;
}

export async function getDashboardMetrics(supabase: SupabaseClient, userId: string) {
  const thisMonth = monthRange(0);
  const lastMonth = monthRange(-1);

  const [
    applicationsApplied,
    appliedThisMonth,
    appliedLastMonth,
    rejectionsLogged,
    rejectedThisMonth,
    rejectedLastMonth,
    erasureResult,
    scanSummary,
  ] = await Promise.all([
    countJobs(supabase, userId, (q) => q.not('applied_date', 'is', null)),
    countJobs(supabase, userId, (q) => q.not('applied_date', 'is', null).gte('applied_date', thisMonth.start).lt('applied_date', thisMonth.end)),
    countJobs(supabase, userId, (q) => q.not('applied_date', 'is', null).gte('applied_date', lastMonth.start).lt('applied_date', lastMonth.end)),
    countJobs(supabase, userId, (q) => q.eq('status', 'rejected')),
    countJobs(supabase, userId, (q) => q.eq('status', 'rejected').gte('updated_at', thisMonth.start).lt('updated_at', thisMonth.end)),
    countJobs(supabase, userId, (q) => q.eq('status', 'rejected').gte('updated_at', lastMonth.start).lt('updated_at', lastMonth.end)),
    supabase
      .from('generated_emails')
      .select('id, jobs!inner(user_id)', { count: 'exact', head: true })
      .eq('email_type', 'data_deletion')
      .eq('status', 'sent')
      .eq('jobs.user_id', userId),
    supabase.rpc('get_company_scan_summary', { p_user_id: userId }),
  ]);

  if (erasureResult.error) throw new ApiError(500, 'Failed to compute erasure metric');
  if (scanSummary.error) throw new ApiError(500, 'Failed to compute privacy score metric');

  const scores = (scanSummary.data ?? [])
    .map((c: { privacy_score: number | null }) => c.privacy_score)
    .filter((s: number | null): s is number => s !== null);
  const avgPrivacyScore = scores.length ? Math.round(scores.reduce((a: any, b: any) => a + b, 0) / scores.length) : null;

  return {
    applicationsApplied,
    applicationsAppliedDelta: appliedThisMonth - appliedLastMonth,
    rejectionsLogged,
    rejectionsLoggedDelta: rejectedThisMonth - rejectedLastMonth,
    erasureRequestsSent: erasureResult.count ?? 0,
    avgPrivacyScore, // null, honestly, until at least one company has been scanned — no fabricated placeholder
  };
}

export async function getWeeklyApplicationCounts(supabase: SupabaseClient, userId: string, weeks = 4) {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - weeks * 7);

  const { data, error } = await supabase
    .from('jobs')
    .select('applied_date')
    .eq('user_id', userId)
    .not('applied_date', 'is', null)
    .gte('applied_date', cutoff.toISOString().slice(0, 10));

  if (error) throw new ApiError(500, 'Failed to compute weekly application counts');

  const buckets = Array.from({ length: weeks }, (_, i) => ({ period: `Week ${i + 1}`, applications: 0 }));
  for (const row of data ?? []) {
    const daysAgo = Math.floor((now.getTime() - new Date(row.applied_date as string).getTime()) / 86_400_000);
    const idx = weeks - 1 - Math.floor(daysAgo / 7);
    if (idx >= 0 && idx < weeks) buckets[idx].applications += 1;
  }
  return buckets;
}