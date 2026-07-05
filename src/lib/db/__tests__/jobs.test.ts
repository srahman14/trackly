import { createJob, listJobs, getJobById, updateJob, deleteJob } from '../jobs'
import { findOrCreateCompanyByUrl } from '../companies'
import { buildChain, buildAwaitableChain } from '@/lib/test-utils/supabase-mock'
import type { Company, Job } from '@/types/database'

jest.mock('../companies', () => ({
  findOrCreateCompanyByUrl: jest.fn(),
}))

const mockFindOrCreateCompany = findOrCreateCompanyByUrl as jest.Mock

const mockCompany: Company = {
  id: 'company-1',
  name: 'Stripe',
  domain: 'stripe.com',
  privacy_policy_url: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
}

const mockJob = (overrides: Partial<Job> = {}): Job => ({
  id: 'job-1',
  user_id: 'user-1',
  company_id: 'company-1',
  job_title: 'Senior Backend Engineer',
  job_description: null,
  job_url: 'https://stripe.com/jobs/listing/123',
  status: 'saved',
  applied_date: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('createJob', () => {
  it('resolves the company from job_url, then inserts the job linked to it', async () => {
    mockFindOrCreateCompany.mockResolvedValue(mockCompany)
    const job = { ...mockJob(), company: mockCompany }
    const chain = buildChain('single', { data: job, error: null })
    const supabase = { from: jest.fn(() => chain) } as any

    const result = await createJob(supabase, 'user-1', {
      job_title: 'Senior Backend Engineer',
      job_url: 'https://stripe.com/jobs/listing/123',
      status: 'saved',
    } as any)

    expect(mockFindOrCreateCompany).toHaveBeenCalledWith(supabase, 'https://stripe.com/jobs/listing/123')
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', company_id: 'company-1', status: 'saved' })
    )
    expect(result).toEqual(job)
  })

  it('throws a 500 ApiError when the insert fails', async () => {
    mockFindOrCreateCompany.mockResolvedValue(mockCompany)
    const chain = buildChain('single', { data: null, error: { message: 'insert failed' } })
    const supabase = { from: jest.fn(() => chain) } as any

    await expect(
      createJob(supabase, 'user-1', {
        job_title: 'Role',
        job_url: 'https://stripe.com/jobs/1',
      } as any)
    ).rejects.toMatchObject({ status: 500 })
  })
})

describe('listJobs', () => {
  it('scopes the query to the user and returns pagination metadata', async () => {
    const jobs = [mockJob({ id: 'job-1' }), mockJob({ id: 'job-2' })]
    const chain = buildAwaitableChain({ data: jobs, error: null, count: 5 })
    const supabase = { from: jest.fn(() => chain) } as any

    const result = await listJobs(supabase, 'user-1', {
      page: 1,
      limit: 2,
      sort: 'created_at',
      order: 'desc',
    } as any)

    expect(chain.eq).toHaveBeenCalledWith('user_id', 'user-1')
    expect(chain.range).toHaveBeenCalledWith(0, 1)
    expect(result.jobs).toEqual(jobs)
    expect(result.pagination).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 })
  })

  it('applies a status filter when provided', async () => {
    const chain = buildAwaitableChain({ data: [], error: null, count: 0 })
    const supabase = { from: jest.fn(() => chain) } as any

    await listJobs(supabase, 'user-1', {
      status: 'applied',
      page: 1,
      limit: 20,
      sort: 'created_at',
      order: 'desc',
    } as any)

    expect(chain.eq).toHaveBeenCalledWith('status', 'applied')
  })

  it('throws a 500 ApiError when the query fails', async () => {
    const chain = buildAwaitableChain({ data: null, error: { message: 'timeout' }, count: undefined })
    const supabase = { from: jest.fn(() => chain) } as any

    await expect(
      listJobs(supabase, 'user-1', { page: 1, limit: 20, sort: 'created_at', order: 'desc' } as any)
    ).rejects.toMatchObject({ status: 500 })
  })
})

