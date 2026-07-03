import FAQ from "@/components/FAQ";
import FeatureCards from "@/components/FeatureCards";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* HERO Section - Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/backgrounds/background-4.png"
            alt="Background"
            fill
            className="object-cover opacity-40 scale-105"
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
          <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
            Track your job applications
            <span className="block text-zinc-500 font-medium">
              with your <span className="text-">privacy</span> put first.
            </span>
          </h1>

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

              {/* subtle glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-zinc-200/40 to-transparent blur-2xl -z-10" />
            </div>
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
