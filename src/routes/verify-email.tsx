import VerifyEmail from "@/views/VerifyEmail";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const verifyEmailSearchSchema = z.object({
  email: z.string().email().optional().catch(undefined),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search) => verifyEmailSearchSchema.parse(search),
  component: VerifyEmail,
});
