// src/app/api/companies/[id]/analyze/route.ts (new — manual retry button hits this)
import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/api/auth';
import { apiSuccess, apiErrorResponse } from '@/lib/api/response';
import { getCompanyById } from '@/lib/db/companies';
import { runPrivacyPipeline } from '@/lib/scraper/runPrivacyPipeline';

interface RouteContext { params: Promise<{ id: string }> }

export async function POST(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();
    await getCompanyById(supabase, id);
    const result = await runPrivacyPipeline(supabase, id);
    return apiSuccess(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}