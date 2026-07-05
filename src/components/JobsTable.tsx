"use client"

import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { StatusStamp } from "./StatusStamp"
import type { JobWithCompany } from "@/types/database"

interface JobsTableProps {
  jobs: JobWithCompany[]
  onEdit: (job: JobWithCompany) => void
  onDelete: (job: JobWithCompany) => void
}

export function JobsTable({ jobs, onEdit, onDelete }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        No applications on file yet. Start by logging your first one.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <table className="w-full table-auto md:table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-dashed border-zinc-300 text-[10px] uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
            <th className="px-4 py-2 font-medium">Role</th>
            <th className="px-4 py-2 font-medium">Company</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">Applied</th>
            <th className="px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-b border-dashed border-zinc-200 last:border-0 hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-zinc-900/50"
            >
              <td className="px-4 py-3">
                <Link href={`/dashboard/jobs/${job.id}`} className="font-medium hover:underline">
                  {job.job_title}
                </Link>
                <p className="mt-0.5 max-w-xs truncate text-xs text-zinc-400">{job.job_url}</p>
              </td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {job.company?.name ?? "—"}
              </td>
              <td className="px-4 py-3">
                <StatusStamp status={job.status} />
              </td>
              <td className="px-4 py-3 text-zinc-500">{job.applied_date ?? "—"}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(job)}
                    aria-label="Edit application"
                    className="rounded border border-zinc-300 p-1.5 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(job)}
                    aria-label="Delete application"
                    className="rounded border border-zinc-300 p-1.5 text-rose-600 hover:bg-rose-50 dark:border-zinc-700 dark:text-rose-400 dark:hover:bg-rose-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
