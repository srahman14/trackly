"use client";

import { useEffect, useState, type ElementType } from "react";
import FAQ from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Globe,
  Monitor,
  MapPin,
  Activity,
  X,
  Check,
} from "lucide-react";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/* ------------------------------------------------------------------------
   FONTS — no new packages, both ship with Next's built-in next/font/google.
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

/* ------------------------------------------------------------------------
   NOTE ON THIS SECTION: the hero below intentionally keeps its own dark,
   hand-picked palette (near-black surface, cream text, gold accent) as
   requested. Every other section below the hero uses plain Tailwind
   defaults only: white / black / gray, plus red-600 (risk/flag) and
   emerald-600 (clear/verified) as the only two accents.

   All company names used below the hero are fictional (Fernbank, Halcyon,
   Loopwell, Northfield, Corvid Labs, Kestrel & Co, Marrow, Iris & Co) to
   avoid referencing real employers.
------------------------------------------------------------------------- */

/* ============================ LIVE SCAN TERMINAL ==========================
   Hero's signature element — unchanged from the previous pass.
============================================================================ */

type Tone = "ok" | "warn" | "flag";

interface ScanLineItem {
  label: string;
  value: string;
  tone: Tone;
}

interface ScanCase {
  company: string;
  url: string;
  lines: ScanLineItem[];
  verdict: "CLEAR" | "FLAGGED";
}

const SCAN_CASES: ScanCase[] = [
  {
    company: "STRIPE",
    url: "careers.stripe.com/privacy",
    lines: [
      { label: "robots.txt", value: "allowed", tone: "ok" },
      { label: "privacy notice", value: "found — footer link", tone: "ok" },
      {
        label: "retention period",
        value: "24 months post-rejection",
        tone: "warn",
      },
      { label: "DPO contact", value: "privacy@stripe.com", tone: "ok" },
      {
        label: "third-party sharing",
        value: "detected — 3 processors",
        tone: "flag",
      },
    ],
    verdict: "FLAGGED",
  },
  {
    company: "REMOTE.COM",
    url: "remote.com/privacy",
    lines: [
      { label: "robots.txt", value: "allowed", tone: "ok" },
      { label: "privacy notice", value: "found — footer link", tone: "ok" },
      { label: "retention period", value: "12 months", tone: "ok" },
      { label: "DPO contact", value: "dpo@remote.com", tone: "ok" },
      { label: "erasure process", value: "self-serve portal", tone: "ok" },
    ],
    verdict: "CLEAR",
  },
];

const TONE_COLOR: Record<Tone, string> = {
  ok: "#4F8A46",
  warn: "#C99A2E",
  flag: "#B3341F",
};

const VERDICT_COLOR: Record<ScanCase["verdict"], string> = {
  CLEAR: "#4F8A46",
  FLAGGED: "#B3341F",
};

