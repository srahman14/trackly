// GET, PATCH, DELETE /api/jobs/:id (parse params -> getJobById(), updateJob(), deleteJob())

import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/api/auth'
import { apiSuccess, apiErrorResponse } from '@/lib/api/response'
import { updateJobSchema } from '@/lib/schemas/job'
import { getJobById, updateJob, deleteJob } from '@/lib/db/jobs'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const { supabase, userId } = await requireUser()
    const job = await getJobById(supabase, userId, id)
    return apiSuccess(job)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const { supabase, userId } = await requireUser()
    const body = await request.json()
    const input = updateJobSchema.parse(body)
    const job = await updateJob(supabase, userId, id, input)
    return apiSuccess(job)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const { supabase, userId } = await requireUser()
    await deleteJob(supabase, userId, id)
    return apiSuccess({ deleted: true })
  } catch (error) {
    return apiErrorResponse(error)
  }
}