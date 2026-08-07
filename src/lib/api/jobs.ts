import type { JobStatus, JobWithCompany } from "@/types/database"

export interface JobListFilters {
  status?: JobStatus
  page?: number
  limit?: number
  sort?: "created_at" | "applied_date" | "job_title"
  order?: "asc" | "desc"
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface JobListResult {
  jobs: JobWithCompany[]
  pagination: Pagination
}

export interface CreateJobPayload {
  job_title: string
  job_url: string
  job_description?: string
  status?: JobStatus
  applied_date?: string | null
  role_type?: string | null;
  work_mode?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  recruiter_name?: string | null;
  recruiter_email?: string | null;
  company_privacy_policy_url?: string | null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message = body?.error?.message ?? `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return body.data as T 
}

export async function fetchJobs(filters: JobListFilters = {}): Promise<JobListResult> {
  const params = new URLSearchParams()
  if (filters.status) params.set("status", filters.status)
  params.set("page", String(filters.page ?? 1))
  params.set("limit", String(filters.limit ?? 20))
  if (filters.sort) params.set("sort", filters.sort)
  if (filters.order) params.set("order", filters.order)

  const response = await fetch(`/api/jobs?${params.toString()}`, { cache: "no-store" })
  return handleResponse<JobListResult>(response)
}

export async function fetchJob(id: string): Promise<JobWithCompany> {
  const response = await fetch(`/api/jobs/${id}`, { cache: "no-store" })
  return handleResponse<JobWithCompany>(response)
}

export async function createJob(input: CreateJobPayload): Promise<JobWithCompany> {
  const response = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return handleResponse<JobWithCompany>(response)
}

export async function updateJob(
  id: string,
  input: Partial<CreateJobPayload>
): Promise<JobWithCompany> {
  const response = await fetch(`/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return handleResponse<JobWithCompany>(response)
}

export async function deleteJob(id: string): Promise<{ deleted: boolean }> {
  const response = await fetch(`/api/jobs/${id}`, { method: "DELETE" })
  return handleResponse<{ deleted: boolean }>(response)
}
