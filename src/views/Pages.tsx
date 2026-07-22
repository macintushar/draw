import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { LayoutGrid, Pencil, Trash2 } from "lucide-react";

import { createNewPage, deletePage, getPages } from "../db/draw";
import { getLocalUser } from "@/db/auth";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import PagePreview from "@/components/PagePreview";
import NoData from "./NoData";
import { fullRelativeTime } from "@/lib/utils";

export default function Pages() {
  const navigate = useNavigate();

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getLocalUser,
  });

  const user = profileData?.data.session?.user;
  const authorName =
    (user?.user_metadata?.name as string) ||
    user?.email?.split("@")[0] ||
    "you";

  const {
    data,
    isLoading,
    refetch: refetchPages,
  } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const user_session = await getLocalUser();
      if (!user_session.error) {
        if (!user_session.data.session) {
          toast.error("Something went wrong!");
          return { data: null, error: null };
        }
        return getPages(user_session?.data.session.user?.id ?? "");
      }
      return null;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (data?.error) {
    toast(data.error.message);
  }

  if (isLoading) return <Loader />;

  function goToPage(id: string) {
    navigate({ to: "/page/$id", params: { id: id } });
  }

  async function startDrawing() {
    const res = await createNewPage();
    if (res.data && res.data[0]?.page_id) {
      goToPage(res.data[0].page_id);
      return;
    }
    if (res.error) {
      toast("An error occured", { description: `Error: ${res.error.message}` });
    }
  }

  async function handlePageDelete(id: string) {
    const data = await deletePage(id);

    if (data.data === null) {
      toast("Successfully deleted the page!");
      refetchPages();
    }
    if (data.error) {
      toast("An error occured", {
        description: `Error: ${data.error.message}`,
      });
    }
  }

  const pages = data?.data ?? [];

  return (
    <div className="mx-auto h-full w-full max-w-5xl px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-6 w-6" strokeWidth={2.5} />
          <h1 className="font-accent text-2xl font-bold">Pages</h1>
        </div>
        <Button className="gap-1.5 font-semibold" onClick={startDrawing}>
          <Pencil className="h-4 w-4" />
          Start drawing
        </Button>
      </div>

      <hr className="my-4 border-zinc-200 dark:border-zinc-800" />

      <h2 className="mb-4 font-accent text-lg font-bold text-violet-500 dark:text-violet-400">
        Recently modified by you
      </h2>

      {pages.length > 0 ? (
        <div className="flex flex-wrap gap-5">
          {pages.map((page) => (
            <div key={page.page_id} className="group flex w-56 flex-col gap-2">
              <button
                type="button"
                onClick={() => goToPage(page.page_id)}
                className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 transition-shadow hover:shadow-md dark:border-zinc-700"
              >
                <PagePreview
                  elements={page.page_elements?.elements}
                  files={page.page_elements?.files}
                />
                <span className="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                  {fullRelativeTime(page.updated_at)}
                </span>
              </button>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-accent font-semibold">
                    {page.name || "Untitled"}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">
                    by {authorName}
                  </p>
                </div>
                <Trash2
                  className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer text-gray-400 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                  strokeWidth={2.5}
                  onClick={() => handlePageDelete(page.page_id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoData name="Pages" />
      )}
    </div>
  );
}
