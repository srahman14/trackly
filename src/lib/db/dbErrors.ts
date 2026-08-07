// lib/db/dbErrors.ts (new)
import { PostgrestError } from '@supabase/supabase-js';
import { ApiError } from '@/lib/api/errors';

/**
 * Standard handling for a Supabase fetch-by-id query: malformed UUIDs
 * (Postgres 22P02) become a 400, any other DB error becomes a 500.
 * Callers still handle the null-data 404 case themselves, since the
 * "not found" message differs per entity.
 */
export function throwIfDbError(error: PostgrestError | null, entityName: string): void {
  if (!error) return;
  if (error.code === '22P02') {
    throw new ApiError(400, `Invalid ${entityName} id format`);
  }
  throw new ApiError(500, `Failed to fetch ${entityName}`);
}