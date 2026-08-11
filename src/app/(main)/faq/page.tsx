"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/* ------------------------------------------------------------------------
   Combined Help + FAQ page. Palette + fonts match the rest of the site
   (white/black/gray, red-600 accent, IBM Plex Mono/Sans). The hero
   gradient is copied verbatim from the footer.

   v2 change: dropped the grouped "subsection per category" layout (was
   causing an uneven card grid once answers opened at different heights)
   in favor of one clean stacked list. Category is now a small tag inside
   each row instead of a section header, and the chips under the search
   bar act as real filters instead of anchor links.
------------------------------------------------------------------------- */

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
});
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "f1",
    category: "Getting started",
    question: "How do I add my first job application?",
    answer:
      "From your dashboard, click \"New Application\" and fill in the role, company, and job URL. Trackly automatically kicks off a privacy scan for that company in the background.",
  },
  {
    id: "f2",
    category: "Getting started",
    question: "Do I need to create an account to use Trackly?",
    answer:
      "Yes — an account is what lets us keep your applications, notes, and reminders private to you and scoped behind your login.",
  },
  {
    id: "f3",
    category: "Getting started",
    question: "Can I import applications from a spreadsheet?",
    answer:
      "Not yet. Right now applications are added one at a time through the dashboard, but bulk import is on our roadmap.",
  },
  {
    id: "f4",
    category: "Privacy scans",
    question: "How does the privacy scan work?",
    answer:
      "When you add a job, Trackly looks for that company's published privacy policy, respects their robots.txt, and extracts details like retention period, DPO contact, and third-party data sharing — all from publicly available pages.",
  },
  {
    id: "f5",
    category: "Privacy scans",
    question: "What does a FLAGGED result mean?",
    answer:
      "FLAGGED means the scan detected something worth a closer look — most often third-party data sharing or an unusually long retention period. It's a prompt to review, not a definitive verdict.",
  },
  {
    id: "f6",
    category: "Privacy scans",
    question: "Can I trigger a manual re-scan?",
    answer:
      "Yes. Open a job's employer file and hit \"Re-analyze\" to force a fresh scan instead of waiting for the automatic refresh window.",
  },
  {
    id: "f7",
    category: "Privacy scans",
    question: "Why didn't Trackly find a privacy policy for a company?",
    answer:
      "A few reasons: the company disallows scraping in robots.txt, the policy is a PDF (not yet supported), or the link simply isn't in the usual footer/nav locations we check first.",
  },
  {
    id: "f8",
    category: "Job tracking",
    question: "Can I track interview stages?",
    answer:
      "Yes — every job moves through Applied, Interviewing, Offer, or Rejected, and you can filter or sort your board by status at any time.",
  },
  {
    id: "f9",
    category: "Job tracking",
    question: "Will I get reminded to follow up?",
    answer: "Yes. Trackly surfaces follow-up reminders based on how long an application has gone quiet, right on your activity feed.",
  },
  {
    id: "f10",
    category: "Job tracking",
    question: "Can I add notes to a job?",
    answer: "Yes, every job has a notes field for anything you want to remember — interviewer names, salary discussions, next steps.",
  },
  {
    id: "f11",
    category: "Account & billing",
    question: "Is Trackly free to use?",
    answer: "Trackly is currently free to use while it's in active development.",
  },
  {
    id: "f12",
    category: "Account & billing",
    question: "How do I delete my account and data?",
    answer:
      "Go to Settings → Account → Delete Account. This permanently removes your personal data — see our Privacy Policy for exactly what's retained versus deleted.",
  },
  {
    id: "f13",
    category: "Account & billing",
    question: "Do you sell or share my data?",
    answer: "No. Trackly doesn't sell data or share it for advertising — that's the whole point of the product.",
  },
];

const CATEGORIES = Array.from(new Set(FAQ_ITEMS.map((f) => f.category)));

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((f) => {
      const matchesQuery = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      const matchesCategory = !activeCategory || f.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  return (
    <main className={`${mono.variable} ${sans.variable} min-h-screen bg-white font-[family-name:var(--font-sans)] text-gray-900`}>
      {/* ============================= HERO =============================
          `isolate` is the important bit here: without it, -z-10 escapes
          past this section (and past <main>'s own white background) to
          the nearest real stacking context, which can end up behind
          everything and render as if the gradient isn't there at all.
          `isolate` pins a fresh stacking context to this section so the
          gradient is guaranteed to sit between the white page background
          and the hero content, nothing else. */}
      <section className="relative isolate overflow-hidden">
<div
          className="pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_150%_90%_at_50%_0%,rgba(219,234,254,0.9)_0%,rgba(224,231,255,0.4)_55%,rgba(255,255,255,0)_100%)]"
        />

        <div className="mx-auto max-w-3xl px-6 pb-28 pt-28 text-center">
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-red-600">Support</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-gray-900 md:text-5xl">How can we help?</h1>
          <p className="mx-auto mt-4 max-w-lg text-gray-600">
            Answers to common questions about tracking applications, privacy scans, and your account.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for an answer..."
              aria-label="Search FAQs"
              className="w-full rounded-full border border-gray-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                activeCategory === null
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white/70 text-gray-600 backdrop-blur-sm hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                  activeCategory === cat
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white/70 text-gray-600 backdrop-blur-sm hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FAQ LIST ======================= */}
      <section className="mx-auto max-w-3xl px-6 pb-28">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-sm text-gray-500">
            No results{query && <> for &ldquo;{query}&rdquo;</>}. Try a different search, or{" "}
            <a href="mailto:support@trackly.app" className="text-gray-900 underline underline-offset-2 hover:text-red-600">
              contact us
            </a>
            .
          </p>
        ) : (
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {filtered.map((f) => {
              const isOpen = openId === f.id;
              return (
                <div key={f.id}>
                  <button
                    onClick={() => setOpenId(isOpen ? null : f.id)}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:bg-gray-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="mb-1.5 inline-block rounded-full bg-gray-100 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.08em] text-gray-500">
                        {f.category}
                      </span>
                      <span className="block text-sm font-medium text-gray-900">{f.question}</span>
                    </span>
                    <ChevronDown
                      className={`mt-1 h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-8 text-sm leading-relaxed text-gray-600">{f.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}