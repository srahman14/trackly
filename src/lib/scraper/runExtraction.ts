/**
 * runExtraction.ts -> main purpose: given a document ID, pull structured fields out of its stored HTML and store them as privacy_entities row. Does not extract unless 'forced' cache. Does not concern scanning. 
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { getPrivacyDocumentById } from "../db/privacyDocuments";
import { createPrivacyEntity, getMostRecentPrivacyEntity } from "../db/privacyEntities";
import { htmlToExtractionInput } from "./htmlToExtractionInput";
import { extractPrivacyEntities } from "./extractor";

export async function runExtraction(
    supabase: SupabaseClient,
    documentId: string,
    options: { force?: boolean } = {}
) {
    // Get the privacy document related to the company -> holds the extracted details of a privacy policy for a company
    const document = await getPrivacyDocumentById(supabase, documentId)

    // If there has been a scan in the last 24 hours then get the most recent privacy entity
    if (!options.force) {
        const existing = await getMostRecentPrivacyEntity(supabase, document.id, 'rule_based');
        if (existing) return { entity: existing, documentId: document.id, cached: true };
    }

    // If there is no scan in the last 24 hours (i.e. force = true) -> then extract the privacy policy again and create a new privacy entity
    const input = htmlToExtractionInput(document.raw_text, document.source_url);
    const extracted = extractPrivacyEntities(input);
    const entity = await createPrivacyEntity(supabase, document.id, extracted);
    return { entity, documentId: document.id };
}