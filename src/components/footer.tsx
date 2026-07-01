import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* subtle fade from page → footer */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none
        bg-[linear-gradient(to_top,rgba(219,234,254,0.9)_0%,rgba(224,231,255,0.3)_90%,transparent_100%)]"
      />
      <div className="mx-auto max-w-6xl px-6">
        {/* ===================== */}
        {/* TOP CTA SECTION */}
        {/* ===================== */}
        <div className="grid md:grid-cols-2 gap-16 items-center py-24">
          {/* LEFT CTA */}
          <div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
              Take hold of your privacy today
            </h2>

            <p className="mt-4 text-zinc-600 max-w-md">
              Track your job applications without giving up control of your
              data. Simple, private, and built for focus.
            </p>

            <Link href={"/auth/register"}>
              <Button className="mt-6 inline-flex items-center gap-2 px-5 py-5 cursor-pointer rounded-lg bg-black text-white text-sm font-medium hover:bg-zinc-800 transition">
                Get started
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full h-[260px] rounded-xl border bg-white/60 backdrop-blur-xl overflow-hidden">
            {/* glow background */}

            {/* terminal header */}
            <div className="relative p-4 border-b flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="ml-2">trackly://privacy-control</span>
            </div>

            {/* content */}
            <div className="relative p-5 font-mono text-sm text-zinc-700 space-y-3">
              <p>$ access_data --status</p>
              <p className="text-green-600">✓ You control your data</p>

              <p>$ share_data --third-parties</p>
              <p className="text-red-500">✕ Disabled by default</p>

              <p>$ export --applications</p>
              <p className="text-zinc-500">→ Your data stays local-first</p>
            </div>
          </div>
        </div>

        {/* ===================== */}
        {/* FOOTER NAV */}
        {/* ===================== */}
        <div className="flex flex-col md:flex-row justify-between gap-10 py-10 border-t">
          {/* BRAND */}
          <div className="font-bold tracking-tight text-xl">
            <Image
              src="/icons/watermark-logo-dark.svg"
              alt="icon"
              width={140}
              height={48}
              className="object-contain shrink-0"
              priority
            />
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-3 gap-10 text-sm text-zinc-600">
            <div className="space-y-2">
              <p className="font-medium text-lg tracking-tight text-zinc-900">
                Product
              </p>
              <p>Features</p>
              <p>How it works</p>
              <p>Register</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-lg tracking-tight text-zinc-900">
                Company
              </p>
              <p>About</p>
              <p>Privacy</p>
              <p>Contact</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-lg tracking-tight text-zinc-900">
                Support
              </p>
              <p>Help</p>
              <p>FAQ</p>
            </div>
          </div>
        </div>

        {/* ===================== */}
        {/* BOTTOM BAR */}
        {/* ===================== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-t text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Trackly. All rights reserved.</p>

          <div className="flex gap-6">
            <a className="hover:text-zinc-900 transition" href="#">
              Twitter
            </a>
            <a className="hover:text-zinc-900 transition" href="#">
              GitHub
            </a>
            <a className="hover:text-zinc-900 transition" href="#">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
