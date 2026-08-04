/** 
 * Runs discovery -> extraction back to back for newly created job's company.
 * Designed to be called from Next.js's after() so it never blocks or can fail the job-creation request. 
 * Swallow all errors here, the company's privacy_scan_status reflets failure states
*/

import { SupabaseClient } from "@supabase/supabase-js";
import { runPrivacyDiscovery } from "./runPrivacyDiscovery";
import { runExtraction } from "./runExtraction";
import { createScanLog } from "../db/scanLogs";

// runPrivacyPipeline.ts — updated to accept and log triggeredBy
export async function runPrivacyPipeline(
  supabase: SupabaseClient,
  companyId: string,
  triggeredBy: 'job_creation' | 'manual' = 'manual'
) {
  const scanResult = await runPrivacyDiscovery(supabase, companyId);
  await createScanLog(supabase, {
    companyId,
    stage: 'discovery',
    status: scanResult.status === 'found' ? (scanResult.cached ? 'cached' : 'success') : scanResult.status,
    reason: scanResult.status === 'error' ? scanResult.reason : undefined,
    triggeredBy,
    privacyDocumentId: scanResult.status === 'found' ? scanResult.documentId || undefined : undefined,
  });

  let extractResult = null;
  if (scanResult.status === 'found' && scanResult.documentId) {
    extractResult = await runExtraction(supabase, scanResult.documentId);
    await createScanLog(supabase, {
      companyId,
      stage: 'extraction',
      status: extractResult.cached ? 'cached' : 'success',
      triggeredBy,
      privacyDocumentId: scanResult.documentId,
      privacyEntityId: extractResult.entity.id,
    });
  }

  return { scanResult, extractResult };
}