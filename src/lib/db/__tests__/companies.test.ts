import { findOrCreateCompanyByUrl, getCompanyById } from '../companies'
import { buildChain } from '@/lib/test-utils/supabase-mock'
import type { Company } from '@/types/database'

const mockCompany = (overrides: Partial<Company> = {}): Company => ({
  id: 'company-1',
  name: 'Stripe',
  domain: 'stripe.com',
  privacy_policy_url: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

describe('findOrCreateCompanyByUrl', () => {
  it('returns the existing company when the domain is already known', async () => {
    const existing = mockCompany()
    const chain = buildChain('maybeSingle', { data: existing, error: null })
    const supabase = { from: jest.fn(() => chain) } as any

    const result = await findOrCreateCompanyByUrl(supabase, 'https://stripe.com/jobs/123')

    expect(supabase.from).toHaveBeenCalledWith('companies')
    expect(chain.eq).toHaveBeenCalledWith('domain', 'stripe.com')
    expect(result).toEqual(existing)
  })

  it('creates a new placeholder company when none exists for the domain', async () => {
    const selectChain = buildChain('maybeSingle', { data: null, error: null })
    const created = mockCompany({ id: 'company-2', name: 'Notion', domain: 'notion.so' })
    const insertChain = buildChain('single', { data: created, error: null })

    const supabase = {
      from: jest.fn().mockReturnValueOnce(selectChain).mockReturnValueOnce(insertChain),
    } as any

    const result = await findOrCreateCompanyByUrl(supabase, 'https://www.notion.so/careers/role')

    expect(insertChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ domain: 'notion.so', name: 'Notion', privacy_policy_url: null })
    )
    expect(result).toEqual(created)
  })

  it('refetches the winning row when insert hits a unique violation (race condition)', async () => {
    const selectChain = buildChain('maybeSingle', { data: null, error: null })
    const insertChain = buildChain('single', {
      data: null,
      error: { code: '23505', message: 'duplicate key value violates unique constraint' },
    })
    const raceWinner = mockCompany({ id: 'company-3', name: 'Github', domain: 'github.com' })
    const refetchChain = buildChain('single', { data: raceWinner, error: null })

    const supabase = {
      from: jest
        .fn()
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(insertChain)
        .mockReturnValueOnce(refetchChain),
    } as any

    const result = await findOrCreateCompanyByUrl(supabase, 'https://github.com/careers')

    expect(result).toEqual(raceWinner)
  })

  it('throws a 500 ApiError on an unrecoverable insert error', async () => {
    const selectChain = buildChain('maybeSingle', { data: null, error: null })
    const insertChain = buildChain('single', {
      data: null,
      error: { code: '42501', message: 'row-level security violation' },
    })

    const supabase = {
      from: jest.fn().mockReturnValueOnce(selectChain).mockReturnValueOnce(insertChain),
    } as any

    await expect(findOrCreateCompanyByUrl(supabase, 'https://example.com/careers')).rejects.toMatchObject({
      status: 500,
    })
  })

  it('throws a 500 ApiError when the initial lookup fails', async () => {
    const selectChain = buildChain('maybeSingle', { data: null, error: { message: 'connection reset' } })
    const supabase = { from: jest.fn(() => selectChain) } as any

    await expect(findOrCreateCompanyByUrl(supabase, 'https://example.com/careers')).rejects.toMatchObject({
      status: 500,
    })
  })
})

describe('getCompanyById', () => {
  it('returns the company when found', async () => {
    const company = mockCompany()
    const chain = buildChain('maybeSingle', { data: company, error: null })
    const supabase = { from: jest.fn(() => chain) } as any

    const result = await getCompanyById(supabase, 'company-1')

    expect(result).toEqual(company)
  })

  it('throws a 404 ApiError when the company does not exist', async () => {
    const chain = buildChain('maybeSingle', { data: null, error: null })
    const supabase = { from: jest.fn(() => chain) } as any

    await expect(getCompanyById(supabase, 'missing-id')).rejects.toMatchObject({ status: 404 })
  })

  it('throws a 500 ApiError on a query failure', async () => {
    const chain = buildChain('maybeSingle', { data: null, error: { message: 'db down' } })
    const supabase = { from: jest.fn(() => chain) } as any

    await expect(getCompanyById(supabase, 'company-1')).rejects.toMatchObject({ status: 500 })
  })
})
