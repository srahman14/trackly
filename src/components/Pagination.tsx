"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Pagination } from "@/lib/api/jobs"

interface PaginationControlsProps {
  pagination: Pagination
  onPageChange: (page: number) => void
}

export function PaginationControls({ pagination, onPageChange }: PaginationControlsProps) {
  const { page, totalPages, total } = pagination
  if (total === 0) return null

  return (
    <div className="mt-4 flex items-center justify-between border-t border-dashed border-zinc-300 pt-3 text-xs text-zinc-500 dark:border-zinc-800">
      <span>
        Page {page} of {Math.max(totalPages, 1)} — {total} total
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded border border-zinc-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700"
        >
          <ChevronLeft className="h-3 w-3" /> Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded border border-zinc-300 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700"
        >
          Next <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
