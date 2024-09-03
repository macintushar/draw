import isAuthenticated from "@/hooks/isAuthenticated";
import Layout from "@/views/Layout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },
  component: Layout,
});
