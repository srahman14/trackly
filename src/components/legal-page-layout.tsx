"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/* ------------------------------------------------------------------------
   Shared by /app/terms/page.tsx and /app/privacy/page.tsx.

   Layout: a sticky left "table of contents" that tracks scroll position via
   IntersectionObserver, with a small vertical bar that slides between items
   (framer-motion layoutId) to show which section is currently in view —
   that's the "small bar on the left" from the brief. On mobile the sidebar
   collapses into a <details> "On this page" dropdown so nothing breaks on
   narrow screens.

   Palette matches the rest of the site: white / black / gray, red-600 as
   the single accent. No new dependencies — next/font, framer-motion, and
   Tailwind only.
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

export interface LegalSection {
  id: string;
  heading: string;
  content: ReactNode;
}

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-gray-600">{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalPageLayout({ eyebrow, title, lastUpdated, sections }: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      // biases toward the upper third of the viewport so a heading is
      // "active" as soon as it crosses into reading position, not only
      // when it's dead-center
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <main className={`${mono.variable} ${sans.variable} min-h-screen bg-white font-[family-name:var(--font-sans)] text-gray-900`}>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-red-600">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-gray-900 md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated {lastUpdated}</p>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          {/* MOBILE — collapsible "on this page" nav, sidebar hidden below lg */}
          <details className="rounded-md border border-gray-200 bg-gray-50 p-4 lg:hidden">
            <summary className="cursor-pointer select-none font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-gray-500">
              On this page
            </summary>
            <nav className="mt-3 space-y-2.5">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block text-sm text-gray-600 hover:text-gray-900">
                  {s.heading}
                </a>
              ))}
            </nav>
          </details>

          {/* DESKTOP — sticky scrollspy sidebar with sliding indicator bar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-28 border-l border-gray-200 pl-4">
              <ul className="space-y-1">
                {sections.map((s) => {
                  const isActive = s.id === activeId;
                  return (
                    <li key={s.id} className="relative">
                      {isActive && (
                        <motion.span
                          layoutId="toc-indicator"
                          className="absolute -left-4 inset-y-0 w-0.5 bg-red-600"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <a
                        href={`#${s.id}`}
                        className={`block py-1.5 text-sm transition-colors ${
                          isActive ? "font-medium text-gray-900" : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {s.heading}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* CONTENT */}
          <article className="min-w-0 space-y-16">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="text-xl font-semibold text-gray-900">{s.heading}</h2>
                <div className="mt-4 space-y-4">{s.content}</div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}