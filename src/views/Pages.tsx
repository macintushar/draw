import { useQuery } from "@tanstack/react-query";
import { createNewPage, deletePage, getPages } from "../db/draw";
import { Card, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import NoData from "./NoData";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import TitleBar from "@/components/TitleBar";
import { getLocalUser } from "@/db/auth";

function NewPageOptionDropdown({
  createPageFn,
  createMermaidPageFn,
}: {
  createPageFn: () => void;
  createMermaidPageFn: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-semibold">
          + New Page
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={createPageFn}>Plain Page</DropdownMenuItem>
        <DropdownMenuItem onClick={createMermaidPageFn}>
          Mermaid Syntax Diagram
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Pages() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    refetch: refetchPages,
  } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const user_session = await getLocalUser();
      if (!user_session.error) {
        if (!user_session.data?.session) {
          toast.error("Something went wrong!");
          return { data: null, error: null };
        }
        return getPages(user_session?.data?.session?.user?.id ?? "");
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

  async function createPage() {
    const data = await createNewPage();

    if (data.data && data.data[0]?.page_id) {
      goToPage(data.data[0].page_id);
      toast("Successfully created a new page!");
    }

    if (data.error) {
      toast("An error occured", {
        description: `Error: ${data.error.message}`,
      });
    }
  }

  async function createMermaidPage() {
    navigate({ to: "/mermaid" });
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

  return (
    <div className="h-full w-full">
      <TitleBar
        title="PAGES"
        extra={
          <NewPageOptionDropdown
            createPageFn={createPage}
            createMermaidPageFn={createMermaidPage}
          />
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.data && data.data.length > 0 ? (
          data?.data?.map((page) => (
            <Card
              key={page.page_id}
              className="group cursor-pointer transition-all hover:shadow-lg dark:hover:shadow-gray-900/50"
            >
              <div 
                onClick={() => goToPage(page.page_id)}
                className="flex flex-col gap-4 p-4"
              >
                <CardTitle className="line-clamp-2 font-virgil text-base text-gray-900 dark:text-gray-50">
                  {page.name}
                </CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated on{" "}
                  <span className="font-medium">
                    {dayjs(page.updated_at).format("MMM DD, YYYY")}
                  </span>
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-800">
                <Trash2
                  className="invisible h-4 w-4 cursor-pointer text-gray-400 transition-all group-hover:visible hover:text-red-500"
                  strokeWidth={2}
                  onClick={() => handlePageDelete(page.page_id)}
                />
              </div>
            </Card>
          ))
        ) : (
          <NoData name="Pages" />
        )}
      </div>
    </div>
  );
}
