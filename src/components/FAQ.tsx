"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is my data private?",
    a: "Yes. Trackly is built with a privacy-first approach. Your data is not sold or shared with third parties."
  },
  {
    q: "Can I import applications from other platforms?",
    a: "You can manually add applications from any source like LinkedIn, company websites, or referrals."
  },
  {
    q: "Do I need to connect my email?",
    a: "No. Trackly works without email integration, keeping your data fully under your control."
  },
  {
    q: "Is Trackly free to use?",
    a: "Yes, there is a free version with core features. Premium features may be added later."
  }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 border-t">

      <div className="mx-auto max-w-3xl px-6">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
            Frequently asked questions
          </h2>

          <p className="mt-4 text-zinc-600">
            Everything you need to know about Trackly.
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="mt-16 space-y-3">

          {faqs.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border bg-white p-5 cursor-pointer"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-zinc-900">
                  {item.q}
                </h3>

                <span className="text-zinc-400">
                  {open === i ? "−" : "+"}
                </span>
              </div>

              {open === i && (
                <p className="mt-3 text-sm text-zinc-600">
                  {item.a}
                </p>
              )}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}