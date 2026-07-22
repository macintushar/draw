import ForgotPassword from "@/views/ForgotPassword";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/forgot-password")({
  component: ForgotPassword,
});
