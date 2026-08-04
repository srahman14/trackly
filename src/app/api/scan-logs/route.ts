import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/api/auth';
import { apiSuccess, apiErrorResponse } from '@/lib/api/response';
import { listScanLogs, listActiveScans } from '@/lib/db/scanLogs';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireUser();
    const params = request.nextUrl.searchParams;
    const [logsResult, activeScans] = await Promise.all([
      listScanLogs(supabase, {
        companyId: params.get('companyId') ?? undefined,
        page: params.get('page') ? Number(params.get('page')) : undefined,
        limit: params.get('limit') ? Number(params.get('limit')) : undefined,
      }),
      listActiveScans(supabase),
    ]);
    return apiSuccess({ ...logsResult, activeScans });
  } catch (error) {
    return apiErrorResponse(error);
  }
}