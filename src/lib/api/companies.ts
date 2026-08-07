interface PrivacyEntity {
  id: string;
  dpo_email: string | null;
  contact_email: string | null;
  retention_period: string | null;
  data_request_url: string | null;
  shares_with_third_parties: boolean | null;
  uses_ai_screening: boolean | null;
  privacy_score: number | null;
  summary: string | null;
  created_at: string;
}

interface PrivacySummary {
  document: { id: string; source_url: string; scraped_at: string };
  entity: PrivacyEntity | null;
}

async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? 'Request failed');
  return json.data as T;
}

export async function updateCompanyPrivacyUrl(companyId: string, privacyPolicyUrl: string) {
  const res = await fetch(`/api/companies/${companyId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ privacy_policy_url: privacyPolicyUrl }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? 'Failed to update company');
  return json.data;
}

export async function fetchCompanyPrivacySummary(companyId: string): Promise<PrivacySummary | null> {
  const res = await fetch(`/api/companies/${companyId}/privacy-summary`);
  return unwrap<PrivacySummary | null>(res);
}

export async function triggerCompanyAnalysis(companyId: string, jobId: string) {
  const res = await fetch(`/api/companies/${companyId}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  });
  return unwrap(res);
}