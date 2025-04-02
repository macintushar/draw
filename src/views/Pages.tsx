import { useQuery } from "@tanstack/react-query";
import { createNewPage, deletePage, getPages } from "../db/draw";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
    <div className="mx-2 my-3 h-full w-full">
      <TitleBar
        title="PAGES"
        extra={
          <NewPageOptionDropdown
            createPageFn={createPage}
            createMermaidPageFn={createMermaidPage}
          />
        }
      />
      <div className="flex flex-wrap gap-3 py-1">
        {data?.data && data.data.length > 0 ? (
          data?.data?.map((page) => (
            <Card
              key={page.page_id}
              className="group h-fit max-h-28 w-fit max-w-72 cursor-pointer p-1 px-2 pt-2"
            >
              <div onClick={() => goToPage(page.page_id)}>
                <CardContent className="flex w-full flex-col justify-end gap-3 py-2 text-sm">
                  <CardTitle className="line-clamp-1 font-virgil">
                    {page.name}
                  </CardTitle>
                  <h1 className="font-medium">
                    Last updated on:{" "}
                    {dayjs(page.updated_at).format("MMM DD, YYYY")}
                  </h1>
                </CardContent>
              </div>
              <div className="flex w-full items-end justify-end p-0.5">
                <Trash2
                  className="invisible h-4 w-4 cursor-pointer rounded-lg text-gray-600 transition-all hover:bg-gray-100 hover:text-red-500 group-hover:visible hover:dark:bg-gray-900"
                  strokeWidth={3}
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
