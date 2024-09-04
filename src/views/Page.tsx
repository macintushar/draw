import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { getDrawData, setDrawData } from "@/db/draw";
import { Excalidraw } from "@excalidraw/excalidraw";
import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PageProps = {
  id: string;
};

export default function Page({ id }: PageProps) {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["page", id],
    queryFn: () => getDrawData(id),
  });

  async function updateScene() {
    if (data?.data && excalidrawAPI) {
      const elements = data.data[0].page_elements.elements;
      excalidrawAPI.updateScene({ elements: elements });
      toast("Scene updated");
    }
    if (data?.error) {
      toast("An error occurred", { description: data.error.message });
    }
  }

  async function setSceneData() {
    if (excalidrawAPI) {
      const scene = excalidrawAPI.getSceneElements();
      const res = await setDrawData(id, scene as NonDeletedExcalidrawElement[]);
      if (res.data) {
        toast("Your page has been saved!");
      }
      if (res.error) {
        toast("An error occurred", { description: res.error.message });
      }
    }
  }

  useEffect(() => {
    if (!isLoading && data?.data && excalidrawAPI) {
      setTimeout(updateScene, 10);
    }
  }, [isLoading, data, excalidrawAPI]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2">
        <Button onClick={setSceneData}>Set Data</Button>
        <Button onClick={updateScene}>Update Data</Button>
      </div>
      <div className="bg-red-900 h-full w-full">
        {isLoading ? (
          <Loader />
        ) : (
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            autoFocus
          />
        )}
      </div>
    </div>
  );
}
