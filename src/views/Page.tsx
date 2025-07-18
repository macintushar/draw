/* eslint-disable no-console */
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Download } from "lucide-react";
import { getDrawData, setDrawData } from "@/db/draw";
import { drawDataStore } from "@/stores/drawDataStore";
import { useAsyncEffect } from "ahooks";

type PageProps = {
  id: string;
};

export default function Page({ id }: PageProps) {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [name, setName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { theme } = useTheme();
  const saveTimeoutRef = useRef<number | null>(null);

  const { refetch, isFetching } = useQuery({
    queryKey: ["page", id],
    queryFn: () => getDrawData(id),
    enabled: false,
  });

  const mutation = useMutation({
    mutationFn: (data: {
      elements: NonDeletedExcalidrawElement[];
      name: string;
      files?: BinaryFiles;
    }) => setDrawData(id, data.elements, data.name, data.files),
    onError: (error: Error) => {
      toast("An error occurred while saving to the server", {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast("Data saved to server");
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const { mutate } = mutation;

  // manual fetch data from server
  const fetchDataFromServer = useCallback(async () => {
    try {
      const result = await refetch();
      if (result.data?.data && excalidrawAPI) {
        const pageData = result.data.data[0].page_elements;
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

        setName(result.data.data[0].name);

        // Update local storage simultaneously
        const updatedAt = new Date().toISOString();
        await drawDataStore
          .getState()
          .setPageData(
            id,
            elements,
            updatedAt,
            result.data.data[0].name,
            files,
          );

        toast("Data loaded successfully from server");
      }
      if (result.data?.error) {
        toast("An error occurred", { description: result.data.error.message });
      }
    } catch (error) {
      toast("Failed to fetch data from server");
      console.error("Error fetching data:", error);
    }
  }, [refetch, excalidrawAPI, theme, id]);

  const setSceneData = useCallback(async () => {
    if (excalidrawAPI) {
      const scene = excalidrawAPI.getSceneElements();
      const files = excalidrawAPI.getFiles();
      const updatedAt = new Date().toISOString();

      setIsSaving(true);
      // Save locally first
      await drawDataStore.getState().setPageData(id, scene, updatedAt, name, files);

      // Then push to API
      mutate({
        elements: scene as NonDeletedExcalidrawElement[],
        name,
        files,
      });
    }
  }, [excalidrawAPI, id, name, mutate]);

  // Auto save to local storage when scene changes
  const handleSceneChange = (
    elements: readonly NonDeletedExcalidrawElement[],
  ) => {
    if (!excalidrawAPI) return;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce the save operation
    saveTimeoutRef.current = window.setTimeout(() => {
      console.log("handleSceneChange");
      const files = excalidrawAPI.getFiles();
      const updatedAt = new Date().toISOString();

      // Save to local storage automatically
      drawDataStore
        .getState()
        .setPageData(id, elements, updatedAt, name, files);
    }, 200);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useAsyncEffect(async () => {
    // Load data from local storage if available
    if (!excalidrawAPI) {
      return;
    }
    const localData = await drawDataStore.getState().getPageData(id);
    if (!localData) {
      toast("No local data, fetching from server", {
        description: "This may take a while",
      });
      console.log("no local data, fetching from server");
      await fetchDataFromServer();
      setIsLoaded(true);
    } else {
      // need to wait for excalidrawAPI to be ready
      setTimeout(() => {
        setName(localData.name);
        toast("Updating scene from local data");
        console.log("updating scene from local data");
        excalidrawAPI.updateScene({
          elements: localData.elements,
          appState: { theme: theme },
        });
        // Load files if they exist
        if (localData.files && Object.keys(localData.files).length > 0) {
          excalidrawAPI.addFiles(Object.values(localData.files));
        }
        setIsLoaded(true);
      }, 1000);
    }
  }, [excalidrawAPI]);

  return (
    <div className="flex w-full flex-col">
      <div className="relative h-full w-full">
        {/* Loading overlay */}
        {(isFetching || !isLoaded) && (
          <div className="bg-background/50 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground text-sm">Loading...</p>
            </div>
          </div>
        )}

        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={{ appState: { theme: theme } }}
          onChange={handleSceneChange}
          renderTopRightUI={() => (
            <div className="flex gap-2">
              <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="h-9 w-40"
                placeholder="Page Title"
              />
              <Button
                variant="secondary"
                onClick={setSceneData}
                isLoading={isSaving}
                loadingText=""
                size="sm"
                className="w-12"
              >
                Save
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={fetchDataFromServer}
                      disabled={isFetching}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Pull latest data from server. This will overwrite any
                      unsaved changes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          theme={theme === "dark" ? "dark" : "light"}
          autoFocus
        >
          <WelcomeScreen />
        </Excalidraw>
      </div>
    </div>
  );
}
