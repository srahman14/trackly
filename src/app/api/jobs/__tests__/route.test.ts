import { NextRequest } from 'next/server'
import { GET, POST } from '../route'
import { requireUser } from '@/lib/api/auth'
import { listJobs, createJob } from '@/lib/db/jobs'
import { ApiError } from '@/lib/api/errors'

jest.mock('@/lib/api/auth')
jest.mock('@/lib/db/jobs')

const mockRequireUser = requireUser as jest.Mock
const mockListJobs = listJobs as jest.Mock
const mockCreateJob = createJob as jest.Mock

const fakeSupabase = {} as any

beforeEach(() => {
  jest.clearAllMocks()
  mockRequireUser.mockResolvedValue({ supabase: fakeSupabase, userId: 'user-1' })
})

describe('GET /api/jobs', () => {
  it('returns a paginated job list for the authenticated user', async () => {
    mockListJobs.mockResolvedValue({
      jobs: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    })

    const request = new NextRequest('http://localhost:3000/api/jobs?status=applied&page=1&limit=20')
    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(mockListJobs).toHaveBeenCalledWith(
      fakeSupabase,
      'user-1',
      expect.objectContaining({ status: 'applied', page: 1, limit: 20 })
    )
    expect(body.data.jobs).toEqual([])
  })

  it('returns 401 when the session is invalid', async () => {
    mockRequireUser.mockRejectedValue(new ApiError(401, 'Unauthorized'))

    const request = new NextRequest('http://localhost:3000/api/jobs')
    const response = await GET(request)

    expect(response.status).toBe(401)
  })

  it('returns 400 for an invalid status filter', async () => {
    const request = new NextRequest('http://localhost:3000/api/jobs?status=ghosted')
    const response = await GET(request)

    expect(response.status).toBe(400)
    expect(mockListJobs).not.toHaveBeenCalled()
  })
})

describe('POST /api/jobs', () => {
  it('creates a job given a valid payload', async () => {
    const job = { id: 'job-1', job_title: 'Senior Backend Engineer' }
    mockCreateJob.mockResolvedValue(job)

    const request = new NextRequest('http://localhost:3000/api/jobs', {
      method: 'POST',
      body: JSON.stringify({
        job_title: 'Senior Backend Engineer',
        job_url: 'https://stripe.com/jobs/listing/123',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.data).toEqual(job)
  })

  it('returns 400 for a malformed job_url', async () => {
    const request = new NextRequest('http://localhost:3000/api/jobs', {
      method: 'POST',
      body: JSON.stringify({ job_title: 'Bad', job_url: 'not-a-url' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(mockCreateJob).not.toHaveBeenCalled()
  })

  it('returns 400 for an invalid status enum value', async () => {
    const request = new NextRequest('http://localhost:3000/api/jobs', {
      method: 'POST',
      body: JSON.stringify({
        job_title: 'Bad Status',
        job_url: 'https://example.com/careers/role',
        status: 'ghosted',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })
})
