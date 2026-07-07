"use client";

import { useEffect, useState } from "react";
import { Briefcase, Send, MessagesSquare, Award } from "lucide-react";
import { fetchJobs } from "@/lib/api/jobs";

interface MetricsState {
  total: number;
  applied: number;
  interviewing: number;
  offer: number;
}

const METRIC_CONFIG = [
  {
    key: "total",
    label: "Total applications",
    ref: "ALL-JOBS",
    icon: Briefcase,
    accent: "zinc",
  },
  {
    key: "applied",
    label: "Applied",
    ref: "Applied",
    icon: Send,
    accent: "blue",
  },
  {
    key: "interviewing",
    label: "Interviewing",
    ref: "Interviewing",
    icon: MessagesSquare,
    accent: "amber",
  },
  {
    key: "offer",
    label: "Offers",
    ref: "Offers",
    icon: Award,
    accent: "emerald",
  },
] as const;

const ACCENT_CLASSES: Record<string, string> = {
  zinc: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
  blue: "border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-400",
  amber:
    "border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400",
  emerald:
    "border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400",
};

// Reuses GET /api/jobs with limit=1 per status — Postgres reports the exact
// count of matching rows independent of the range applied, so this is cheap
// and avoids needing a dedicated aggregates endpoint just for the dashboard.
export function JobsMetrics({ refreshKey }: { refreshKey: number }) {
  const [metrics, setMetrics] = useState<MetricsState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [total, applied, interviewing, offer] = await Promise.all([
          fetchJobs({ limit: 1 }),
          fetchJobs({ status: "applied", limit: 1 }),
          fetchJobs({ status: "interviewing", limit: 1 }),
          fetchJobs({ status: "offer", limit: 1 }),
        ]);

        if (cancelled) return;
        setMetrics({
          total: total.pagination.total,
          applied: applied.pagination.total,
          interviewing: interviewing.pagination.total,
          offer: offer.pagination.total,
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load metrics",
          );
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {METRIC_CONFIG.map((m) => {
        const Icon = m.icon;
        const value = metrics ? metrics[m.key as keyof MetricsState] : null;

        return (
          <div
            key={m.key}
            className="relative overflow-hidden rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${ACCENT_CLASSES[m.accent]}`}
              >
                <Icon className="h-3 w-3" />
                {m.ref}
              </span>
            </div>
            <p className="text-2xl font-semibold tabular-nums">
              {error ? "—" : value === null ? "···" : value}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{m.label}</p>
          </div>
        );
      })}
    </section>
  );
}
