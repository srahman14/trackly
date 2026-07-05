// findOrCreateCompanyByUrl(supabase, jobUrl) -> companyId
// normalize domain from jobUrl,
// select where domain = normalized
// if not found - insert with name placeholder (derived from thedomain e.g. strpe.com -> Stripe) and privacy_policy_url: null
// return the company row (existing or new)

import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "@/lib/api/errors";
import { normalizeDomain, domainToCompanyName } from "@/lib/utils/domain";
import type { Company } from "@/types/database";

export async function findOrCreateCompanyByUrl(
  supabase: SupabaseClient,
  jobUrl: string,
): Promise<Company> {
  const domain = normalizeDomain(jobUrl);

  // Lookup company based on the domain url (i.e. stripe.com -> 'Stripe' after normalization)
  const { data: existing, error: findError } = await supabase
    .from("companies")
    .select("*")
    .eq("domain", domain)
    .maybeSingle();

    // If company not found -> return API error 
  if (findError) throw new ApiError(500, "Failed to look up company");
  if (existing) return existing as Company;

  // Insert the company with name, domain and privacy_policy_url (currently null)
  const { data: created, error: createError } = await supabase
    .from("companies")
    .insert({
      name: domainToCompanyName(domain),
      domain,
      privacy_policy_url: null,
    })
    .select("*")
    .single();

  if (createError) {
    // unique_violation on companies.domain — another request won the race
    // between our select and insert, so just fetch what they created
    if (createError.code === "23505") {
      const { data: raceWinner, error: raceError } = await supabase
        .from("companies")
        .select("*")
        .eq("domain", domain)
        .single();

      if (raceError || !raceWinner) {
        throw new ApiError(500, "Failed to resolve company after conflict");
      }
      return raceWinner as Company;
    }
    throw new ApiError(500, "Failed to create company");
  }

  return created as Company;
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

  if (error) throw new ApiError(500, "Failed to fetch company");
  if (!data) throw new ApiError(404, "Company not found");
  return data as Company;
}
