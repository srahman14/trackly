"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "Is my data private?",
    a: "Yes. Trackly is built with a privacy-first approach. Your data is not sold or shared with third parties.",
  },
  {
    q: "Can I import applications from other platforms?",
    a: "You can manually add applications from any source like LinkedIn, company websites, or referrals.",
  },
  {
    q: "Do I need to connect my email?",
    a: "Yes, to use Trackly's services you must use your email to sign up.",
  },
  {
    q: "Is Trackly free to use?",
    a: "Yes, Trackly's services are free to use.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 border-t">
      <div className="mx-24 max-w-full">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-4xl md:text-4xl font-medium tracking-tight text-zinc-900">
            Frequently asked questions
          </h2>

          <p className="mt-4 text-zinc-600">
            Everything you need to know about Trackly.
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="mt-16 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;

            return (
              <div
                key={i}
                className="rounded-xl w-full border-b bg-white p-3 cursor-pointer"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-xl text-zinc-900">
                    {item.q}
                  </h3>

                  <motion.span
                    className="text-zinc-400 shrink-0"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <ChevronDown />
                  </motion.span>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-sm text-zinc-600">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
