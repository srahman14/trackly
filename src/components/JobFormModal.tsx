"use client";

import { useState, type FormEvent } from "react";
import { Dialog } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { JobStatus, JobWithCompany } from "@/types/database";
import type { CreateJobPayload } from "@/lib/api/jobs";
import { updateCompanyPrivacyUrl } from "@/lib/api/companies";
import { AddOrEditJobToast } from "./custom-toasts";

interface JobFormValues {
  job_title: string;
  job_url: string;
  job_description: string;
  status: JobStatus;
  applied_date: string;
  role_type: string;
  work_mode: string;
  salary_min: string;
  salary_max: string;
  recruiter_name: string;
  recruiter_email: string;
  company_privacy_policy_url: string;
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

const ROLE_TYPE_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "internship", label: "Internship" },
  { value: "graduate", label: "Graduate" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
];

const WORK_MODE_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
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
    role_type: initialJob?.role_type ?? "",
    work_mode: initialJob?.work_mode ?? "",
    salary_min: initialJob?.salary_min?.toString() ?? "",
    salary_max: initialJob?.salary_max?.toString() ?? "",
    recruiter_name: initialJob?.recruiter_name ?? "",
    recruiter_email: initialJob?.recruiter_email ?? "",
    // Edit mode shows the company's existing URL (if any) so it can be corrected;
    // create mode starts blank since no company exists yet.
    company_privacy_policy_url: initialJob?.company?.privacy_policy_url ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (mode === "create") {
        payload.job_url = values.job_url;
        if (values.company_privacy_policy_url) {
          payload.company_privacy_policy_url =
            values.company_privacy_policy_url;
        }
      }
      if (values.job_description)
        payload.job_description = values.job_description;
      payload.applied_date = values.applied_date || null;
      payload.role_type = values.role_type || null;
      payload.work_mode = values.work_mode || null;
      payload.salary_min = values.salary_min ? Number(values.salary_min) : null;
      payload.salary_max = values.salary_max ? Number(values.salary_max) : null;
      payload.recruiter_name = values.recruiter_name || null;
      payload.recruiter_email = values.recruiter_email || null;

      await onSubmit(payload);

      // Edit mode: privacy URL lives on the company, not the job — separate write.
      if (
        mode === "edit" &&
        initialJob?.company?.id &&
        values.company_privacy_policy_url &&
        values.company_privacy_policy_url !==
          initialJob.company.privacy_policy_url
      ) {
        await updateCompanyPrivacyUrl(
          initialJob.company.id,
          values.company_privacy_policy_url,
        );
      }

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
                  className="pointer-events-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-md border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
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

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                          Role type
                        </label>
                        <select
                          value={values.role_type}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              role_type: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                        >
                          {ROLE_TYPE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                          Work mode
                        </label>
                        <select
                          value={values.work_mode}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              work_mode: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                        >
                          {WORK_MODE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                        Salary range (optional)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min={0}
                          value={values.salary_min}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              salary_min: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          min={0}
                          value={values.salary_max}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              salary_max: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                          placeholder="Max"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                          Recruiter name
                        </label>
                        <input
                          value={values.recruiter_name}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              recruiter_name: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                          Recruiter email
                        </label>
                        <input
                          type="email"
                          value={values.recruiter_email}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              recruiter_email: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                          placeholder="jane@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
                        Privacy policy URL (optional)
                      </label>
                      <input
                        type="url"
                        value={values.company_privacy_policy_url}
                        onChange={(e) =>
                          setValues((v) => ({
                            ...v,
                            company_privacy_policy_url: e.target.value,
                          }))
                        }
                        className="w-full rounded border border-zinc-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                        placeholder="https://company.com/privacy"
                      />
                      <p className="mt-1 text-[10px] text-zinc-400">
                        Skip this and the scanner will try to find it
                        automatically.
                      </p>
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
