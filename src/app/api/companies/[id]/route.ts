import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/api/auth'
import { apiSuccess, apiErrorResponse } from '@/lib/api/response'
import { getCompanyById, updateCompany } from '@/lib/db/companies'
import { updateCompanySchema } from '@/lib/schemas/company'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const { supabase } = await requireUser()
    const company = await getCompanyById(supabase, id)
    return apiSuccess(company)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();
    const body = await request.json();
    const input = updateCompanySchema.parse(body);
    const company = await updateCompany(supabase, id, input);
    return apiSuccess(company);
  } catch (error) {
    return apiErrorResponse(error);
  }
}