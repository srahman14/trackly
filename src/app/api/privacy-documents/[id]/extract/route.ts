import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/api/auth';
import { apiSuccess, apiErrorResponse } from '@/lib/api/response';
import { getPrivacyDocumentById } from '@/lib/db/privacyDocuments';
import { createPrivacyEntity, getMostRecentPrivacyEntity } from '@/lib/db/privacyEntities';
import { htmlToExtractionInput } from '@/lib/scraper/htmlToExtractionInput';
import { extractPrivacyEntities } from '@/lib/scraper/extractor';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();
    const force = request.nextUrl.searchParams.get('force') === 'true';

    const document = await getPrivacyDocumentById(supabase, id);

    if (!force) {
      const existing = await getMostRecentPrivacyEntity(supabase, document.id, 'rule_based');
      if (existing) {
        return apiSuccess({ entity: existing, documentId: document.id, cached: true });
      }
    }

    const input = htmlToExtractionInput(document.raw_text, document.source_url);
    const extracted = extractPrivacyEntities(input);
    const entity = await createPrivacyEntity(supabase, document.id, extracted);

    return apiSuccess({ entity, documentId: document.id });
  } catch (error) {
    return apiErrorResponse(error);
  }
}