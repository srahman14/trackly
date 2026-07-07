"use client";

import { Dialog } from "radix-ui";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteToast } from "./custom-toasts";

interface DeleteJobDialogProps {
  jobTitle: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteJobDialog({
  jobTitle,
  onCancel,
  onConfirm,
}: DeleteJobDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  function requestClose() {
    if (!deleting) setIsOpen(false);
  }

  async function handleConfirm() {
    setDeleting(true);
    setError(null);
    DeleteToast(jobTitle);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) requestClose();
      }}
    >
      <AnimatePresence onExitComplete={onCancel}>
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
                  className="pointer-events-auto w-full max-w-sm rounded-md border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Dialog.Title asChild>
                    <p className="text-xs uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">
                      Confirm deletion
                    </p>
                  </Dialog.Title>

                  <h2 className="mt-1 text-lg font-semibold">
                    Remove this entry?
                  </h2>

                  <Dialog.Description asChild>
                    <p className="mt-2 text-sm text-zinc-500">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        {jobTitle}
                      </span>{" "}
                      will be permanently removed. This cannot be undone.
                    </p>
                  </Dialog.Description>

                  {error && (
                    <p className="mt-3 rounded border border-rose-300 bg-rose-50 px-2 py-1.5 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400">
                      {error}
                    </p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={requestClose}
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
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