describe('getJobById', () => {
  it('returns the job when found and owned by the user', async () => {
    const job = mockJob()
    const chain = buildChain('maybeSingle', { data: job, error: null })
    const supabase = { from: jest.fn(() => chain) } as any

    const result = await getJobById(supabase, 'user-1', 'job-1')

    expect(chain.eq).toHaveBeenCalledWith('id', 'job-1')
    expect(result).toEqual(job)
  })

  it('throws a 404 ApiError when the job does not exist (or belongs to another user)', async () => {
    const chain = buildChain('maybeSingle', { data: null, error: null })
    const supabase = { from: jest.fn(() => chain) } as any

    await expect(getJobById(supabase, 'user-1', 'missing')).rejects.toMatchObject({ status: 404 })
  })
})

describe('updateJob', () => {
  it('applies only the provided fields (partial update)', async () => {
    const existing = mockJob()
    const updated = { ...existing, status: 'interviewing' }
    const selectChain = buildChain('maybeSingle', { data: existing, error: null })
    const updateChain = buildChain('single', { data: updated, error: null })

    const supabase = {
      from: jest.fn().mockReturnValueOnce(selectChain).mockReturnValueOnce(updateChain),
    } as any

    const result = await updateJob(supabase, 'user-1', 'job-1', { status: 'interviewing' })

    expect(updateChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'interviewing' })
    )
    // fields not included in the patch should not appear in the update payload
    expect(updateChain.update).not.toHaveBeenCalledWith(
      expect.objectContaining({ job_title: expect.anything() })
    )
    expect(result).toEqual(updated)
  })

  it('throws a 404 before attempting the update if the job does not exist', async () => {
    const selectChain = buildChain('maybeSingle', { data: null, error: null })
    const supabase = { from: jest.fn(() => selectChain) } as any

    await expect(updateJob(supabase, 'user-1', 'missing', { status: 'applied' })).rejects.toMatchObject({
      status: 404,
    })
  })
})

describe('deleteJob', () => {
  it('succeeds when a row is actually removed', async () => {
    const existing = mockJob()
    const selectChain = buildChain('maybeSingle', { data: existing, error: null })
    const deleteChain: any = {
      delete: jest.fn(() => deleteChain),
      eq: jest.fn(() => deleteChain),
      select: jest.fn().mockResolvedValue({ data: [{ id: 'job-1' }], error: null }),
    }
    const supabase = {
      from: jest.fn().mockReturnValueOnce(selectChain).mockReturnValueOnce(deleteChain),
    } as any

    await expect(deleteJob(supabase, 'user-1', 'job-1')).resolves.toBeUndefined()
  })

  // Regression test for the bug found in this session: Supabase/RLS can silently
  // match zero rows on a DELETE without raising a Postgres error, which previously
  // caused deleteJob() to resolve successfully despite nothing being removed.
  it('throws a 500 ApiError when zero rows are affected (silent RLS block)', async () => {
    const existing = mockJob()
    const selectChain = buildChain('maybeSingle', { data: existing, error: null })
    const deleteChain: any = {
      delete: jest.fn(() => deleteChain),
      eq: jest.fn(() => deleteChain),
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    }
    const supabase = {
      from: jest.fn().mockReturnValueOnce(selectChain).mockReturnValueOnce(deleteChain),
    } as any

    await expect(deleteJob(supabase, 'user-1', 'job-1')).rejects.toMatchObject({ status: 500 })
  })

  it('throws a 404 before attempting delete if the job does not exist', async () => {
    const selectChain = buildChain('maybeSingle', { data: null, error: null })
    const supabase = { from: jest.fn(() => selectChain) } as any

    await expect(deleteJob(supabase, 'user-1', 'missing')).rejects.toMatchObject({ status: 404 })
  })
})
