import Pages from "@/views/Pages";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/pages")({
  component: Pages,
});
