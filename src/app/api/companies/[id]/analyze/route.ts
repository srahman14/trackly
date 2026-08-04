// src/app/api/companies/[id]/analyze/route.ts (new — manual retry button hits this)
import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/api/auth';
import { apiSuccess, apiErrorResponse } from '@/lib/api/response';
import { getCompanyById } from '@/lib/db/companies';
import { runPrivacyPipeline } from '@/lib/scraper/runPrivacyPipeline';

interface RouteContext { params: Promise<{ id: string }> }

// api/companies/[id]/analyze/route.ts — now reads jobId from the request body
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();
    const body = await request.json().catch(() => ({}));
    await getCompanyById(supabase, id);
    const result = await runPrivacyPipeline(supabase, id, 'manual', body.jobId);
    return apiSuccess(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}