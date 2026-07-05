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
  job_title: z.string().min(1).max(255),
  job_description: z.string().optional(),
  job_url: z.string().url(),
  status: jobStatusEnum.optional().default("saved"),
  applied_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD")
    .optional()
    .nullable(),
});

export const updateJobSchema = createJobSchema.partial();

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
