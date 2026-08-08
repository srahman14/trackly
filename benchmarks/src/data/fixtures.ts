import fs from "node:fs";
import path from "node:path";
import { config } from "../config";

/**
 * "unknown" means the fixture author (you) doesn't want this field scored
 * for this fixture — it's excluded from precision/recall entirely rather
 * than counted as a miss. Use it when a fixture genuinely doesn't test that
 * field (e.g. loopwell.html says nothing about AI screening either way).
 */
export type Tri = boolean | "unknown";

export interface FixtureGroundTruth {
  id: string;
  file: string;
  /** Fake but well-formed URL — only used to resolve relative links found in the HTML. */
  baseUrl: string;
  expected: {
    dpoEmail: string | null;
    contactEmail: string | null;
    /** Free-text field — we only check presence/absence, not exact wording. */
    retentionPeriodPresent: boolean;
    dataRequestUrlPresent: boolean;
    sharesWithThirdParties: Tri;
    usesAiScreening: Tri;
  };
  notes: string;
}

export const FIXTURES: FixtureGroundTruth[] = [
  {
    id: "fernbank-clean",
    file: "fernbank.html",
    baseUrl: "https://careers.fernbank.example/privacy",
    expected: {
      dpoEmail: "dpo@fernbank.example",
      contactEmail: "contact@fernbank.example",
      retentionPeriodPresent: true,
      dataRequestUrlPresent: true,
      sharesWithThirdParties: true,
      usesAiScreening: true,
    },
    notes: "Everything present and unambiguous — baseline happy path.",
  },
  {
    id: "halcyon-negation",
    file: "halcyon.html",
    baseUrl: "https://halcyonsystems.example/legal/privacy",
    expected: {
      dpoEmail: "privacy-officer@halcyonsystems.example",
      contactEmail: null,
      retentionPeriodPresent: true,
      dataRequestUrlPresent: true,
      // The page explicitly says "we do NOT share" / "we do NOT use AI".
      // A presence-detector extractor (as documented — see
      // "Scraping Engine - Progress 13-07-2026.md", known limitation) is
      // expected to still flag these true. We mark expected as `false` here
      // deliberately so this fixture QUANTIFIES that known false-positive
      // rate rather than hiding it — don't "fix" this fixture to make the
      // score look better; the point is to track the gap honestly.
      sharesWithThirdParties: false,
      usesAiScreening: false,
    },
    notes:
      "Negation case + an early unrelated 'DPO' mention (regression test for the fallback-loop fix in extractor.ts).",
  },
  {
    id: "loopwell-sparse",
    file: "loopwell.html",
    baseUrl: "https://loopwell.example/privacy",
    expected: {
      dpoEmail: null,
      contactEmail: "hello@loopwell.example",
      retentionPeriodPresent: false,
      dataRequestUrlPresent: false,
      sharesWithThirdParties: "unknown",
      usesAiScreening: "unknown",
    },
    notes: "Minimal real-world page — tests that missing fields return null instead of guessing.",
  },
];

export function loadFixtureHtml(fixture: FixtureGroundTruth): string {
  return fs.readFileSync(path.join(config.fixturesDir, fixture.file), "utf-8");
}
