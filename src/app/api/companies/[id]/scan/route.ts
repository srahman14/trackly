import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/api/auth';
import { apiSuccess, apiErrorResponse } from '@/lib/api/response';
import { runPrivacyDiscovery } from '@/lib/scraper/runPrivacyDiscovery';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();
    const force = request.nextUrl.searchParams.get('force') === 'true';
    const result = await runPrivacyDiscovery(supabase, id, { force });
    return apiSuccess(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}