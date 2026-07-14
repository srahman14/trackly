import { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@/lib/api/errors';
import { ExtractedPrivacyEntities } from '@/lib/scraper/extractor';

export async function createPrivacyEntity(
  supabase: SupabaseClient,
  privacyDocumentId: string,
  entities: ExtractedPrivacyEntities
) {
  const { data, error } = await supabase
    .from('privacy_entities')
    .insert({
      privacy_document_id: privacyDocumentId,
      dpo_email: entities.dpoEmail,
      contact_email: entities.contactEmail,
      retention_period: entities.retentionPeriod,
      data_request_url: entities.dataRequestUrl,
      shares_with_third_parties: entities.sharesWithThirdParties,
      uses_ai_screening: entities.usesAiScreening,
      extraction_method: 'rule_based',
    })
    .select()
    .single();

  if (error) throw new ApiError(500, 'Failed to store privacy entities');
  return data;
}

export async function getMostRecentPrivacyEntity(
  supabase: SupabaseClient,
  privacyDocumentId: string,
  extractionMethod: 'rule_based' | 'ai'
) {
  const { data, error } = await supabase
    .from('privacy_entities')
    .select('*')
    .eq('privacy_document_id', privacyDocumentId)
    .eq('extraction_method', extractionMethod)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new ApiError(500, 'Failed to look up existing privacy entity');
  return data;
}