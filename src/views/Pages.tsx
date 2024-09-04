import { useQuery } from "@tanstack/react-query";
import { createNewPage, getPages } from "../db/draw";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import NoData from "./NoData";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useNavigate } from "@tanstack/react-router";

export default function Pages() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: getPages,
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

  return (
    <div className="w-full h-full">
      <h1 className="text-center text-2xl font-bold">PAGES</h1>
      <div className="flex w-full justify-end">
        <Button
          variant="outline"
          className="font-semibold"
          onClick={() => createPage()}
        >
          + New Page
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 py-1">
        {data?.data && data.data.length > 0 ? (
          data?.data?.map((page) => (
            <Card
              key={page.page_id}
              className="w-fit max-w-72 cursor-pointer"
              onClick={() => goToPage(page.page_id)}
            >
              <CardHeader>
                <CardTitle>{page.name}</CardTitle>
              </CardHeader>
              <CardFooter className="text-sm">
                Last updated on: {dayjs(page.updated_at).format("MMM DD, YYYY")}
              </CardFooter>
            </Card>
          ))
        ) : (
          <NoData name="Pages" />
        )}
      </div>
    </div>
  );
}
