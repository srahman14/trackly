/**
 * runPrivacyDiscovery.ts -> main purpose: given a company, find and stores its privacy policy page. Owns the freshness cache, robots check, and content-hash dedupe. Does not deal with extraction -> only finds and stores the privacy policy.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import { ApiError } from '@/lib/api/errors';
import { getCompanyById, updateCompanyScanStatus } from '@/lib/db/companies';
import { getMostRecentJobUrlForCompany } from '@/lib/db/jobs';
import { createPrivacyDocument, getMostRecentPrivacyDocument } from '@/lib/db/privacyDocuments';
import { isScrapingAllowed } from './robots';
import { fetchPage } from './fetcher';
import { findPrivacyPolicyLink } from './linkFinder';
import { hashPageContent } from './contentHash';

export type PrivacyDiscoveryResult =
  | { status: 'found'; privacyPolicyUrl: string; documentId: string; cached?: boolean; unchanged?: boolean }
  | { status: 'not_found'; cached?: boolean }
  | { status: 'error'; reason: string; cached?: boolean };

const FRESHNESS_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

export async function runPrivacyDiscovery(
  supabase: SupabaseClient,
  companyId: string,
  options: { force?: boolean } = {}
): Promise<PrivacyDiscoveryResult> {
  const company = await getCompanyById(supabase, companyId);

  // if there exists a scan within the last 24hrs -> get the most recetn privacy document
  if (!options.force && company.last_scanned_at) {
    const age = Date.now() - new Date(company.last_scanned_at).getTime();
    if (age < FRESHNESS_WINDOW_MS) {
      const status = company.privacy_scan_status as 'found' | 'not_found' | 'error';
      if (status === 'found') {
        const existing = await getMostRecentPrivacyDocument(supabase, companyId);
        return {
          status,
          privacyPolicyUrl: company.privacy_policy_url as string,
          documentId: existing?.id ?? '', // fallback only if row somehow missing despite status
          cached: true,
        };
      }
      return { status, cached: true } as PrivacyDiscoveryResult;
    }
  }
  
  await updateCompanyScanStatus(supabase, companyId, { privacy_scan_status: 'scanning' });

  if (company.privacy_policy_url) {
    return fetchAndStore(supabase, companyId, company.privacy_policy_url);
  }

  const jobUrl = await getMostRecentJobUrlForCompany(supabase, companyId);
  if (!jobUrl) {
    throw new ApiError(
      422,
      'No job on file for this company to discover a privacy policy from. Add a job, or set privacy_policy_url manually.'
    );
  }

  if (!(await isScrapingAllowed(jobUrl))) {
    await updateCompanyScanStatus(supabase, companyId, { privacy_scan_status: 'error' });
    return { status: 'error', reason: 'robots_disallowed_job_page' };
  }

  const jobPage = await fetchPage(jobUrl);
  if (!jobPage.ok) {
    await updateCompanyScanStatus(supabase, companyId, { privacy_scan_status: 'error' });
    const detail = jobPage.status ? `${jobPage.reason}:${jobPage.status}` : jobPage.reason;
    return { status: 'error', reason: `job_page_fetch_failed:${detail}` };
  }

  const discovered = findPrivacyPolicyLink(jobPage.html, jobPage.finalUrl);
  if (!discovered) {
    await updateCompanyScanStatus(supabase, companyId, { privacy_scan_status: 'not_found' });
    return { status: 'not_found' };
  }

  return fetchAndStore(supabase, companyId, discovered);
}

async function fetchAndStore(
  supabase: SupabaseClient,
  companyId: string,
  privacyUrl: string
): Promise<PrivacyDiscoveryResult> {
  if (!(await isScrapingAllowed(privacyUrl))) {
    await updateCompanyScanStatus(supabase, companyId, { privacy_scan_status: 'error' });
    return { status: 'error', reason: 'robots_disallowed_privacy_page' };
  }

  const page = await fetchPage(privacyUrl);
  if (!page.ok) {
    await updateCompanyScanStatus(supabase, companyId, { privacy_scan_status: 'error' });
    const detail = page.status ? `${page.reason}:${page.status}` : page.reason;
    return { status: 'error', reason: `privacy_page_fetch_failed:${detail}` };
  }

  const existing = await getMostRecentPrivacyDocument(supabase, companyId);
  const isUnchanged = existing !== null && hashPageContent(existing.raw_text) === hashPageContent(page.html);

  const doc = isUnchanged
    ? existing!
    : await createPrivacyDocument(supabase, { companyId, sourceUrl: page.finalUrl, rawText: page.html });

  await updateCompanyScanStatus(supabase, companyId, {
    privacy_scan_status: 'found',
    privacy_policy_url: page.finalUrl,
  });

  return { status: 'found', privacyPolicyUrl: page.finalUrl, documentId: doc.id, unchanged: isUnchanged };
}