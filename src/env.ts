import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SUPABASE_URL: z.url(),
    VITE_SUPABASE_ANON_KEY: z.string().min(1),
    VITE_SENTRY_DSN: z.string().optional(),
    VITE_GOOGLE_AUTH_ENABLED: z
      .string()
      .optional()
      .default("false")
      .transform((value) => value === "true"),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
