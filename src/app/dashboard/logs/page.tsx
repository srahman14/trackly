"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchScanLogs, type CompanyScanSummary } from "@/lib/api/scanLogs";

const STATUS_COLORS = {
  success: "#34d399",
  not_found: "#fbbf24",
  error: "#fb7185",
};

const SCAN_STATUS_STYLE: Record<string, string> = {
  found: "border-emerald-800 bg-emerald-950 text-emerald-400",
  not_found: "border-amber-800 bg-amber-950 text-amber-400",
  error: "border-rose-800 bg-rose-950 text-rose-400",
  scanning: "border-blue-800 bg-blue-950 text-blue-400",
  not_scanned: "border-zinc-800 bg-zinc-900 text-zinc-500",
};

export default function ScanLogsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["scan-logs-summary"],
    queryFn: () => fetchScanLogs(),
    refetchInterval: 15000, 
  })

  const chartData = useMemo(() => {
    if (!data?.summaries) return [];
    const totals = data.summaries.reduce(
      (acc, s) => {
        acc.success += s.success_count;
        acc.not_found += s.not_found_count;
        acc.error += s.error_count;
        return acc;
      },
      { success: 0, not_found: 0, error: 0 },
    );
    return [
      { name: "Success", value: totals.success, color: STATUS_COLORS.success },
      {
        name: "Not found",
        value: totals.not_found,
        color: STATUS_COLORS.not_found,
      },
      { name: "Error", value: totals.error, color: STATUS_COLORS.error },
    ].filter((d) => d.value > 0);
  }, [data]);

  return (
    <div className="min-h-screen w-full bg-[#FAFAF7] font-mono text-zinc-900 dark:bg-[#0B0D0F] dark:text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Privacy intelligence
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Scan overview
        </h1>

        {isLoading && <p className="mt-6 text-sm text-zinc-500">Loading…</p>}
        {error && (
          <p className="mt-6 text-sm text-rose-500">
            {error instanceof Error
              ? error.message
              : "Failed to load scan data."}
          </p>
        )}

        {data && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            {/* Chart */}
            <section className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
                Scan outcomes (
                {data.summaries.reduce((n, s) => n + s.total_scan_logs, 0)}{" "}
                total)
              </p>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={70}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontSize: 12, fontFamily: "monospace" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-8 text-center text-xs text-zinc-400">
                  No scans yet.
                </p>
              )}
            </section>

            {/* Company cards */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.summaries.map((s) => (
                <CompanyScanCard key={s.company_id} summary={s} />
              ))}
              {data.summaries.length === 0 && (
                <p className="text-sm text-zinc-500">
                  No companies scanned yet.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function CompanyScanCard({ summary }: { summary: CompanyScanSummary }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-medium">{summary.name}</p>
        <span
          className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${
            SCAN_STATUS_STYLE[summary.privacy_scan_status] ??
            SCAN_STATUS_STYLE.not_scanned
          }`}
        >
          {summary.privacy_scan_status.replace("_", " ")}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-zinc-400">{summary.domain ?? "—"}</p>

      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
        {summary.privacy_score !== null && (
          <span>
            Score{" "}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {summary.privacy_score}
            </span>
          </span>
        )}
        <span className="text-emerald-500">{summary.success_count} ok</span>
        {summary.error_count > 0 && (
          <span className="text-rose-500">{summary.error_count} err</span>
        )}
        {summary.not_found_count > 0 && (
          <span className="text-amber-500">{summary.not_found_count} miss</span>
        )}
      </div>

      {summary.last_log_at && (
        <p className="mt-2 text-[10px] text-zinc-400">
          Last scan {new Date(summary.last_log_at).toLocaleString()}
        </p>
      )}
    </div>
  );
}
