// src/app/api/dashboard/summary/route.ts (new)
import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/api/auth';
import { apiSuccess, apiErrorResponse } from '@/lib/api/response';
import { getDashboardMetrics, getWeeklyApplicationCounts } from '@/lib/db/dashboard';

export async function GET(_request: NextRequest) {
  try {
    const { supabase, userId } = await requireUser();
    const [metrics, weeklyApplications] = await Promise.all([
      getDashboardMetrics(supabase, userId),
      getWeeklyApplicationCounts(supabase, userId),
    ]);
    return apiSuccess({ metrics, weeklyApplications });
  } catch (error) {
    return apiErrorResponse(error);
  }
}