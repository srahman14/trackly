// GET /api/jobs (parse query params -> listJobs()) 
// POST /api/jobs (parse body -> createJob())

import { requireUser } from "@/lib/api/auth";
import { apiErrorResponse, apiSuccess } from "@/lib/api/response";
import { createJob, listJobs } from "@/lib/db/jobs";
import { createJobSchema, jobListQuerySchema } from "@/lib/schemas/job";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const { supabase, userId } = await requireUser()
        const searchParams = Object.fromEntries(request.nextUrl.searchParams)
        const filters = jobListQuerySchema.parse(searchParams)
        const result = await listJobs(supabase, userId, filters)
        return apiSuccess(result)
    } catch (error) {
        return apiErrorResponse(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const { supabase, userId } = await requireUser()
        const body = await request.json() 
        const input = createJobSchema.parse(body)
        const job = await createJob(supabase, userId, input)
        return apiSuccess(job, 201)
    } catch (error) {
        return apiErrorResponse(error)
    }
}