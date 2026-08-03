import React from "react";
import Link from "next/link";

interface Source {
  stat: string;
  claim: string;
  publisher: string;
  title: string;
  year: string;
  url: string;
}

const sources: Source[] = [
  {
    stat: "~0.5%",
    claim:
      "On average, only 1 in 200 website visitors (0.5%) looked at the privacy notice. (The figure for unique visitors is slightly higher at 0.8%).",
    publisher: "Linklaters",
    title: "Who reads privacy notices? And why do we have them?",
    year: "2024",
    url: "https://www.linklaters.com/insights/blogs/digilinks/2024/september/uk---who-reads-privacy-notices-and-why-do-we-have-them",
  },
  {
    stat: "35 min",
    claim:
      "average time to read a job platform's privacy policy in full, based on reading-level and word-count analysis.",
    publisher: "Incogni",
    title:
      "Are job-search platforms exploiting job seekers for their personal data?",
    year: "2026",
    url: "https://blog.incogni.com/are-job-search-platforms-exploiting-job-seekers-for-their-personal-data/",
  },
  {
    stat: "90%",
    claim:
      "of investigated job-search and networking platforms sell user data.",
    publisher: "Incogni",
    title:
      "Are job-search platforms exploiting job seekers for their personal data?",
    year: "2026",
    url: "https://blog.incogni.com/are-job-search-platforms-exploiting-job-seekers-for-their-personal-data/",
  },
  {
    stat: "6 yrs",
    claim:
      "minimum federal requirement for employers to retain applicant records, including resumes.",
    publisher: "U.S. Equal Employment Opportunity Commission",
    title: "Summary of Selected Recordkeeping Obligations, 29 CFR Part 1602",
    year: "EEOC",
    url: "https://www.eeoc.gov/employers/summary-selected-recordkeeping-obligations-29-cfr-part-1602",
  },
];

// Extra reading
// https://www.geldards.com/insights/how-long-can-you-keep-personal-data-under-uk-gdpr/

const SourcesPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-medium tracking-wide text-red-600 uppercase">
        Sources
      </p>
      <h1 className="mt-3 text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
        Where our numbers come from
      </h1>
      <p className="mt-4 text-zinc-600 leading-relaxed max-w-xl">
        Every stat we cite on our site is pulled directly from a published
        study, survey, or regulation. Here's the full list, so you can check the
        numbers yourself.
      </p>

      <div className="mt-14 space-y-10">
        {sources.map((source, i) => (
          <div
            key={i}
            className="pb-10 border-b border-zinc-200 last:border-none"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold tracking-tight text-red-600/60">
                {source.stat}
              </span>
              <p className="text-sm text-zinc-600">{source.claim}</p>
            </div>

            <div className="mt-3 text-sm text-zinc-500">
              <span className="text-zinc-700 font-medium">
                {source.publisher}
              </span>{" "}
              — {source.title} ({source.year})
            </div>

            <Link
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-[#4C3575] hover:text-[#8B6FC7] underline underline-offset-4 transition-colors"
            >
              Read the source →
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-16 text-xs text-zinc-400 max-w-xl">
        Last checked July 2026. If any of these figures are updated by their
        original publisher, we'll update this page accordingly.
      </p>
    </div>
  );
};

export default SourcesPage;
