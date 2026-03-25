import { type PlateEditor } from "platejs/react";
import { type DropTargetMonitor } from "react-dnd";

import { type NodeEntry, type Path, type TElement, PathApi } from "platejs";

import { type DragItemNode } from "@platejs/dnd";
import { type UseDropNodeOptions } from "../hooks";
import { getHoverDirection } from "./getHoverDirection";

/**
 * Get the drop path for a drag and drop operation.
 *
 * @param canCreateColumns - If true, left/right returns path for column creation.
 *                           If false, left/right is treated as reorder (like top/bottom).
 */
export const getDropPath = (
  editor: PlateEditor,
  {
    canDropNode,
    canCreateColumns = false,
    dragItem,
    element,
    monitor,
    nodeRef,
  }: {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
    canCreateColumns?: boolean;
  } & Pick<UseDropNodeOptions, "canDropNode" | "element" | "nodeRef">,
) => {
  const direction = getHoverDirection({
    dragItem,
    element,
    monitor,
    nodeRef,
  });

  if (!direction) return;

  let dragEntry: NodeEntry<TElement> | undefined;
  let dropEntry: NodeEntry<TElement> | undefined;

  if ("element" in dragItem) {
    const dragPath = editor.api.findPath(dragItem.element);
    const hoveredPath = editor.api.findPath(element);

    if (!hoveredPath) return;

    // If dragPath is found, we're moving an existing node
    // If not, we're inserting a new node (e.g., from external source)
    if (dragPath) {
      dragEntry = [dragItem.element, dragPath];
    }

    dropEntry = [element, hoveredPath];
  } else {
    dropEntry = editor.api.node({
      id: element.id as string,
      at: [],
    }) as NodeEntry<TElement> | undefined;
  }

  if (!dropEntry) return;

  // Only check canDropNode if we have a dragEntry (for existing nodes)
  if (
    canDropNode &&
    dragEntry &&
    !canDropNode({ dragEntry, dragItem, dropEntry, editor })
  ) {
    return;
  }

  const dragPath = dragEntry?.[1];
  const hoveredPath = dropEntry[1];

  // Handle left/right directions
  if (direction === "left" || direction === "right") {
    // If canCreateColumns is true, return for column creation (handled by onDropNode)
    if (canCreateColumns) {
      return {
        direction,
        dragPath,
        hoveredPath,
        to: hoveredPath,
        isExternalNode: !dragPath,
        createColumns: true,
      };
    }

    // Otherwise, treat left/right like top/bottom (reorder)
    // Left = before (like top), Right = after (like bottom)
    let dropPath: Path | undefined;

    if (direction === "right") {
      // Insert after hovered node (like bottom)
      dropPath = hoveredPath;
      if (dragPath && PathApi.equals(dragPath, PathApi.next(dropPath))) return;
    }

    if (direction === "left") {
      // Insert before hovered node (like top)
      dropPath = [...hoveredPath.slice(0, -1), hoveredPath.at(-1)! - 1];
      if (dragPath && PathApi.equals(dragPath, dropPath)) return;
    }

    if (!dropPath) return;

    const before =
      dragPath &&
      PathApi.isBefore(dragPath, dropPath) &&
      PathApi.isSibling(dragPath, dropPath);
    const to = before ? dropPath : PathApi.next(dropPath);

    return {
      direction,
      dragPath,
      to,
      hoveredPath,
      isExternalNode: !dragPath,
      createColumns: false,
    };
  }

  // Handle top/bottom drops for vertical reordering
  let dropPath: Path | undefined;

  if (direction === "bottom") {
    // Insert after hovered node
    dropPath = hoveredPath;

    // If the dragged node is already right after hovered node, no change
    if (dragPath && PathApi.equals(dragPath, PathApi.next(dropPath))) return;
  }

  if (direction === "top") {
    // Insert before hovered node
    dropPath = [...hoveredPath.slice(0, -1), hoveredPath.at(-1)! - 1];

    // If the dragged node is already right before hovered node, no change
    if (dragPath && PathApi.equals(dragPath, dropPath)) return;
  }

  if (!dropPath) return;

  const before =
    dragPath &&
    PathApi.isBefore(dragPath, dropPath) &&
    PathApi.isSibling(dragPath, dropPath);
  const to = before ? dropPath : PathApi.next(dropPath);

  return {
    direction,
    dragPath,
    to,
    hoveredPath,
    isExternalNode: !dragPath,
    createColumns: false,
  };
};
