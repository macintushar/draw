import Profile from "@/views/Profile";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/profile")({
  component: Profile,
});
