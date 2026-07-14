// createJob(supabse, userId, input) -> calls findOrCreateCompanyByUrl() first, then inserts the job with the correct companyId
// listJobs(supabase, userId, filters) — status filter, page/limit → .range(), ordered by created_at desc
// getJobById(supabase, userId, id)
// updateJob(supabase, userId, id, input)
// deleteJob(supabase, userId, id)

import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "@/lib/api/errors";
import { findOrCreateCompanyByUrl } from "./companies";
import type {
  CreateJobInput,
  UpdateJobInput,
  JobListQuery,
} from "@/lib/schemas/job";
import type { JobWithCompany } from "@/types/database";

export async function createJob(
  supabase: SupabaseClient,
  userId: string,
  input: CreateJobInput,
): Promise<JobWithCompany> {
  // Find company based off of the job_url
  const company = await findOrCreateCompanyByUrl(supabase, input.job_url);

  // Insert job
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      user_id: userId,
      company_id: company.id,
      job_title: input.job_title,
      job_description: input.job_description ?? null,
      job_url: input.job_url,
      status: input.status ?? "saved",
      applied_date: input.applied_date ?? null,
    })
    .select("*, company:companies(*)")
    .single();

  if (error) throw new ApiError(500, "Failed to create job");
  return data as JobWithCompany;
}

export async function listJobs(
  supabase: SupabaseClient,
  userId: string,
  filters: JobListQuery,
) {
    // Filters
  const { status, page, limit, sort, order } = filters;
  // Jobs to fetch from and to (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("jobs")
    .select("*, company:companies(*)", { count: "exact" })
    .eq("user_id", userId)
    .order(sort, { ascending: order === "asc" })
    .range(from, to);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) throw new ApiError(500, "Failed to list jobs");

  return {
    jobs: data as JobWithCompany[],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: count ? Math.ceil(count / limit) : 0,
    },
  };
}

export async function getJobById(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<JobWithCompany> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new ApiError(500, "Failed to fetch job");
  if (!data) throw new ApiError(404, "Job not found");
  return data as JobWithCompany;
}

export async function getMostRecentJobUrlForCompany(
  supabase: SupabaseClient,
  companyId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('job_url')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new ApiError(500, 'Failed to look up job for company');
  return data?.job_url ?? null;
}

export async function updateJob(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  input: UpdateJobInput,
): Promise<JobWithCompany> {
  // confirms existence + ownership before attempting the update,
  // so a not-found reads as 404 rather than a silent no-op
  await getJobById(supabase, userId, id);

  const { data, error } = await supabase
    .from("jobs")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*, company:companies(*)");

  if (error) throw new ApiError(500, "Failed to update job");

  // silent-RLS-block risk: a matched-zero-rows update
  // doesn't error, it just returns an empty array — treat that as a failure
  if (!data || data.length === 0) {
    throw new ApiError(500, "Update failed: no rows affected (check RLS policy)");
  }

  return data[0] as JobWithCompany;
}

export async function deleteJob(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<void> {
  await getJobById(supabase, userId, id);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id");

  if (error) throw new ApiError(500, "Failed to delete job");

  // RLS can silently match zero rows without raising a Postgres error —
  // treat "nothing came back" as a failure rather than a false success
  if (!data || data.length === 0) {
    throw new ApiError(500, "Delete failed: no rows affected (check RLS policy)");
  }
}