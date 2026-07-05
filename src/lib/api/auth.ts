import { createClient } from "../supabase/server";
import { ApiError } from "./errors";

// requreUser() wrapper -> every route calls this first to verify that user is authorized
export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    throw new ApiError(401, "Unauthorized");
  }

  return { supabase, userId: data.claims.sub as string };
}
