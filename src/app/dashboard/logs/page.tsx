// src/app/scan-logs/page.tsx (new)
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchScanLogs, type ScanLog } from "@/lib/api/scanLogs";

const STATUS_STYLE: Record<ScanLog["status"], string> = {
  success: "text-emerald-400",
  cached: "text-zinc-500",
  unchanged: "text-zinc-500",
  not_found: "text-amber-400",
  error: "text-rose-400",
};

const STATUS_LABEL: Record<ScanLog["status"], string> = {
  success: "OK",
  cached: "CACHED",
  unchanged: "UNCHANGED",
  not_found: "NOT FOUND",
  error: "ERROR",
};

export default function ScanLogsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["scan-logs"],
    queryFn: () => fetchScanLogs(),
    // Poll while anything is actively scanning; back off to a slower
    // interval once nothing's in progress, rather than hammering the
    // endpoint indefinitely on an idle page.
    refetchInterval: (query) =>
      query.state.data?.activeScans.length ? 2000 : 15000,
  });

  return (
    <div className="min-h-screen w-full bg-[#0B0D0F] font-mono text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Privacy intelligence
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Scan logs
        </h1>

        {isLoading && <p className="mt-6 text-sm text-zinc-500">Loading…</p>}
        {error && (
          <p className="mt-6 text-sm text-rose-400">
            {error instanceof Error
              ? error.message
              : "Failed to load scan logs."}
          </p>
        )}

        {data && (
          <>
            {/* Active scans */}
            {data.activeScans.length > 0 && (
              <section className="mt-6 rounded border border-zinc-800 bg-zinc-950 p-4">
                <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
                  In progress ({data.activeScans.length})
                </p>
                <ul className="space-y-1 text-sm">
                  {data.activeScans.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center gap-2 text-amber-300"
                    >
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                      {c.name} <span className="text-zinc-500">{c.domain}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Log stream */}
            <section className="mt-6 rounded border border-zinc-800 bg-black">
              <div className="max-h-[70vh] overflow-y-auto">
                {data.logs.length === 0 && (
                  <p className="p-4 text-sm text-zinc-600">
                    No scans recorded yet.
                  </p>
                )}
                {data.logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 border-b border-zinc-900 px-4 py-2 text-xs leading-relaxed hover:bg-zinc-950"
                  >
                    <span className="shrink-0 text-zinc-600">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                    <span
                      className={`shrink-0 font-semibold ${STATUS_STYLE[log.status]}`}
                    >
                      [{STATUS_LABEL[log.status]}]
                    </span>
                    <span className="shrink-0 text-zinc-500">{log.stage}</span>
                    <span className="shrink-0 text-zinc-300">
                      {log.companies.name}
                    </span>
                    <span className="shrink-0 rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] uppercase text-zinc-500">
                      {log.triggered_by.replace("_", " ")}
                    </span>
                    {log.reason && (
                      <span className="truncate text-zinc-600">
                        {log.reason}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <p className="mt-3 text-xs text-zinc-600">
              {data.pagination.total} total log entries
            </p>
          </>
        )}
      </div>
    </div>
  );
}
