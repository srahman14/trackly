// api/jobs/route.ts
import { after } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { apiErrorResponse, apiSuccess } from "@/lib/api/response";
import { createJob, listJobs } from "@/lib/db/jobs";
import { createJobSchema, jobListQuerySchema } from "@/lib/schemas/job";
import { runPrivacyPipeline } from "@/lib/scraper/runPrivacyPipeline";
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

    if (job.company_id) {
      after(() =>
        runPrivacyPipeline(supabase, job.company_id!, 'job_creation', job.id).catch((err) =>
          console.error(`Background privacy pipeline failed for company ${job.company_id}:`, err)
        )
      )
    }

    return apiSuccess(job, 201)
  } catch (error) {
    return apiErrorResponse(error)
  }
}