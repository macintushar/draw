import { useEffect, useRef, useState } from "react";
import { exportToSvg } from "@excalidraw/excalidraw";
import type { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { BinaryFiles } from "@excalidraw/excalidraw/types";

import { cn } from "@/lib/utils";

type PagePreviewProps = {
  elements?: readonly NonDeletedExcalidrawElement[];
  files?: BinaryFiles;
  className?: string;
};

/**
 * Renders a static SVG thumbnail of an Excalidraw scene, scaled to fit its
 * container. Falls back to an "Empty page" label when there is nothing to draw.
 */
export default function PagePreview({
  elements,
  files,
  className,
}: PagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    const nonDeleted = (elements ?? []).filter((el) => !el.isDeleted);
    if (nonDeleted.length === 0) {
      setIsEmpty(true);
      container.replaceChildren();
      return;
    }

    setIsEmpty(false);

    exportToSvg({
      elements: nonDeleted,
      files: files ?? null,
      appState: { exportBackground: false, viewBackgroundColor: "transparent" },
      exportPadding: 8,
    })
      .then((svg: SVGSVGElement) => {
        if (cancelled) return;
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.width = "100%";
        svg.style.height = "100%";
        container.replaceChildren(svg);
      })
      .catch(() => {
        if (!cancelled) setIsEmpty(true);
      });

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [elements, files]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div ref={containerRef} className="h-full w-full" />
      {isEmpty && (
        <span className="absolute text-xs text-zinc-400">Empty page</span>
      )}
    </div>
  );
}
