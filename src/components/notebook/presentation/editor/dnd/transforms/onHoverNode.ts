import { type PlateEditor } from "platejs/react";
import { type DropTargetMonitor } from "react-dnd";

import { NodeApi, PathApi, type Path, type TElement } from "platejs";

import {
  DndPlugin,
  type DragItemNode,
  type ElementDragItemNode,
} from "@platejs/dnd";
import { type UseDropNodeOptions } from "../hooks/useDropNode";

import { getDropPath } from "../utils/getDropPath";
import { getHoverDirection } from "../utils/getHoverDirection";

/**
 * Callback called when dragging a node and hovering nodes.
 * Updates the dropTarget to show the drop line indicator.
 */
export const onHoverNode = (
  editor: PlateEditor,
  {
    canDropNode,
    dragItem,
    element,
    monitor,
    nodeRef,
  }: {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
  } & Pick<UseDropNodeOptions, "canDropNode" | "element" | "nodeRef">,
) => {
  const { _isOver, dropTarget } = editor.getOptions(DndPlugin);
  const currentId = dropTarget?.id ?? null;
  const currentLine = dropTarget?.line ?? "";

  // Check if the drop would actually move the node
  const result = getDropPath(editor, {
    canDropNode,
    dragItem,
    element,
    monitor,
    nodeRef,
  });

  // If getDropPath returns undefined, try to bubble up to a root-level parent
  if (!result) {
    // Get the hover direction first
    const direction = getHoverDirection({
      dragItem,
      element,
      monitor,
      nodeRef,
    });

    // Only bubble up for left/right directions when dragging a root element over nested content
    if (direction === "left" || direction === "right") {
      const dragItemNode = dragItem as ElementDragItemNode;
      const dragPath = dragItemNode.element
        ? editor.api.findPath(dragItemNode.element)
        : undefined;

      // If dragging a root-level element
      if (dragPath && dragPath.length === 1) {
        const hoveredPath = editor.api.findPath(element);

        // If hovering over a nested element (not root level)
        if (hoveredPath && hoveredPath.length > 1) {
          // Find the root-level parent
          const rootPath: Path = [hoveredPath[0] as number];
          const rootElement = NodeApi.get(editor, rootPath) as
            | TElement
            | undefined;

          if (
            rootElement &&
            rootElement.id !== (dragItemNode.element?.id as string)
          ) {
            // Show dropline on the root-level parent
            const newDropTarget = {
              id: rootElement.id as string,
              line: direction,
            };

            if (
              newDropTarget.id !== currentId ||
              newDropTarget.line !== currentLine
            ) {
              if (_isOver) {
                editor.setOption(DndPlugin, "dropTarget", newDropTarget);
              }
            }
            return;
          }
        }
      }
    }

    // No valid drop target found, clear the dropline
    if (currentId || currentLine) {
      editor.setOption(DndPlugin, "dropTarget", { id: null, line: "" });
    }
    return;
  }

  const { direction } = result;
  const newDropTarget = { id: element.id as string, line: direction };

  if (newDropTarget.id !== currentId || newDropTarget.line !== currentLine) {
    // Only set if there's a real change
    if (!_isOver) {
      return;
    }

    // For top positioning, adjust to show line at bottom of previous element
    // This makes the visual indicator appear between elements
    if (newDropTarget.line === "top") {
      const previousPath = PathApi.previous(editor.api.findPath(element)!);

      if (!previousPath) {
        return editor.setOption(DndPlugin, "dropTarget", newDropTarget);
      }

      const prevNode = NodeApi.get(editor, previousPath!);

      editor.setOption(DndPlugin, "dropTarget", {
        id: prevNode?.id as string,
        line: "bottom",
      });

      return;
    }

    // For left/right, show dropline on the actual hovered element
    // (no redirection needed - left shows left line, right shows right line)
    editor.setOption(DndPlugin, "dropTarget", newDropTarget);
  }

  // Collapse selection if expanded during drag
  if (direction && editor.api.isExpanded()) {
    editor.tf.focus();
    editor.tf.collapse();
  }
};
