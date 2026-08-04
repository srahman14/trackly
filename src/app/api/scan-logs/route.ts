import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/api/auth';
import { apiSuccess, apiErrorResponse } from '@/lib/api/response';
import { getCompanyScanSummaries, getRecentScanLogs, listScanLogs } from '@/lib/db/scanLogs';

export async function GET(request: NextRequest) {
  try {
    const { supabase, userId } = await requireUser();
    const params = request.nextUrl.searchParams;
    const companyId = params.get('companyId');

    if (companyId) {
      const logs = await listScanLogs(supabase, { companyId });
      return apiSuccess(logs);
    }

    const [summaries, recentLogs] = await Promise.all([
      getCompanyScanSummaries(supabase, userId),
      getRecentScanLogs(supabase, userId),
    ]);
    return apiSuccess({ summaries, recentLogs });
  } catch (error) {
    return apiErrorResponse(error);
  }
}