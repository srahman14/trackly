import * as cheerio from 'cheerio';
import { createHash } from 'node:crypto';

/**
 * Hashes the meaningful visible text of a page, not raw HTML bytes.
 * Strips scripts/styles/comments (the most common source of per-request
 * noise — nonces, analytics IDs, cache-busting params) and collapses
 * whitespace, so two fetches of an unchanged page hash identically even
 * if their raw HTML differs byte-for-byte.
 */
export function hashPageContent(html: string): string {
  const $ = cheerio.load(html);
  $('script, style, noscript, svg').remove();
  const normalizedText = $('body').text().replace(/\s+/g, ' ').trim();
  return createHash('sha256').update(normalizedText).digest('hex');
}