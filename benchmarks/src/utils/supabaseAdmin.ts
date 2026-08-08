import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

/**
 * Service-role client — bypasses RLS. Used ONLY to seed/clean up rows the
 * HTTP API has no route for (e.g. inserting a raw `privacy_documents` row
 * for a fixture, since your app only creates those via the live scraper).
 *
 * Every other benchmark track goes through the real HTTP API with a normal
 * user session, on purpose — that's what actually exercises requireUser(),
 * RLS, and your route handlers, which is the point of benchmarking.
 */
export const supabaseAdmin = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
  auth: { persistSession: false },
});
