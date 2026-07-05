import { NextRequest } from 'next/server'
import { GET, PATCH, DELETE } from '../route'
import { requireUser } from '@/lib/api/auth'
import { getJobById, updateJob, deleteJob } from '@/lib/db/jobs'
import { ApiError } from '@/lib/api/errors'


jest.mock('@/lib/api/auth')
jest.mock('@/lib/db/jobs')

const mockRequireUser = requireUser as jest.Mock
const mockGetJobById = getJobById as jest.Mock
const mockUpdateJob = updateJob as jest.Mock
const mockDeleteJob = deleteJob as jest.Mock

const fakeSupabase = {} as any
const context = (id: string) => ({ params: Promise.resolve({ id }) })

beforeEach(() => {
  jest.clearAllMocks()
  mockRequireUser.mockResolvedValue({ supabase: fakeSupabase, userId: 'user-1' })
})

describe('GET /api/jobs/:id', () => {
  it('returns the job when found', async () => {
    const job = { id: 'job-1', job_title: 'Senior Backend Engineer' }
    mockGetJobById.mockResolvedValue(job)

    const request = new NextRequest('http://localhost:3000/api/jobs/job-1')
    const response = await GET(request, context('job-1'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data).toEqual(job)
  })

  it('returns 404 when the job does not exist', async () => {
    mockGetJobById.mockRejectedValue(new ApiError(404, 'Job not found'))

    const request = new NextRequest('http://localhost:3000/api/jobs/missing')
    const response = await GET(request, context('missing'))

    expect(response.status).toBe(404)
  })
})

describe('PATCH /api/jobs/:id', () => {
  it('applies a partial update', async () => {
    const updated = { id: 'job-1', status: 'interviewing' }
    mockUpdateJob.mockResolvedValue(updated)

    const request = new NextRequest('http://localhost:3000/api/jobs/job-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'interviewing' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await PATCH(request, context('job-1'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(mockUpdateJob).toHaveBeenCalledWith(fakeSupabase, 'user-1', 'job-1', { status: 'interviewing' })
    expect(body.data).toEqual(updated)
  })

  it('returns 400 for an invalid status value', async () => {
    const request = new NextRequest('http://localhost:3000/api/jobs/job-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ghosted' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await PATCH(request, context('job-1'))

    expect(response.status).toBe(400)
    expect(mockUpdateJob).not.toHaveBeenCalled()
  })
})

describe('DELETE /api/jobs/:id', () => {
  it('deletes the job and confirms', async () => {
    mockDeleteJob.mockResolvedValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/jobs/job-1', { method: 'DELETE' })
    const response = await DELETE(request, context('job-1'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data).toEqual({ deleted: true })
  })

  // Regression coverage for today's bug: a delete that silently affects zero rows
  // (RLS blocking it) must surface as an error response, not a false 200.
  it('returns 500 when the DB layer reports zero rows affected', async () => {
    mockDeleteJob.mockRejectedValue(
      new ApiError(500, 'Delete failed: no rows affected (check RLS policy)')
    )

    const request = new NextRequest('http://localhost:3000/api/jobs/job-1', { method: 'DELETE' })
    const response = await DELETE(request, context('job-1'))

    expect(response.status).toBe(500)
  })

  it('returns 404 when the job does not exist before delete is attempted', async () => {
    mockDeleteJob.mockRejectedValue(new ApiError(404, 'Job not found'))

    const request = new NextRequest('http://localhost:3000/api/jobs/missing', { method: 'DELETE' })
    const response = await DELETE(request, context('missing'))

    expect(response.status).toBe(404)
  })
})
