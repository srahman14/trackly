"use client"

import type { JobStatus } from "@/types/database"

const STATUS_OPTIONS: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
]

interface FilterBarProps {
  status: JobStatus | "all"
  onStatusChange: (status: JobStatus | "all") => void
  onNewApplication: () => void
}

export function FilterBar({ status, onStatusChange, onNewApplication }: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <label htmlFor="status-filter" className="text-xs uppercase tracking-wide text-zinc-500">
          Filter
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as JobStatus | "all")}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onNewApplication}
        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white transition hover:bg-zinc-700 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        + New Application
      </button>
    </div>
  )
}
