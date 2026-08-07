// zod schema for job
// createJobSchema, updateJobSchema
// query schema for list filters (status, page, limit, maybe sort)

import { z } from "zod";

export const jobStatusEnum = z.enum([
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
]);

export const createJobSchema = z.object({
  job_title: z.string().min(1),
  job_url: z.string().url(),
  job_description: z.string().optional(),
  status: z.enum(['saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn']).default('saved'),
  applied_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  role_type: z.enum(['internship', 'graduate', 'full_time', 'part_time', 'contract']).nullable().optional(),
  work_mode: z.enum(['remote', 'hybrid', 'onsite']).nullable().optional(),
  salary_min: z.number().int().positive().nullable().optional(),
  salary_max: z.number().int().positive().nullable().optional(),
  recruiter_name: z.string().nullable().optional(),
  recruiter_email: z.string().email().nullable().optional(),
  // Not a jobs column — passed through to company resolution at creation only.
  company_privacy_policy_url: z.string().url().nullable().optional(),
});

export const updateJobSchema = createJobSchema.omit({ company_privacy_policy_url: true }).partial();

export const jobListQuerySchema = z.object({
  status: jobStatusEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z
    .enum(["created_at", "applied_date", "job_title"])
    .default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobListQuery = z.infer<typeof jobListQuerySchema>;
