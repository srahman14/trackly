// src/app/api/companies/[id]/privacy-summary/route.ts (new)
import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/api/auth';
import { apiSuccess, apiErrorResponse } from '@/lib/api/response';
import { getCompanyById } from '@/lib/db/companies';
import { getCurrentPrivacyEntityForCompany } from '@/lib/db/privacyEntities';

interface RouteContext { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();
    // 404s cleanly if company doesn't exist
    await getCompanyById(supabase, id); 
    const summary = await getCurrentPrivacyEntityForCompany(supabase, id);
    return apiSuccess(summary);
  } catch (error) {
    return apiErrorResponse(error);
  }
}