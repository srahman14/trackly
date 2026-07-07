"use client";

import { useCallback, useEffect, useState } from "react";
import { JobsMetrics } from "../../../components/JobsMetrics";
import { FilterBar } from "../../../components/FilterBar";
import { JobsTable } from "../../../components/JobsTable";
import { PaginationControls } from "../../../components/Pagination";
import { JobFormModal } from "../../../components/JobFormModal";
import { DeleteJobDialog } from "../../../components/DeleteJobDialog";
import { fetchJobs, createJob, updateJob, deleteJob } from "@/lib/api/jobs";
import type { CreateJobPayload, Pagination } from "@/lib/api/jobs";
import type { JobStatus, JobWithCompany } from "@/types/database";
import { Button } from "@/components/ui/button";
import { DeleteToast } from "@/components/custom-toasts";

const PAGE_SIZE = 10;

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [status, setStatus] = useState<JobStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeJob, setActiveJob] = useState<JobWithCompany | undefined>(
    undefined,
  );
  const [pendingDelete, setPendingDelete] = useState<JobWithCompany | null>(
    null,
  );

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchJobs({
        status: status === "all" ? undefined : status,
        page,
        limit: PAGE_SIZE,
      });
      setJobs(result.jobs);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications",
      );
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  function handleStatusChange(next: JobStatus | "all") {
    setStatus(next);
    setPage(1);
  }

  function openCreateModal() {
    setActiveJob(undefined);
    setModalMode("create");
  }

  function openEditModal(job: JobWithCompany) {
    setActiveJob(job);
    setModalMode("edit");
  }

  async function handleFormSubmit(values: Partial<CreateJobPayload>) {
    if (modalMode === "create") {
      await createJob(values as CreateJobPayload);
    } else if (modalMode === "edit" && activeJob) {
      await updateJob(activeJob.id, values);
    }
    setModalMode(null);
    setRefreshKey((k) => k + 1);
    await loadJobs();
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    await deleteJob(pendingDelete.id);
    setPendingDelete(null);
    setRefreshKey((k) => k + 1);
    await loadJobs();
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAF7] font-mono text-zinc-900 dark:bg-[#0B0D0F] dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8 flex flex-col gap-4 border-b border-dashed border-zinc-300 pb-6 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Applications
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Job Board
            </h1>
          </div>
        </header>

        <JobsMetrics refreshKey={refreshKey} />

        <FilterBar
          status={status}
          onStatusChange={handleStatusChange}
          onNewApplication={openCreateModal}
        />

        {error && (
          <p className="mb-4 rounded border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
            {error}
          </p>
        )}

        {loading ? (
          <div className="rounded-md border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
            Loading applications…
          </div>
        ) : (
          <>
            <JobsTable
              jobs={jobs}
              onEdit={openEditModal}
              onDelete={setPendingDelete}
            />
            <PaginationControls
              pagination={pagination}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {modalMode && (
        <JobFormModal
          mode={modalMode}
          initialJob={activeJob}
          onClose={() => setModalMode(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {pendingDelete && (
        <DeleteJobDialog
          jobTitle={pendingDelete.job_title}
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <Button onClick={() => DeleteToast("test")}>Click me</Button>
    </div>
  );
}
