import Page from "@/views/Page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/page/$id")({
  component: () => {
    const { id } = Route.useParams();
    return <Page id={id} />;
  },
});
