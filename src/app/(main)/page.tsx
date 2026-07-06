"use client";

import FAQ from "@/components/FAQ";
import FeatureCards from "@/components/FeatureCards";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Monitor, MapPin, Activity } from "lucide-react";

const COLLECTED_DATA_POINTS = [
  { icon: Globe, label: "IP address" },
  { icon: Monitor, label: "Device and browser information" },
  { icon: MapPin, label: "Location" },
  { icon: Activity, label: "Behavioral tracking, especially on ATS platforms" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* HERO Section - Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/backgrounds/background-2.png"
            alt="Background"
            fill
            className="object-cover opacity-90 scale-105"
            priority
          />

          {/* fade image out at the bottom */}
          <div
            className="absolute inset-0 pointer-events-none
            bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.7)_75%,rgba(255,255,255,1)_100%)]"
          />
        </div>

        {/* viginette */}
        {/* <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0)_40%,rgba(255,255,255,0.6)_70%,rgba(255,255,255,1)_100%)]" />        CONTENT */}

        <div className="mx-auto max-w-6xl px-6 text-center">
          {/* badge */}
          <div className="inline-flex items-center rounded-full border px-4 py-1 text-sm text-zinc-600 bg-white/60 backdrop-blur">
            Privacy-first job tracking
          </div>

          {/* headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h1 className="mt-6 text-4xl md:text-7xl font-semibold tracking-tight text-zinc-900">
              Track your data
              <span className="block text-zinc-500 font-medium">
                with every{" "}
                <span className="text-black italic tracking-tighter">
                  application.
                </span>
              </span>
            </h1>
          </motion.div>

          {/* subtext */}
          <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto">
            A clean, private workspace to manage job applications, notes, and
            progress. Without trackers, ads, or data harvesting.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href={"/auth/register"}>
              <Button className="mt-6 inline-flex items-center gap-2 px-5 py-5 cursor-pointer rounded-lg bg-black text-white text-sm font-medium hover:bg-zinc-800 transition">
                Get started
              </Button>
            </Link>

            <Link href={"/"}>
              <Button
                variant={"outline"}
                className="mt-6 inline-flex items-center gap-2 px-5 py-5 cursor-pointer rounded-lg text-sm font-medium transition"
              >
                Learn more
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            No ads. No tracking. Your data is priority.
          </p>
        </div>
      </section>

      {/* HOOK SECTION - builds into the Our Purpose section */}
      <section className="pt-48 pb-40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
                Where is your job application data actually going?
              </h2>

              <p className="mt-6 text-zinc-600 text-lg leading-relaxed">
                Most job trackers store your applications on external servers —
                giving you little visibility or control over your own career
                data.
              </p>

              <p className="mt-4 text-zinc-500">
                Trackly is built differently — your data stays yours, always.
              </p>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative h-[420px] w-full">
              <div className="absolute inset-0 rounded-xl overflow-hidden border bg-zinc-100">
                <Image
                  src="/assets/scattered-applications.png"
                  alt="Privacy illustration"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-tr from-zinc-200/40 to-transparent blur-2xl -z-10" />
            </div>
          </div>

          {/* STATS SECTION */}
          <div className="mt-32 pt-16 border-t border-zinc-200">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-sm font-medium tracking-wide text-[#4C3575] uppercase"
            >
              The numbers
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mt-3 text-2xl md:text-3xl font-medium tracking-tight text-zinc-900 max-w-xl"
            >
              The job hunt runs on more data than you'd think.
            </motion.h3>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.12, delayChildren: 0.15 },
                },
              }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12"
            >
              {[
                {
                  stat: "9%",
                  copy: "of applicants say they always read a privacy policy before submitting their information.",
                },
                {
                  stat: "35 min",
                  copy: "the average time it takes to read a job platform's privacy policy in full.",
                },
                {
                  stat: "~90%",
                  copy: "of job platforms share or sell applicant data with third parties.",
                },
                {
                  stat: "1–4 yrs",
                  copy: "how long employers are required to retain your resume and application data, depending on jurisdiction.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <p className="text-4xl md:text-5xl font-semibold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(120deg,#4C3575,#8B6FC7)]">
                    {item.stat}
                  </p>
                  <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                    {item.copy}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Link
                href="/sources"
                className="mt-10 inline-block text-xs text-zinc-400 hover:text-zinc-600 underline underline-offset-4 decoration-zinc-300 transition-colors"
              >
                See sources
              </Link>
            </motion.div>
          </div>

          {/* WHAT'S ACTUALLY COLLECTED */}
          <div className="mt-32 grid md:grid-cols-2 gap-16 items-center">
            {/* LEFT TEXT */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-900">
                And it doesn't stop there.
              </h4>
              <p className="mt-5 text-zinc-600 text-lg leading-relaxed">
                Most companies now route applications through third-party
                applicant tracking systems.
              </p>
              <p className="mt-4 text-zinc-500 leading-relaxed">
                Your data passes through their processors before anyone at the
                company even sees it, governed by their retention and
                data-sharing rules, not yours. And a resume is rarely all they
                collect.
              </p>
            </motion.div>

            {/* RIGHT CARD */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative rounded-2xl border border-[#8B6FC7]/20 bg-gradient-to-b from-[#F7F5FB] to-white p-8"
            >
              <p className="text-sm font-medium text-zinc-900">
                What a single application can quietly collect
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  { icon: Globe, label: "IP address" },
                  { icon: Monitor, label: "Device and browser information" },
                  { icon: MapPin, label: "Location" },
                  {
                    icon: Activity,
                    label: "Behavioral tracking, especially on ATS platforms",
                  },
                ].map((row, i) => (
                  <li key={i} className="flex items-center gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8B6FC7]/10 text-[#4C3575]">
                      <row.icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="text-sm text-zinc-600">{row.label}</span>
                  </li>
                ))}
              </ul>

              {/* subtle ambient glow, matches hero palette */}
              <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-[#8B6FC7]/10 to-transparent blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* IMAGE */}
            <div className="relative h-[420px] w-full order-2 md:order-1">
              <div className="absolute inset-0 rounded-xl overflow-hidden border bg-zinc-100">
                <Image
                  src="/assets/trackly-dashboard.jpg"
                  alt="Scattered job applications"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* TEXT */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
                That’s where Trackly comes in
              </h2>

              <p className="mt-6 text-zinc-600 text-lg leading-relaxed">
                Most people apply to dozens of jobs across different platforms —
                LinkedIn, company websites, referrals — and quickly lose track
                of what they’ve applied to.
              </p>

              <p className="mt-4 text-zinc-500">
                Instead of spreadsheets, notes, and forgotten tabs — Trackly
                gives you one place to stay in control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <FeatureCards />

      <section className="py-32">
        <div className="mx-auto max-w-6xl px-6">
          {/* HEADER */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
              How Trackly works
            </h2>

            <p className="mt-4 text-zinc-600">
              A simple flow that brings all your job applications into one
              private place.
            </p>
          </div>

          {/* STEPS */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {/* STEP 1 */}
            <div className="rounded-xl border bg-white p-6">
              <div className="text-sm text-zinc-400">Step 01</div>
              <h3 className="mt-3 font-medium text-zinc-900">
                Add your applications
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Quickly log jobs from LinkedIn, company sites, or referrals in
                one place.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="rounded-xl border bg-white p-6">
              <div className="text-sm text-zinc-400">Step 02</div>
              <h3 className="mt-3 font-medium text-zinc-900">
                Organise & track progress
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                See every application stage clearly — applied, interviewing,
                offer, or rejected.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="rounded-xl border bg-white p-6">
              <div className="text-sm text-zinc-400">Step 03</div>
              <h3 className="mt-3 font-medium text-zinc-900">
                Stay in control
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Never lose track of opportunities — everything stays structured
                and private.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </main>
  );
}
