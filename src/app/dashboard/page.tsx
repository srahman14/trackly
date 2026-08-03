"use client"

import { ApplicationsChart } from "@/components/applications-chart"
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  FileText,
  Gauge,
  Plus,
  Search,
  Send,
  XCircle,
} from "lucide-react"
import { useEffect, useState } from "react"

// --- Mock data — swap for real queries once the DB layer is wired up ---
const metrics = [
  {
    label: "Applications Applied",
    value: 24,
    delta: "+4",
    trend: "up",
    ref: "TRK-APP",
    icon: FileText,
    accent: "blue",
  },
  {
    label: "Rejections Logged",
    value: 9,
    delta: "+2",
    trend: "up",
    ref: "TRK-REJ",
    icon: XCircle,
    accent: "zinc",
  },
  {
    label: "Erasure Requests Sent",
    value: 6,
    delta: "Art. 17",
    trend: "flat",
    ref: "TRK-ERS",
    icon: Send,
    accent: "emerald",
  },
  {
    label: "Avg. Privacy Score",
    value: "72/100",
    delta: "+3",
    trend: "up",
    ref: "TRK-SCR",
    icon: Gauge,
    accent: "amber",
  },
]

const retentionWatch = [
  { company: "Nordholt & Vance", appliedAgo: "6 months ago", status: "likely retained" },
  { company: "Fenwick Digital", appliedAgo: "5 months ago", status: "likely retained" },
  { company: "Cobalt Systems", appliedAgo: "4 months ago", status: "erasure sent" },
]

const activityLog = [
  { time: "09:41", action: "Erasure request drafted", target: "Cobalt Systems" },
  { time: "09:12", action: "Privacy policy scanned", target: "Halberd Robotics" },
  { time: "yesterday", action: "Application logged", target: "Meridian Health" },
  { time: "yesterday", action: "Status changed to Rejected", target: "Nordholt & Vance" },
]

const accentClasses: Record<string, string> = {
  blue: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900",
  zinc: "text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800",
  emerald:
    "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900",
  amber:
    "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900",
}

function useUtcClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function DashboardPage() {
  const now = useUtcClock()
  const stamp = now ? now.toISOString().replace("T", " ").slice(0, 19) + " UTC" : "—"

  return (
    <div className="min-h-screen w-full bg-[#FAFAF7] font-mono text-zinc-900 dark:bg-[#0B0D0F] dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-dashed border-zinc-300 pb-6 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Overview
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{stamp}</span>
          </div>
        </header>

        {/* Metrics */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.label}
                className="relative overflow-hidden rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${accentClasses[m.accent]}`}
                  >
                    <Icon className="h-3 w-3" />
                    {m.ref}
                  </span>
                  {m.trend === "up" && (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {m.trend === "flat" && <span className="text-[10px] text-zinc-400">—</span>}
                </div>
                <p className="text-2xl font-semibold tabular-nums">{m.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{m.label}</p>
                <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-600">
                  {m.delta} vs. last month
                </p>
              </div>
            )
          })}
        </section>

        {/* Graph + Quick Actions */}
        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between border-b border-dashed border-zinc-200 pb-3 dark:border-zinc-800">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Exhibit A</p>
                <h2 className="text-sm font-semibold">Applications This Month</h2>
              </div>
              <span className="rounded border border-zinc-300 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:border-zinc-700">
                monthly
              </span>
            </div>
            <div className="h-56">
              <ApplicationsChart />
            </div>
          </div>

          <div className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Quick Actions</p>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                <Plus className="h-3.5 w-3.5" /> Log new application
              </button>
              <button className="flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                <Search className="h-3.5 w-3.5" /> Scan privacy policy
              </button>
              <button className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-sm text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/70">
                <Send className="h-3.5 w-3.5" /> Draft erasure request (Art. 17)
              </button>
              <button className="flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                <FileText className="h-3.5 w-3.5" /> Request data access (Art. 15)
              </button>
            </div>
          </div>
        </section>

        {/* Retention watch + activity log */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Retention Watch</p>
            </div>
            <ul className="flex flex-col gap-2">
              {retentionWatch.map((r) => (
                <li
                  key={r.company}
                  className="flex items-center justify-between rounded border border-amber-200/70 bg-white px-3 py-2 text-xs dark:border-amber-900/60 dark:bg-zinc-950"
                >
                  <div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">{r.company}</p>
                    <p className="text-zinc-500">Applied {r.appliedAgo}</p>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${
                      r.status === "erasure sent"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400"
                    }`}
                  >
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Processing Log</p>
            <ul className="flex flex-col divide-y divide-dashed divide-zinc-200 dark:divide-zinc-800">
              {activityLog.map((a, i) => (
                <li key={i} className="flex items-center justify-between py-2 text-xs">
                  <span className="text-zinc-400 dark:text-zinc-600">{a.time}</span>
                  <span className="flex-1 px-3 text-zinc-700 dark:text-zinc-300">{a.action}</span>
                  <span className="text-zinc-500">{a.target}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}