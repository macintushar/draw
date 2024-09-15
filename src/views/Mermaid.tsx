import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import {
  convertToExcalidrawElements,
  Excalidraw,
} from "@excalidraw/excalidraw";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useTheme } from "@/components/theme-provider";

export default function Mermaid() {
  const [mermaidSyntax, setMermaidSyntax] = useState("");
  const [converting, setConverting] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();

  const { theme } = useTheme();

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
      } catch (e) {
        toast("An error occured", {
          description: `Error: ${e}`,
        });
        setConverting(false);
      }
      setConverting(false);
    }
  }

  excalidrawAPI?.updateScene({
    appState: { viewBackgroundColor: "transparent" },
  });

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-center text-2xl font-bold">PAGES</h1>
      <div className="w-full flex flex-row gap-3 h-full">
        <div className="sm:w-1/3 w-full h-full flex flex-col gap-3 border-2 border-white rounded-xl p-1">
          <Textarea
            onChange={(e) => setMermaidSyntax(e.target.value)}
            className="h-full"
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
        <div className="sm:w-2/3 w-full h-full border-2 border-white rounded-xl">
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
