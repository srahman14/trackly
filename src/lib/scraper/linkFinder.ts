// src/lib/scraper/linkFinder.ts
import * as cheerio from "cheerio";

const PRIVACY_KEYWORDS = [
  "privacy policy",
  "privacy notice",
  "data protection",
  "gdpr",
  "cookie policy",
];

/**
 * Scans a page's anchor tags for a link that's likely the privacy policy.
 * Footer/nav links are weighted higher since that's where these almost
 * always live — avoids grabbing an unrelated in-body mention of "privacy."
 */
export function findPrivacyPolicyLink(
  html: string,
  baseUrl: string,
): string | null {
  const $ = cheerio.load(html);
  const candidates: { href: string; score: number }[] = [];

  $("a[href]").each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    const href = $(el).attr("href");
    if (!href || !text) return;

    const keywordIndex = PRIVACY_KEYWORDS.findIndex((kw) => text.includes(kw));
    if (keywordIndex === -1) return;

    // earlier keywords in the list score higher
    let score = 10 - keywordIndex; 
    const inFooter = $(el).closest("footer").length > 0;
    const inNav = $(el).closest("nav").length > 0;
    if (inFooter) score += 5;
    if (inNav) score += 2;

    let resolved: string;
    try {
      resolved = new URL(href, baseUrl).toString();
    } catch {
      // unresolvable href (mailto:, javascript:, malformed)
      return;
    }

    candidates.push({ href: resolved, score });
  });

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].href;
}
