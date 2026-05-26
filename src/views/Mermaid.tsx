import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import {
  convertToExcalidrawElements,
  Excalidraw,
} from "@excalidraw/excalidraw";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useTheme } from "@/components/theme-provider";
import TitleBar from "@/components/TitleBar";
import { useNavigate } from "@tanstack/react-router";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ExternalLink } from "lucide-react";
import { createNewPage } from "@/db/draw";

export default function Mermaid() {
  const [mermaidSyntax, setMermaidSyntax] = useState("");
  const [converting, setConverting] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();

  const { theme } = useTheme();
  const navigate = useNavigate();

  async function generateExcalidraw() {
    if (mermaidSyntax.length > 0) {
      setConverting(true);
      try {
        const { elements, files } =
          await parseMermaidToExcalidraw(mermaidSyntax);

        const convertedElements = convertToExcalidrawElements(elements);

        excalidrawAPI?.updateScene({
          elements: convertedElements,
          appState: { fileHandle: files },
        });

        setConverting(false);
        setCanSave(true);
      } catch (e) {
        toast("An error occured", {
          description: `Error: ${e}`,
        });
        setConverting(false);
      }
      setConverting(false);
    }
  }

  function goToPage(id: string) {
    navigate({ to: "/page/$id", params: { id: id } });
  }

  async function handleSaveAsNewPage() {
    const elements = excalidrawAPI?.getSceneElements();
    const files = excalidrawAPI?.getFiles();
    const data = await createNewPage(elements, files);

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

  useEffect(() => {
    setTimeout(
      () =>
        excalidrawAPI?.updateScene({
          appState: {
            viewBackgroundColor: "transparent",
          },
        }),
      10,
    );
  }, [excalidrawAPI]);

  return (
    <div className="flex h-full w-full flex-col">
      <TitleBar
        title="MERMAID"
        ctaLabel="Save As New Page"
        ctaAction={handleSaveAsNewPage}
        isCtaVisible
        isCtaDisabled={!canSave}
        titleExtra={
          <Tooltip>
            <TooltipTrigger>
              <a href="https://mermaid.js.org/" target="_blank">
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                  Learn more
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to learn more about Mermaid and mermaid.js.</p>
            </TooltipContent>
          </Tooltip>
        }
      />
      <div className="flex h-full w-full flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:w-1/3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mermaid Syntax</label>
          <Textarea
            onChange={(e) => setMermaidSyntax(e.target.value)}
            placeholder="Enter your Mermaid syntax here..."
            className="h-64 flex-1 resize-none"
          />
          <Button
            className="w-full"
            onClick={generateExcalidraw}
            isLoading={converting}
            loadingText="Converting..."
            disabled={mermaidSyntax.length === 0}
          >
            Convert to Excalidraw
          </Button>
        </div>
        <div className="h-full flex-1 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:w-2/3">
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            theme={theme === "dark" ? "dark" : "light"}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
