import Mermaid from "@/views/Mermaid";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/mermaid")({
  component: Mermaid,
});
