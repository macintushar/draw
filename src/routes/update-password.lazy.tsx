import UpdatePassword from "@/views/UpdatePassword";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/update-password")({
  component: UpdatePassword,
});
