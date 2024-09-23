import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import {
  convertToExcalidrawElements,
  Excalidraw,
} from "@excalidraw/excalidraw";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useTheme } from "@/components/theme-provider";
import TitleBar from "@/components/TitleBar";
import { useNavigate } from "@tanstack/react-router";

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

  async function handleSaveAsNewPage() {
    navigate({ to: "/pages" });
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
    <div className="flex h-full w-full flex-col p-1">
      <TitleBar
        title="MERMAID"
        ctaLabel="Save As New Page"
        ctaAction={handleSaveAsNewPage}
        isCtaVisible
        isCtaDisabled={!canSave}
      />
      <div className="flex h-full w-full flex-row gap-3">
        <div className="flex h-full w-full flex-col gap-3 rounded-xl border-2 border-white p-1 sm:w-1/3">
          <Textarea
            onChange={(e) => setMermaidSyntax(e.target.value)}
            className="h-full resize-none"
          />
          <Button
            size="lg"
            className="w-full"
            onClick={generateExcalidraw}
            isLoading={converting}
            loadingText="Converting..."
            disabled={mermaidSyntax.length === 0}
          >
            Convert to Excalidraw
          </Button>
        </div>
        <div className="h-full w-full rounded-xl border-2 border-white sm:w-2/3">
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
