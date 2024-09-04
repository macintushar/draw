import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loader from "@/components/Loader";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { Excalidraw } from "@excalidraw/excalidraw";
import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

import { useQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";

import { getDrawData, setDrawData } from "@/db/draw";

type PageProps = {
  id: string;
};

export default function Page({ id }: PageProps) {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [name, setName] = useState("");

  const { theme } = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ["page", id],
    queryFn: () => getDrawData(id),
  });

  async function updateScene() {
    if (data?.data && excalidrawAPI) {
      const elements = data.data[0].page_elements.elements;
      excalidrawAPI.updateScene({
        elements: elements,
        appState: { viewBackgroundColor: "transparent" },
      });
      setName(data.data[0].name);
      toast("Scene updated");
    }
    if (data?.error) {
      toast("An error occurred", { description: data.error.message });
    }
  }
  console.log(theme);

  async function setSceneData() {
    if (excalidrawAPI) {
      const scene = excalidrawAPI.getSceneElements();
      const res = await setDrawData(
        id,
        scene as NonDeletedExcalidrawElement[],
        name
      );
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
      <div className="h-full w-full">
        {isLoading ? (
          <Loader />
        ) : (
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            renderTopRightUI={() => (
              <div className="flex gap-2">
                <Input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-40"
                />
                <Button variant="secondary" onClick={setSceneData}>
                  Save
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={updateScene}
                      >
                        <RefreshCcw className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Refreshes the page. This removes any unsaved changes.
                        Use with caution.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            theme={theme === "dark" ? "dark" : "light"}
            autoFocus
          />
        )}
      </div>
    </div>
  );
}
