/**
 * Lightweight Supabase query builder mocks for unit testing lib/db/* functions.
 *
 * These are NOT full fakes of the Supabase client — they only implement the
 * chain methods our code actually calls (select/insert/update/delete/eq/order/range),
 * resolving to whatever result you configure per test.
 */

type QueryResult = { data: any; error: any; count?: number }

/**
 * Use for chains that terminate in `.single()` or `.maybeSingle()`, e.g.
 *   supabase.from('jobs').select().eq().maybeSingle()
 */
export function buildChain(finalMethod: 'single' | 'maybeSingle', result: QueryResult) {
  const chain: any = {}
  ;['select', 'insert', 'update', 'delete', 'eq'].forEach((method) => {
    chain[method] = jest.fn(() => chain)
  })
  chain[finalMethod] = jest.fn().mockResolvedValue(result)
  return chain
}

/**
 * Use for chains that are awaited directly without a terminal .single()/.maybeSingle(), e.g.
 *   supabase.from('jobs').select().eq().order().range()   // then: await query
 */
export function buildAwaitableChain(result: QueryResult) {
  const chain: any = {}
  ;['select', 'insert', 'update', 'delete', 'eq', 'order', 'range'].forEach((method) => {
    chain[method] = jest.fn(() => chain)
  })
  chain.then = (resolve: (value: QueryResult) => void, reject: (reason?: any) => void) =>
    Promise.resolve(result).then(resolve, reject)
  return chain
}
