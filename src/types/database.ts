export type JobStatus =
  | 'saved'
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export interface Company {
  id: string
  name: string
  domain: string | null
  privacy_policy_url: string | null
  created_at: string
  updated_at: string
  privacy_scan_status: string
  last_scanned_at: string
}

export interface Job {
  id: string
  user_id: string
  company_id: string | null
  job_title: string
  job_description: string | null
  job_url: string
  status: JobStatus
  applied_date: string | null
  role_type: string
  work_mode: string
  salary_min: string
  salary_max: string
  recruiter_name: string
  recruiter_email: string
  company_privacy_policy_url: string
  created_at: string
  updated_at: string
}

export interface JobWithCompany extends Job {
  company: Company | null
}