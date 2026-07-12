import { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "../api/errors";

export async function createPrivacyDocument(
  supabase: SupabaseClient
  ,
  args: { companyId: string; sourceUrl: string; rawText: string }
) {
  const { data, error } = await supabase
    .from('privacy_documents')
    .insert({ company_id: args.companyId, source_url: args.sourceUrl, raw_text: args.rawText })
    .select()
    .single();

  if (error) throw new ApiError(500, 'Failed to store privacy document');
  return data;
}

export async function getMostRecentPrivacyDocument(
  supabase: SupabaseClient,
  companyId: string
) {
  const { data, error } = await supabase
    .from('privacy_documents')
    .select('id, raw_text')
    .eq('company_id', companyId)
    .order('scraped_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new ApiError(500, 'Failed to look up existing privacy document');
  return data;
}