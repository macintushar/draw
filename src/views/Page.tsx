import { useEffect, useState, useCallback } from "react";
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
import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import {
  ExcalidrawImperativeAPI,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { RefreshCcw, Save } from "lucide-react";
import { getDrawData, setDrawData } from "@/db/draw";
import { drawDataStore } from "@/stores/drawDataStore";

type PageProps = {
  id: string;
};

export default function Page({ id }: PageProps) {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { theme } = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ["page", id],
    queryFn: () => getDrawData(id),
  });

  const mutation = useMutation({
    mutationFn: (data: {
      elements: NonDeletedExcalidrawElement[];
      name: string;
      files?: BinaryFiles;
    }) => setDrawData(id, data.elements, data.name, data.files),
    onSuccess: () => {
      setIsSaving(false);
    },
    onError: (error: Error) => {
      setIsSaving(false);
      toast("An error occurred while saving to the server", {
        description: error.message,
      });
    },
  });

  const { mutate } = mutation;

  async function updateScene() {
    if (data?.data && excalidrawAPI) {
      const pageData = data.data[0].page_elements;
      const elements = pageData.elements || [];
      const files = pageData.files || {};

      excalidrawAPI.updateScene({
        elements: elements,
        appState: { theme: theme },
      });

      // Update files if they exist
      if (Object.keys(files).length > 0) {
        excalidrawAPI.addFiles(Object.values(files));
      }

      setName(data.data[0].name);
    }
    if (data?.error) {
      toast("An error occurred", { description: data.error.message });
    }
  }

  const setSceneData = useCallback(async () => {
    if (excalidrawAPI) {
      const scene = excalidrawAPI.getSceneElements();
      const files = excalidrawAPI.getFiles();
      const updatedAt = new Date().toISOString();

      const existingData = drawDataStore.getState().getPageData(id);

      if (
        JSON.stringify(existingData?.elements) !== JSON.stringify(scene) ||
        JSON.stringify(existingData?.files) !== JSON.stringify(files)
      ) {
        setIsSaving(true);
        // Save locally first
        drawDataStore.getState().setPageData(id, scene, updatedAt, name, files);

        // Then push to API
        mutate(
          {
            elements: scene as NonDeletedExcalidrawElement[],
            name,
            files,
          },
          {
            onSettled() {
              setIsSaving(false);
            },
          },
        );
      }
    }
  }, [excalidrawAPI, id, name, mutate]);

  useEffect(() => {
    if (!isLoading && data?.data && excalidrawAPI) {
      setTimeout(updateScene, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data, excalidrawAPI]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSceneData();
    }, 3000);

    return () => clearInterval(interval);
  }, [setSceneData]);

  useEffect(() => {
    // Load data from local storage if available
    const localData = drawDataStore.getState().getPageData(id);
    if (localData && excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: localData.elements,
        appState: { theme: theme },
      });

      // Load files if they exist
      if (localData.files && Object.keys(localData.files).length > 0) {
        excalidrawAPI.addFiles(Object.values(localData.files));
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing persisted store data into local state when the page id changes
      setName(localData.name);
    }
  }, [id, excalidrawAPI, theme]);

  return (
    <div className="flex h-full w-full flex-col">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="h-9 w-full min-w-0 flex-1 sm:max-w-xs md:max-w-sm lg:max-w-md"
              placeholder="Page Title"
              aria-label="Page title"
            />
            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                variant="secondary"
                onClick={setSceneData}
                disabled={isSaving}
                size="sm"
                className="gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isSaving ? "Saving..." : "Save"}
                </span>
                <span className="sr-only sm:hidden">
                  {isSaving ? "Saving" : "Save"}
                </span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={updateScene}
                      className="gap-1.5"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Reload
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Refreshes the page. This removes any unsaved changes. Use
                      with caution.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </header>
          <div className="min-h-0 flex-1">
            <Excalidraw
              excalidrawAPI={(api) => setExcalidrawAPI(api)}
              initialData={{ appState: { theme: theme } }}
              theme={theme === "dark" ? "dark" : "light"}
              autoFocus
            >
              <WelcomeScreen />
            </Excalidraw>
          </div>
        </>
      )}
    </div>
  );
}
