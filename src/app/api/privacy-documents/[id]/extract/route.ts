import { requireUser } from '@/lib/api/auth';
import { apiErrorResponse, apiSuccess } from '@/lib/api/response';
import { runExtraction } from '@/lib/scraper/runExtraction';
import { NextRequest } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();
    const force = request.nextUrl.searchParams.get('force') === 'true';
    const result = await runExtraction(supabase, id, { force });
    return apiSuccess(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}