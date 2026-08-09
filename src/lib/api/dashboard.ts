// lib/api/dashboard.ts (new)
export interface DashboardMetrics {
  applicationsApplied: number;
  applicationsAppliedDelta: number;
  rejectionsLogged: number;
  rejectionsLoggedDelta: number;
  erasureRequestsSent: number;
  avgPrivacyScore: number | null;
}

export interface WeeklyApplicationCount {
  period: string;
  applications: number;
}

export interface DashboardSummary {
  metrics: DashboardMetrics;
  weeklyApplications: WeeklyApplicationCount[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch('/api/dashboard/summary');
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? 'Failed to load dashboard summary');
  return json.data;
}