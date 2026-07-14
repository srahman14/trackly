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

export async function getPrivacyDocumentById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('privacy_documents')
    .select('id, company_id, source_url, raw_text')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    if (error.code === '22P02') {
      throw new ApiError(400, 'Invalid privacy document id format');
    }
    throw new ApiError(500, 'Failed to fetch privacy document');
  }
  if (!data) throw new ApiError(404, 'Privacy document not found');
  return data;
}