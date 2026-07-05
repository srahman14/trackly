"use client"

import { useState } from "react"

interface DeleteJobDialogProps {
  jobTitle: string
  onCancel: () => void
  onConfirm: () => Promise<void>
}

export function DeleteJobDialog({ jobTitle, onCancel, onConfirm }: DeleteJobDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setDeleting(true)
    setError(null)
    try {
      await onConfirm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-md border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">
          Confirm deletion
        </p>
        <h2 className="mt-1 text-lg font-semibold">Remove this entry?</h2>
        <p className="mt-2 text-sm text-zinc-500">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{jobTitle}</span> will be
          permanently removed. This cannot be undone.
        </p>

        {error && (
          <p className="mt-3 rounded border border-rose-300 bg-rose-50 px-2 py-1.5 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="rounded border border-zinc-300 px-3 py-1.5 text-xs uppercase tracking-wide text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="rounded border border-rose-600 bg-rose-600 px-3 py-1.5 text-xs uppercase tracking-wide text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {deleting ? "Removing…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}
