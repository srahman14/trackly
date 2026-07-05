import type { JobStatus } from "@/types/database"

const STATUS_LABEL: Record<JobStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
}

const STATUS_STYLE: Record<JobStatus, string> = {
  saved:
    "border-zinc-300 text-zinc-600 bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:bg-zinc-900",
  applied:
    "border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950",
  interviewing:
    "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-950",
  offer:
    "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-950",
  rejected:
    "border-rose-300 text-rose-700 bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:bg-rose-950",
  withdrawn:
    "border-zinc-300 text-zinc-400 bg-zinc-50 line-through dark:border-zinc-700 dark:text-zinc-600 dark:bg-zinc-900",
}

export function StatusStamp({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
