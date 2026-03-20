import { DndPlugin, type DropLineDirection } from "@platejs/dnd";
import { useEditorRef, useElement, usePluginOptions } from "platejs/react";
import React from "react";

export const useDropLine = ({
  id: idProp,
  orientation,
}: {
  /** The id of the element to show the dropline for. */
  id?: string;
  /** Orientation to filter droplines. If specified, only matching droplines are returned. */
  orientation?: "horizontal" | "vertical";
} = {}): {
  dropLine?: DropLineDirection;
} => {
  const element = useElement();
  const editor = useEditorRef();
  const id = idProp || (element.id as string);

  const dropLine =
    usePluginOptions(DndPlugin, ({ dropTarget }) => {
      if (!dropTarget) return null;
      if (dropTarget.id !== id) return null;

      return dropTarget.line;
    }) ?? "";

  // When there's a dropline visible, start an interval that will attempt to
  // clear it every 500ms if we're no longer dragging.
  React.useEffect(() => {
    if (!dropLine) return;

    const intervalId = setInterval(() => {
      const { isDragging, dropTarget } = editor.getOptions(DndPlugin) as {
        isDragging?: boolean;
        dropTarget?: { id: string | null; line: DropLineDirection | "" } | null;
      };

      const hasDropLine = !!dropTarget?.line;
      const isStillDragging = !!isDragging;

      if (!isStillDragging && hasDropLine) {
        editor.setOption(DndPlugin, "dropTarget", { id: null, line: "" });
      }

      // If there's no dropline anymore, stop the interval
      if (!editor.getOptions(DndPlugin).dropTarget?.line) {
        clearInterval(intervalId);
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [editor, dropLine]);

  // Filter dropline by orientation if specified
  if (orientation) {
    const isHorizontalDropLine = dropLine === "left" || dropLine === "right";
    const isVerticalDropLine = dropLine === "top" || dropLine === "bottom";

    // If the orientation is vertical but we got a horizontal dropline, clear it.
    if (
      (orientation === "vertical" && isHorizontalDropLine) ||
      (orientation === "horizontal" && isVerticalDropLine)
    ) {
      return { dropLine: "" };
    }
  }

  return { dropLine };
};
