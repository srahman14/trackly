// lib/queries/dashboard.ts (new)
import { useQuery } from "@tanstack/react-query"
import { fetchDashboardSummary } from "@/lib/api/dashboard"

export const dashboardKeys = {
  summary: ["dashboard-summary"] as const,
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: fetchDashboardSummary,
    staleTime: 30_000, // dashboard doesn't need to refetch on every focus/mount
  })
}