import { ExtractionInput } from './htmlToExtractionInput';

export interface ExtractedPrivacyEntities {
  dpoEmail: string | null;
  contactEmail: string | null;
  retentionPeriod: string | null;
  dataRequestUrl: string | null;
  sharesWithThirdParties: boolean | null;
  usesAiScreening: boolean | null;
  privacyScore: number;
  summary: string;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const DPO_CONTEXT_KEYWORDS = ['data protection officer', 'dpo', 'privacy officer'];
const RETENTION_KEYWORDS = ['retention', 'how long we keep', 'how long we retain', 'storage period'];
const THIRD_PARTY_KEYWORDS = ['third part', 'share your', 'share personal', 'disclose your', 'shared with'];
const AI_SCREENING_KEYWORDS = ['automated decision', 'automated processing', 'artificial intelligence', 'algorithm', 'ai-based', 'automated screening'];
const DATA_REQUEST_LINK_KEYWORDS = ['submit a request', 'data subject request', 'exercise your rights', 'privacy request', 'privacy portal', 'opt out', 'do not sell'];

export function extractPrivacyEntities(input: ExtractionInput): ExtractedPrivacyEntities {
  const contactEmail = findContactEmail(input);
  let dpoEmail = findDpoEmail(input);

  // Final fallback: many companies use one address for both roles. If we
  // found a privacy-flavored contact email but no dedicated DPO match,
  // it's reasonable to treat it as the DPO contact too.
  if (!dpoEmail && contactEmail && /privacy|dataprotection|dpo/i.test(contactEmail)) {
    dpoEmail = contactEmail;
  }

  const fields = {
    dpoEmail,
    contactEmail,
    retentionPeriod: findSectionText(input, RETENTION_KEYWORDS),
    dataRequestUrl: findDataRequestUrl(input),
    sharesWithThirdParties: containsAny(input.fullText, THIRD_PARTY_KEYWORDS),
    usesAiScreening: containsAny(input.fullText, AI_SCREENING_KEYWORDS),
  };

  return {
    ...fields,
    privacyScore: computePrivacyScore(fields),
    summary: buildSummary(fields),
  }
}

// Absence of a keyword isn't evidence the answer is "no" — a policy that
// never mentions AI screening might just not have written about it. Return
// null (unknown) rather than false, so the UI can distinguish "confirmed no"
// from "we don't know" — which we currently can't confirm without more
// sophisticated negation-aware parsing (a v2 problem, not today's).
function containsAny(text: string, keywords: string[]): boolean | null {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw)) ? true : null;
}

function findSectionText(input: ExtractionInput, keywords: string[]): string | null {
  const match = input.sections.find((s) =>
    keywords.some((kw) => s.heading.toLowerCase().includes(kw))
  );
  return match ? match.text.slice(0, 1000) : null; // cap length — this feeds a summary field, not a dump
}

function findDpoEmail(input: ExtractionInput): string | null {
  const section = input.sections.find((s) =>
    DPO_CONTEXT_KEYWORDS.some((kw) => s.heading.toLowerCase().includes(kw))
  );
  if (section) {
    const match = section.text.match(EMAIL_REGEX);
    if (match) return match[0];
  }

  // Scan EVERY occurrence of a keyword, not just the first — one early,
  // unrelated "DPO" mention shouldn't block finding the real one stated later.
  const lowerFullText = input.fullText.toLowerCase();
  for (const kw of DPO_CONTEXT_KEYWORDS) {
    let searchFrom = 0;
    while (true) {
      const idx = lowerFullText.indexOf(kw, searchFrom);
      if (idx === -1) break;
      const window = input.fullText.slice(Math.max(0, idx - 200), idx + 200);
      const match = window.match(EMAIL_REGEX);
      if (match) return match[0];
      searchFrom = idx + kw.length;
    }
  }
  return null;
}

function findContactEmail(input: ExtractionInput): string | null {
  const emails = input.fullText.match(EMAIL_REGEX);
  if (!emails) return null;
  const privacyLike = emails.find((e) => /privacy|dataprotection|dpo/i.test(e));
  return privacyLike ?? emails[0];
}

function findDataRequestUrl(input: ExtractionInput): string | null {
  const link = input.links.find((l) =>
    DATA_REQUEST_LINK_KEYWORDS.some((kw) => l.text.toLowerCase().includes(kw))
  );
  return link?.href ?? null;
}

function computePrivacyScore(fields: Omit<ExtractedPrivacyEntities, 'privacyScore' | 'summary'>): number {
  // Base score
  let score = 50; 
  if (fields.retentionPeriod) score += 15;
  if (fields.dpoEmail || fields.contactEmail) score += 15;
  if (fields.dataRequestUrl) score += 15;
  if (fields.sharesWithThirdParties) score -= 15;
  if (fields.usesAiScreening) score -= 15;

  return Math.max(0, Math.min(100, score))
}

function buildSummary(fields: Omit<ExtractedPrivacyEntities, 'privacyScore' | 'summary'>) { 
  const lines: string[] = [];
  lines.push(fields.retentionPeriod ? 'States a data retention period.' : 'No retention period stated.');
  lines.push(
    fields.dpoEmail || fields.contactEmail
      ? `Privacy/DPO contact listed: ${fields.dpoEmail ?? fields.contactEmail}.`
      : 'No privacy or DPO contact found.'
  );
  lines.push(fields.dataRequestUrl ? 'Provides a data request / erasure link.' : 'No dedicated data request link found.');
  lines.push(fields.sharesWithThirdParties ? 'Mentions sharing data with third parties.' : 'No third-party sharing detected.');
  lines.push(fields.usesAiScreening ? 'Mentions automated/AI-based screening.' : 'No AI screening mentioned.');
  return lines.join(' ');
}