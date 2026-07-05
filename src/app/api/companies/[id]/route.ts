import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/api/auth'
import { apiSuccess, apiErrorResponse } from '@/lib/api/response'
import { getCompanyById } from '@/lib/db/companies'

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