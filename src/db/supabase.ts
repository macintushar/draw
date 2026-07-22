import { createClient } from "@supabase/supabase-js";

import { env } from "@/env";

export const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
);
