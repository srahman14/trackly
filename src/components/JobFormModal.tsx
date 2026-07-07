"use client";

import { useState, type FormEvent } from "react";
import { Dialog } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { JobStatus, JobWithCompany } from "@/types/database";
import type { CreateJobPayload } from "@/lib/api/jobs";
import { AddOrEditJobToast } from "./custom-toasts";

interface JobFormValues {
  job_title: string;
  job_url: string;
  job_description: string;
  status: JobStatus;
  applied_date: string;
}

interface JobFormModalProps {
  mode: "create" | "edit";
  initialJob?: JobWithCompany;
  onClose: () => void;
  onSubmit: (values: Partial<CreateJobPayload>) => Promise<void>;
}

const STATUS_OPTIONS: JobStatus[] = [
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
];

export function JobFormModal({
  mode,
  initialJob,
  onClose,
  onSubmit,
}: JobFormModalProps) {
  const [values, setValues] = useState<JobFormValues>({
    job_title: initialJob?.job_title ?? "",
    job_url: initialJob?.job_url ?? "",
    job_description: initialJob?.job_description ?? "",
    status: initialJob?.status ?? "saved",
    applied_date: initialJob?.applied_date ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Drives the exit animation. The parent only unmounts this component
  // (via onClose) once AnimatePresence has finished the exit transition.
  const [isOpen, setIsOpen] = useState(true);

  function requestClose() {
    if (submitting) return;
    setIsOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload: Partial<CreateJobPayload> = {
        job_title: values.job_title,
        status: values.status,
      };
      // job_url only sent on create — company resolution happens once, at creation
      if (mode === "create") payload.job_url = values.job_url;
      if (values.job_description)
        payload.job_description = values.job_description;
      payload.applied_date = values.applied_date || null;

      await onSubmit(payload);
      AddOrEditJobToast(mode, values.job_title);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) requestClose();
      }}
    >
      <AnimatePresence onExitComplete={onClose}>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              />
            </Dialog.Overlay>

            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
              <Dialog.Content asChild forceMount onEscapeKeyDown={requestClose}>
                <motion.div
                  className="pointer-events-auto w-full max-w-lg rounded-md border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-4 flex items-center justify-between border-b border-dashed border-zinc-300 pb-3 dark:border-zinc-800">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                        {mode === "create" ? "New Entry" : "Edit Entry"}
                      </p>
                      <Dialog.Title asChild>
                        <h2 className="mt-1 text-lg font-semibold">
                          {mode === "create"
                            ? "Log an application"
                            : "Update application"}
                        </h2>
                      </Dialog.Title>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        aria-label="Close"
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                        Job title
                      </label>
                      <input
                        required
                        value={values.job_title}
                        onChange={(e) =>
                          setValues((v) => ({
                            ...v,
                            job_title: e.target.value,
                          }))
                        }
                        className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                        placeholder="Senior Backend Engineer"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                        Job URL
                      </label>
                      <input
                        required
                        type="url"
                        value={values.job_url}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, job_url: e.target.value }))
                        }
                        disabled={mode === "edit"}
                        className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:disabled:bg-zinc-800"
                        placeholder="https://stripe.com/jobs/listing/123"
                      />
                      {mode === "edit" && (
                        <p className="mt-1 text-[10px] text-zinc-400">
                          Locked after creation — this is what determines the
                          linked employer.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                          Status
                        </label>
                        <select
                          value={values.status}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              status: e.target.value as JobStatus,
                            }))
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                          Applied date
                        </label>
                        <input
                          type="date"
                          value={values.applied_date}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              applied_date: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                        Notes (optional)
                      </label>
                      <textarea
                        value={values.job_description}
                        onChange={(e) =>
                          setValues((v) => ({
                            ...v,
                            job_description: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                        placeholder="Role notes, referral contact, etc."
                      />
                    </div>

                    {error && (
                      <p className="rounded border border-rose-300 bg-rose-50 px-2 py-1.5 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
                        {error}
                      </p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={requestClose}
                        className="rounded border border-zinc-300 px-3 py-1.5 text-xs uppercase tracking-wide text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs uppercase tracking-wide text-white hover:bg-zinc-700 disabled:opacity-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                      >
                        {submitting
                          ? "Saving…"
                          : mode === "create"
                            ? "Save entry"
                            : "Save changes"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
