import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Purpose: the one Supabase client the browser uses for data and file storage.
 * Dependencies: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, baked in at build time.
 * Constraints: the publishable key is public by design; row-level security protects the data.
 * Never use a secret/service-role key here.
 */
const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"];
const SUPABASE_PUBLISHABLE_KEY = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env and fill them in.",
  );
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
