// zod schema for company
// minimal - name, domain optional on manual creation path

import { z } from 'zod'

export const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  privacy_policy_url: z.string().url().optional().nullable(),
})

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>