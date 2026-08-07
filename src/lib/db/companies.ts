// findOrCreateCompanyByUrl(supabase, jobUrl) -> companyId
// normalize domain from jobUrl,
// select where domain = normalized
// if not found - insert with name placeholder (derived from thedomain e.g. strpe.com -> Stripe) and privacy_policy_url: null
// return the company row (existing or new)

import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "@/lib/api/errors";
import { normalizeDomain, domainToCompanyName } from "@/lib/utils/domain";
import type { Company } from "@/types/database";
import { throwIfDbError } from "./dbErrors";
export async function findOrCreateCompanyByUrl(
  supabase: SupabaseClient,
  jobUrl: string,
  privacyPolicyUrl?: string | null
) {
  const domain = normalizeDomain(jobUrl);
  const { data: existing } = await supabase.from('companies').select('*').eq('domain', domain).maybeSingle();
  if (existing) return existing; // never overwrite an existing company's data from a job form — avoid clobbering scanner-discovered results

  const { data, error } = await supabase
    .from('companies')
    .insert({
      domain,
      name: domainToCompanyName(domain),
      privacy_policy_url: privacyPolicyUrl ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      // Race condition — someone else inserted the same domain first, refetch the winner.
      const { data: winner } = await supabase.from('companies').select('*').eq('domain', domain).single();
      return winner;
    }
    throw new ApiError(500, 'Failed to create company');
  }
  return data;
}

export async function updateCompany(
  supabase: SupabaseClient,
  id: string,
  updates: { privacy_policy_url?: string | null }
) {
  const { data, error } = await supabase
    .from('companies')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  throwIfDbError(error, 'company');
  if (!data) throw new ApiError(404, 'Company not found or update blocked by RLS');
  return data;
}

export async function getCompanyById(
  supabase: SupabaseClient,
  id: string,
): Promise<Company> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    // Malformed UUID never reaches RLS/row-matching — Postgres rejects it
    // at the query layer. That's a client mistake (bad id), not a server fault.
    if (error.code === "22P02") {
      throw new ApiError(400, "Invalid company id format");
    }
    throw new ApiError(500, "Failed to fetch company");
  }
  if (!data) throw new ApiError(404, "Company not found");
  return data as Company;
}

export async function updateCompanyScanStatus(
  supabase: SupabaseClient,
  companyId: string,
  updates: { privacy_scan_status: string; privacy_policy_url?: string }
) {
  const { data, error } = await supabase
    .from('companies')
    .update({ ...updates, last_scanned_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', companyId)
    .select()
    .single();

  if (error) throw new ApiError(500, 'Failed to update company scan status');
  if (!data) throw new ApiError(404, 'Company not found or update blocked by RLS');
  return data;
}