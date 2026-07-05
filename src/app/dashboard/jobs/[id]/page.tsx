"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { StatusStamp } from "../../../../components/StatusStamp"
import { JobFormModal } from "../../../../components/JobFormModal"
import { DeleteJobDialog } from "../../../../components/DeleteJobDialog"
import { fetchJob, updateJob, deleteJob } from "@/lib/api/jobs"
import type { CreateJobPayload } from "@/lib/api/jobs"
import type { JobWithCompany } from "@/types/database"

export default function JobDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const [job, setJob] = useState<JobWithCompany | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const result = await fetchJob(params.id)
        if (!cancelled) setJob(result)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load application")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [params.id])

  async function handleUpdate(values: Partial<CreateJobPayload>) {
    const updated = await updateJob(params.id, values)
    setJob(updated)
  }

  async function handleDelete() {
    await deleteJob(params.id)
    router.push("/jobs")
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAF7] font-mono text-zinc-900 dark:bg-[#0B0D0F] dark:text-zinc-100">
        <div className="mx-auto max-w-4xl px-6 py-10 text-sm text-zinc-500">Loading…</div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAF7] font-mono text-zinc-900 dark:bg-[#0B0D0F] dark:text-zinc-100">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="rounded border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
            {error ?? "Application not found."}
          </p>
          <Link href="/dashboard/jobs" className="mt-4 inline-block text-xs text-zinc-500 hover:underline">
            ← Back to job board
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAF7] font-mono text-zinc-900 dark:bg-[#0B0D0F] dark:text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/dashboard/jobs"
          className="mb-6 inline-flex items-center gap-1 text-xs text-zinc-500 hover:underline"
        >
          <ArrowLeft className="h-3 w-3" /> Back to job board
        </Link>

        <header className="mb-6 flex flex-col gap-4 border-b border-dashed border-zinc-300 pb-6 dark:border-zinc-800 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Application file</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{job.job_title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <StatusStamp status={job.status} />
              <span className="text-xs text-zinc-400">
                Applied {job.applied_date ?? "— not yet applied"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 rounded border border-zinc-300 px-3 py-1.5 text-xs uppercase tracking-wide text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
            <button
              onClick={() => setDeleting(true)}
              className="inline-flex items-center gap-1.5 rounded border border-rose-300 px-3 py-1.5 text-xs uppercase tracking-wide text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Job details panel */}
          <section className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">Role details</p>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-zinc-400">Job URL</dt>
                <dd className="truncate">
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {job.job_url}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-400">Notes</dt>
                <dd className="text-zinc-600 dark:text-zinc-400">
                  {job.job_description || "No notes added."}
                </dd>
              </div>
            </dl>
          </section>

          {/* Company / privacy intelligence panel — placeholder until scraping exists */}
          <section className="rounded-md border border-dashed border-zinc-300 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
            <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
              Employer file — {job.company?.name ?? "Unlinked"}
            </p>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-zinc-400">Domain</dt>
                <dd>{job.company?.domain ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-400">Privacy policy</dt>
                <dd>
                  {job.company?.privacy_policy_url ? (
                    <a
                      href={job.company.privacy_policy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {job.company.privacy_policy_url}
                    </a>
                  ) : (
                    <span className="inline-flex items-center rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
                      Pending analysis
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-400">Retention &amp; erasure</dt>
                <dd className="text-xs text-zinc-400">
                  Not yet scraped — this section populates once the privacy intelligence
                  pipeline processes this employer.
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {editing && (
        <JobFormModal
          mode="edit"
          initialJob={job}
          onClose={() => setEditing(false)}
          onSubmit={async (values) => {
            await handleUpdate(values)
            setEditing(false)
          }}
        />
      )}

      {deleting && (
        <DeleteJobDialog
          jobTitle={job.job_title}
          onCancel={() => setDeleting(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