function LiveScanTerminal() {
  const [activeCase, setActiveCase] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [paused, setPaused] = useState(false);

  const current = SCAN_CASES[activeCase];
  const done = lineCount >= current.lines.length;

  useEffect(() => {
    if (!done) {
      const t = setTimeout(() => setLineCount((n) => n + 1), 550);
      return () => clearTimeout(t);
    }
    if (!paused) {
      const t = setTimeout(() => {
        setActiveCase((i) => (i + 1) % SCAN_CASES.length);
        setLineCount(0);
      }, 2800);
      return () => clearTimeout(t);
    }
  }, [done, paused, activeCase, lineCount]);

  function selectCase(i: number) {
    setActiveCase(i);
    setLineCount(0);
    setPaused(true);
  }

  return (
    <div className="relative w-full rounded-md border border-[#3a3d33] bg-[#141610] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-center gap-1 border-b border-[#3a3d33] px-3 py-2">
        {SCAN_CASES.map((c, i) => (
          <button
            key={c.company}
            onClick={() => selectCase(i)}
            className={`rounded-sm px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.15em] transition-colors ${
              i === activeCase
                ? "bg-[#E7E2CE] text-[#0E0F0D]"
                : "text-[#8A8266] hover:text-[#E7E2CE]"
            }`}
          >
            {c.company}
          </button>
        ))}
        {paused && (
          <button
            onClick={() => setPaused(false)}
            className="ml-auto font-[family-name:var(--font-mono)] text-[10px] tracking-[0.15em] text-[#8A8266] underline underline-offset-2 hover:text-[#E7E2CE]"
          >
            resume auto-scan
          </button>
        )}
      </div>

      <div className="min-h-[260px] p-5 font-[family-name:var(--font-mono)] text-[13px]">
        <p className="mb-4 text-[#8A8266]">
          <span className="text-[#C99A2E]">$</span> scan {current.url}
        </p>

        <div className="space-y-2">
          {current.lines.slice(0, lineCount).map((line, i) => (
            <motion.div
              key={`${activeCase}-${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between gap-4 text-[#cfc9ae]"
            >
              <span className="text-[#8A8266]">{line.label}</span>
              <span className="flex items-center gap-2">
                {line.value}
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: TONE_COLOR[line.tone] }}
                />
              </span>
            </motion.div>
          ))}
        </div>

        {!done && (
          <span className="mt-3 inline-block h-3.5 w-2 animate-pulse bg-[#cfc9ae] motion-reduce:animate-none" />
        )}

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              exit={{ opacity: 0 }}
              className="mt-6 inline-block border-2 px-3 py-1 font-bold tracking-[0.2em]"
              style={{
                color: VERDICT_COLOR[current.verdict],
                borderColor: VERDICT_COLOR[current.verdict],
              }}
            >
              {current.verdict}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================== DATA TRAIL DIAGRAM ========================= */

interface TrailNode {
  id: string;
  num: string;
  label: string;
  detail: string;
}

const TRAIL_NODES: TrailNode[] = [
  {
    id: "you",
    num: "01",
    label: "Your application",
    detail: "Name, resume, cover letter — submitted once, to one company.",
  },
  {
    id: "ats",
    num: "02",
    label: "ATS platform",
    detail:
      "Greenhouse, Workday, Lever — most companies outsource intake to a third party before anyone on their team sees it.",
  },
  {
    id: "processor",
    num: "03",
    label: "Data processor",
    detail:
      "Background checks, assessment tools and email vendors each get their own copy, governed by their own retention rules.",
  },
  {
    id: "broker",
    num: "04",
    label: "Ad / data network",
    detail:
      "Roughly 9 in 10 job platforms share or resell applicant data — this is the step most people never see.",
  },
];

function DataTrailDiagram() {
  const [selected, setSelected] = useState(TRAIL_NODES[3].id);
  const node = TRAIL_NODES.find((n) => n.id === selected)!;

  return (
    <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-6">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gray-300" />
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-600 motion-reduce:hidden"
            style={{ left: 0 }}
            animate={{ left: ["0%", "100%"] }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.2,
            }}
          />
        ))}
        {TRAIL_NODES.map((n) => (
          <button
            key={n.id}
            onClick={() => setSelected(n.id)}
            className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 px-1"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-[family-name:var(--font-mono)] text-[10px] transition-colors md:h-11 md:w-11 ${
                selected === n.id
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-300 bg-gray-50 text-gray-500"
              }`}
            >
              {n.num}
            </span>
            <span className="max-w-[76px] text-center font-[family-name:var(--font-mono)] text-[9px] leading-tight text-gray-500 md:text-[10px]">
              {n.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={node.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-8 text-sm leading-relaxed text-gray-700"
        >
          <span className="mr-2 font-[family-name:var(--font-mono)] text-[11px] text-red-600">
            ↳
          </span>
          {node.detail}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ========================== COLLECTED DATA SCANNER ========================= */

interface Collected {
  id: string;
  icon: ElementType;
  label: string;
  detail: string;
}

const COLLECTED: Collected[] = [
  {
    id: "ip",
    icon: Globe,
    label: "IP address",
    detail:
      "Used to infer your approximate location and flag repeat visits across sessions.",
  },
  {
    id: "device",
    icon: Monitor,
    label: "Device & browser fingerprint",
    detail:
      "Screen size, plugins and browser build combine into an identifier that survives clearing cookies.",
  },
  {
    id: "loc",
    icon: MapPin,
    label: "Location",
    detail:
      "Requested directly on some application forms, or inferred silently from your IP.",
  },
  {
    id: "behavior",
    icon: Activity,
    label: "Behavioral tracking",
    detail:
      "Scroll depth, time-on-page and mouse movement — standard on Greenhouse and Workday forms.",
  },
];

function CollectedDataScanner() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8">
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-gray-500">
        What a single application quietly collects
      </p>

      <ul className="mt-6 space-y-1">
        {COLLECTED.map((row, i) => {
          const isOpen = open === row.id;
          return (
            <li
              key={row.id}
              className="border-b border-gray-100 last:border-none"
            >
              <button
                onClick={() => setOpen(isOpen ? null : row.id)}
                className="flex w-full items-center gap-3.5 py-3 text-left"
              >
                <motion.span
                  animate={{ opacity: [1, 0.45, 1] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 motion-reduce:opacity-100"
                >
                  <row.icon className="h-4 w-4" strokeWidth={1.75} />
                </motion.span>
                <span className="flex-1 text-sm text-gray-800">
                  {row.label}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.15em] text-gray-400">
                  {isOpen ? "HIDE" : "DETAILS"}
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 pl-12 pr-2 text-xs leading-relaxed text-gray-500">
                      {row.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ================================ FOLLOW-UP PANEL ===========================
   Now the primary visual for "That's where Trackly comes in" — enlarged to
   fill the role the notification feed used to play. The most urgent row
   pulses; click a row to check it off. Fixed-height, overflow-hidden shell
   keeps its footprint constant so the heading beside it never shifts.
============================================================================ */

interface FollowUp {
  id: string;
  company: string;
  days: number;
}

const FOLLOW_UPS: FollowUp[] = [
  { id: "f1", company: "Fernbank", days: 1 },
  { id: "f2", company: "Halcyon Systems", days: 4 },
  { id: "f3", company: "Loopwell", days: 9 },
  { id: "f4", company: "Kestrel & Co", days: 16 },
];

function FollowUpPanel() {
  const [handled, setHandled] = useState<Set<string>>(new Set());
  const sorted = [...FOLLOW_UPS].sort(
    (a, b) => (handled.has(a.id) ? 1 : 0) - (handled.has(b.id) ? 1 : 0),
  );

  function toggle(id: string) {
    setHandled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-gray-500">
          Follow-ups
        </span>
        <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] text-emerald-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600 motion-reduce:animate-none" />
          live
        </span>
      </div>

      <div className="relative mt-4 h-[296px] overflow-hidden">
        <ul className="space-y-2.5">
          <AnimatePresence initial={false}>
            {sorted.map((f) => {
              const isHandled = handled.has(f.id);
              const isUrgent = !isHandled && f.days <= 2;
              return (
                <motion.li
                  key={f.id}
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                  <button
                    onClick={() => toggle(f.id)}
                    className={`flex w-full items-center justify-between rounded-md border-l-4 px-4 py-3.5 text-left text-sm transition-colors ${
                      isHandled
                        ? "border-emerald-600 bg-gray-50 text-gray-400"
                        : isUrgent
                          ? "border-red-600 bg-gray-50 text-gray-900"
                          : "border-gray-300 bg-gray-50 text-gray-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border ${
                          isHandled
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {isHandled && (
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        )}
                      </span>
                      <span className={isHandled ? "line-through" : ""}>
                        {f.company}
                      </span>
                    </span>
                    <span className="relative flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] text-gray-500">
                      {isUrgent && (
                        <motion.span
                          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                          className="absolute -left-3 h-2 w-2 rounded-full bg-red-500 motion-reduce:hidden"
                        />
                      )}
                      {!isHandled && isUrgent && (
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      )}
                      {isHandled ? "done" : `${f.days}d ago`}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

/* =============================== NOTIFICATION FEED ===========================
   Now lives in "Everything in one place" — UI only, no internal caption text.
   Its title/description are rendered below it by the parent grid instead.
============================================================================ */

interface Notif {
  id: string;
  tone: "reminder" | "privacy" | "status";
  title: string;
  body: string;
}

const NOTIF_SEED: Notif[] = [
  {
    id: "n1",
    tone: "reminder",
    title: "Follow-up due",
    body: "Northfield — applied 14 days ago, no response yet.",
  },
  {
    id: "n2",
    tone: "privacy",
    title: "Retention alert",
    body: "2 companies likely still hold your data from 6 months ago.",
  },
  {
    id: "n3",
    tone: "status",
    title: "Status changed",
    body: "Corvid Labs moved you to Round 2 — Technical Interview.",
  },
  {
    id: "n4",
    tone: "privacy",
    title: "Erasure available",
    body: "Marrow's policy allows a self-serve deletion request.",
  },
  {
    id: "n5",
    tone: "reminder",
    title: "Interview prep",
    body: "Iris & Co interview in 2 days.",
  },
];

const TONE_STYLE: Record<
  Notif["tone"],
  { border: string; text: string; label: string }
> = {
  reminder: {
    border: "border-red-300",
    text: "text-red-500",
    label: "REMINDER",
  },
  privacy: { border: "border-red-600", text: "text-red-600", label: "PRIVACY" },
  status: {
    border: "border-emerald-600",
    text: "text-emerald-600",
    label: "STATUS",
  },
};

function NotificationFeed() {
  const [queue, setQueue] = useState<Notif[]>(NOTIF_SEED);

  useEffect(() => {
    const t = setInterval(() => {
      setQueue((q) => [...q.slice(1), q[0]]);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  function dismiss(id: string) {
    setQueue((q) => {
      const item = q.find((n) => n.id === id)!;
      return [...q.filter((n) => n.id !== id), item];
    });
  }

  const visible = queue.slice(0, 3);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-gray-500">
          Activity
        </span>
        <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] text-emerald-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600 motion-reduce:animate-none" />
          live
        </span>
      </div>

      <div className="relative mt-4 h-[280px] overflow-hidden">
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {visible.map((n) => (
              <motion.button
                key={n.id}
                layout
                onClick={() => dismiss(n.id)}
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, position: "absolute" }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className={`flex w-full items-start gap-3 rounded-md border-l-4 bg-gray-50 px-3.5 py-3 text-left shadow-sm ${TONE_STYLE[n.tone].border}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-[family-name:var(--font-mono)] text-[9px] tracking-[0.1em] ${TONE_STYLE[n.tone].text}`}
                    >
                      {TONE_STYLE[n.tone].label}
                    </span>
                    <span className="text-xs font-semibold text-gray-900">
                      {n.title}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {n.body}
                  </p>
                </div>
                <X className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ================================= MINI KANBAN ==============================
   UI only — no internal caption text. Card drifts across stages on its own
   loop; click it to advance it manually via the shared layoutId.
============================================================================ */

const KANBAN_COLUMNS = ["Applied", "Interview", "Offer"];

function MiniKanban() {
  const [col, setCol] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCol((c) => (c + 1) % KANBAN_COLUMNS.length),
      3400,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="grid grid-cols-3 gap-2.5">
        {KANBAN_COLUMNS.map((label, i) => (
          <div
            key={label}
            className="min-h-[240px] rounded-md border border-dashed border-gray-200 bg-gray-50 p-2.5"
          >
            <p className="mb-2.5 text-center font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-gray-400">
              {label}
            </p>
            {i === 0 && (
              <div className="mb-2 rounded-sm border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-400">
                Northfield
              </div>
            )}
            {col === i && (
              <motion.button
                layoutId="kanban-card"
                onClick={() => setCol((c) => (c + 1) % KANBAN_COLUMNS.length)}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="w-full rounded-sm border border-red-600 bg-red-50 px-2.5 py-2 text-left text-xs font-medium text-gray-900"
              >
                Fernbank
              </motion.button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =============================== MINI SCORE DIAL =============================
   UI only — no internal caption text. Pick a company chip to see the ring
   animate to its score.
============================================================================ */

interface ScoreCase {
  id: string;
  name: string;
  score: number;
}

const SCORE_CASES: ScoreCase[] = [
  { id: "fernbank", name: "Fernbank", score: 54 },
  { id: "halcyon", name: "Halcyon Systems", score: 41 },
  { id: "loopwell", name: "Loopwell", score: 88 },
];

function MiniScoreDial() {
  const [selected, setSelected] = useState("loopwell");
  const current = SCORE_CASES.find((c) => c.id === selected)!;
  const good = current.score >= 70;
  const ringColor = good ? "#059669" : "#dc2626";

  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-6">
        <div className="relative h-28 w-28 shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full motion-reduce:hidden"
            style={{ backgroundColor: ringColor, opacity: 0.12 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${ringColor} ${current.score * 3.6}deg, #e5e7eb 0deg)`,
            }}
          />
          <div className="absolute inset-[8px] flex items-center justify-center rounded-full bg-white">
            <AnimatePresence mode="wait">
              <motion.span
                key={current.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="font-[family-name:var(--font-mono)] text-lg font-semibold text-gray-900"
              >
                {current.score}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {SCORE_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`rounded-sm px-2.5 py-1.5 text-left font-[family-name:var(--font-mono)] text-[11px] tracking-[0.05em] transition-colors ${
                selected === c.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================================== STATS ================================ */

const STATS = [
  {
    stat: "~0.5%",
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
    stat: "1–6 yrs",
    copy: "how long employers are required to retain your resume and application data, depending on jurisdiction.",
  },
];

/* ==================================== STEPS ================================= */

const STEPS = [
  {
    title: "Add your applications",
    body: "Quickly log jobs from LinkedIn, company sites, or referrals in one place.",
  },
  {
    title: "Trackly opens the file",
    body: "We find the privacy notice, extract retention and contact details, and flag what stands out.",
  },
  {
    title: "Stay in control",
    body: "Follow-up reminders, deletion templates, and a clear record — nothing tracked, nothing sold.",
  },
];

/* ==================================== PAGE =================================== */

export default function Home() {
  return (
    <main
      className={`${mono.variable} ${sans.variable} min-h-screen bg-white font-[family-name:var(--font-sans)] text-gray-900`}
    >
      {/* ============================= HERO (unchanged palette) ============================= */}
      <section className="relative pb-24 overflow-hidden bg-[#0E0F0D]">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_3px)]" />
        <motion.div
          className="pointer-events-none absolute top-0 h-full w-40 bg-gradient-to-r from-transparent via-[#C99A2E]/10 to-transparent motion-reduce:hidden"
          animate={{ left: ["-15%", "115%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2 md:items-center md:py-36">
          <div>
            <span className="inline-block rounded-sm border border-[#C99A2E]/40 px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-[#C99A2E]">
              PRIVACY INTELLIGENCE — DECLASSIFIED
            </span>

            <h1 className="mt-6 font-[family-name:var(--font-mono)] text-4xl font-semibold leading-[1.05] tracking-tight text-[#F1EDDD] md:text-6xl">
              Every application
              <br />
              leaves a paper trail.
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-[#B8B29A]">
              Trackly opens the file on every company you apply to — what they
              collect, how long they keep it, and how to make them delete it.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/auth/register">
                <Button className="rounded-sm bg-[#F1EDDD] px-5 py-5 text-sm font-medium text-[#0E0F0D] hover:bg-[#E7E2CE]">
                  Open your file
                </Button>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F1EDDD] hover:text-[#C99A2E]"
              >
                See how a scan works
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-10 inline-flex items-center gap-2 border border-dashed border-[#4F8A46]/60 px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.1em] text-[#8FB37E]">
              VERIFIED — no ads · no trackers · no data resale
            </p>
          </div>

          <LiveScanTerminal />
        </div>
      </section>

      {/* ======================= THE HOOK ======================= */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-mono)] text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
                Where is your application actually going?
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                Most job trackers only see the job you applied to. They
                don&apos;t see everywhere your information travels after you hit
                submit.
              </p>
              <p className="mt-4 text-gray-500">
                Trackly follows the whole trail — click a stop to see what
                happens there.
              </p>
            </div>
            <DataTrailDiagram />
          </div>

          {/* STATS */}
          <div className="mt-28 border-t border-gray-200 pt-16">
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-red-600">
              The numbers
            </p>
            <h3 className="mt-3 max-w-xl text-2xl font-medium tracking-tight text-gray-900 md:text-3xl">
              The job hunt runs on more data than you&apos;d think.
            </h3>

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
              className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4"
            >
              {STATS.map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.15em] text-red-600">
                    FIG. 0{i + 1}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                    {item.stat}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">
                    {item.copy}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <a
              href="/sources"
              className="mt-10 inline-block text-xs text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-900"
            >
              See sources
            </a>
          </div>

          {/* COLLECTED DATA */}
          <div className="mt-28 grid items-center gap-16 md:grid-cols-2">
            <div>
              <h4 className="text-2xl font-medium tracking-tight text-gray-900 md:text-3xl">
                And it doesn&apos;t stop there.
              </h4>
              <p className="mt-5 text-lg leading-relaxed text-gray-700">
                Most companies now route applications through third-party
                applicant tracking systems.
              </p>
              <p className="mt-4 leading-relaxed text-gray-500">
                Your data passes through their processors before anyone at the
                company even sees it, governed by their retention and
                data-sharing rules, not yours.
              </p>
            </div>
            <CollectedDataScanner />
          </div>
        </div>
      </section>

      {/* ======================= THAT'S WHERE TRACKLY COMES IN ======================= */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-start gap-16 md:grid-cols-2">
            <FollowUpPanel />
            <div>
              <h2 className="text-3xl font-medium tracking-tight text-gray-900 md:text-4xl">
                That&apos;s where Trackly comes in
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                Most people apply to dozens of jobs across different platforms —
                LinkedIn, company websites, referrals — and quickly lose track
                of what they&apos;ve applied to.
              </p>
              <p className="mt-4 text-gray-500">
                Instead of spreadsheets, notes, and forgotten tabs — Trackly
                gives you one place to stay in control. Try checking one off on
                the left.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= EVERYTHING IN ONE PLACE ======================= */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-medium tracking-tight text-gray-900 md:text-4xl">
              Everything in one place
            </h2>
            <p className="mt-4 text-gray-500">
              A working preview of the dashboard — try clicking around.
            </p>
          </div>

          <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <NotificationFeed />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Stay on top of every update
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Real-time alerts for follow-ups, replies, and privacy flags.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <MiniKanban />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  One board for every stage
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Click a card to move it forward through your pipeline.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <MiniScoreDial />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  See your privacy exposure
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Pick a company to see its privacy score at a glance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= HOW TRACKLY WORKS ======================= */}
      <section id="how-it-works" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-medium tracking-tight text-gray-900 md:text-4xl">
              How Trackly works
            </h2>
            <p className="mt-4 text-gray-500">
              Three steps, in order — nothing happens out of sequence.
            </p>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-8 hidden h-px border-t border-dashed border-gray-300 md:block" />
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                whileHover={{ y: -4, rotate: i % 2 === 0 ? -0.6 : 0.6 }}
                className="relative rounded-md border border-gray-200 bg-white p-6"
              >
                <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.15em] text-red-600">
                  FILE {String(i + 1).padStart(2, "0")} / 03
                </div>
                <h3 className="mt-3 font-medium text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
    </main>
  );
}
