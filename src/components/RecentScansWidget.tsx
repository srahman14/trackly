// src/components/RecentScansWidget.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchScanLogs, type RecentScanLog } from "@/lib/api/scanLogs";

const STATUS_DOT: Record<RecentScanLog["status"], string> = {
  success: "bg-emerald-400",
  cached: "bg-zinc-400",
  unchanged: "bg-zinc-400",
  not_found: "bg-amber-400",
  error: "bg-rose-400",
};

export function RecentScansWidget() {
  const { data } = useQuery({
    queryKey: ["scan-logs-summary"],
    queryFn: () => fetchScanLogs(),
    refetchInterval: 15000,
  });

  const recentLogs = data?.recentLogs ?? [];

  if (recentLogs.length === 0) {
    return <p className="text-xs text-zinc-400">No scans yet.</p>;
  }

  return (
    <ul className="space-y-2 text-xs">
      {recentLogs.map((log) => (
        <li key={log.id} className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[log.status]}`}
          />
          <span className="truncate text-zinc-700 dark:text-zinc-300">
            {log.companies.name}
          </span>
          <span className="shrink-0 text-zinc-400">{log.stage}</span>
          <span className="ml-auto shrink-0 text-zinc-400">
            {new Date(log.created_at).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
