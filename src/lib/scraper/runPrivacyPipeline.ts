/** 
 * Runs discovery -> extraction back to back for newly created job's company.
 * Designed to be called from Next.js's after() so it never blocks or can fail the job-creation request. 
 * Swallow all errors here, the company's privacy_scan_status reflets failure states
*/

import { SupabaseClient } from "@supabase/supabase-js";
import { runPrivacyDiscovery } from "./runPrivacyDiscovery";
import { runExtraction } from "./runExtraction";

export async function runPrivacyPipeline(supabase: SupabaseClient, companyId: string) {
    try {
        const scanResult = await runPrivacyDiscovery(supabase, companyId);
        let extractResult = null;
        if (scanResult.status === 'found' && scanResult.documentId) {
            extractResult = await runExtraction(supabase, scanResult.documentId);
        }
        return { scanResult, extractResult };
    } catch (err) {
        console.error(`Background privacy policy failed for company ${companyId}:`, err);
    }
}