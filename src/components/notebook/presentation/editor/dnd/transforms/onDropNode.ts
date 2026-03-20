import { type PlateEditor } from "platejs/react";
import { type DropTargetMonitor } from "react-dnd";

import { insertColumnGroup } from "@platejs/layout";
import { NodeApi, type Path, type TElement } from "platejs";

import { type ElementDragItemNode } from "@platejs/dnd";
import { type UseDropNodeOptions } from "../hooks";

import { getDropPath } from "../utils/getDropPath";
import { getHoverDirection } from "../utils/getHoverDirection";
import { updateSiblingsAfterDrop } from "../utils/updateSiblingsForcefully";

/**
 * Handle the drop of a node.
 *
 * @param canCreateColumns - If true and direction is left/right, create column layout.
 *                           If false, left/right drops just reorder.
 */
export const onDropNode = (
  editor: PlateEditor,
  {
    canDropNode,
    canCreateColumns = false,
    dragItem,
    element,
    monitor,
    nodeRef,
  }: {
    dragItem: ElementDragItemNode;
    monitor: DropTargetMonitor;
    canCreateColumns?: boolean;
  } & Pick<UseDropNodeOptions, "canDropNode" | "element" | "nodeRef">,
) => {
  let result = getDropPath(editor, {
    canDropNode,
    canCreateColumns,
    dragItem,
    element,
    monitor,
    nodeRef,
  });

  // If getDropPath returns null, try bubble-up for root elements over nested content
  if (!result) {
    const direction = getHoverDirection({
      dragItem,
      element,
      monitor,
      nodeRef,
    });

    // Only handle left/right for root element drops
    if (direction === "left" || direction === "right") {
      const dragPath = dragItem.element
        ? editor.api.findPath(dragItem.element)
        : undefined;

      // If dragging a root-level element
      if (dragPath && dragPath.length === 1) {
        const hoveredPath = editor.api.findPath(element);

        // If hovering over a nested element
        if (hoveredPath && hoveredPath.length > 1) {
          // Find the root-level parent element
          const rootPath: Path = [hoveredPath[0] as number];
          const rootElement = NodeApi.get(editor, rootPath) as
            | TElement
            | undefined;

          if (
            rootElement &&
            rootElement.id !== (dragItem.element?.id as string)
          ) {
            // Re-call getDropPath with the root element
            result = getDropPath(editor, {
              canDropNode: undefined, // Skip canDropNode check for bubbled drops
              canCreateColumns: true, // Root elements can create columns
              dragItem,
              element: rootElement,
              monitor,
              nodeRef: { current: editor.api.toDOMNode(rootElement) },
            });

            // If still no result, create a synthetic result for column creation
            if (!result) {
              result = {
                direction,
                dragPath,
                hoveredPath: rootPath,
                to: rootPath,
                isExternalNode: false,
                createColumns: true,
              };
            }
          }
        }
      }
    }

    if (!result) return;
  }

  const {
    direction,
    dragPath,
    to,
    hoveredPath,
    isExternalNode,
    createColumns,
  } = result;
  const draggedIds = Array.isArray(dragItem.id) ? dragItem.id : [dragItem.id];

  // Handle column creation (only when canCreateColumns=true AND direction is left/right)
  if (createColumns && (direction === "left" || direction === "right")) {
    if (!hoveredPath) return;

    const targetElementId =
      (NodeApi.get(editor, hoveredPath) as TElement)?.id ||
      (element.id as string);
    const draggedElementIds = new Set(draggedIds);

    // Create a column group with 2 columns at the hovered position
    insertColumnGroup(editor, {
      columns: 2,
      at: hoveredPath,
    });

    const columnGroupPath = hoveredPath;
    const firstColumnPath = [...columnGroupPath, 0];
    const secondColumnPath = [...columnGroupPath, 1];

    // Determine which column gets which content based on direction
    const targetColumnPath =
      direction === "left" ? secondColumnPath : firstColumnPath;
    const draggedColumnPath =
      direction === "left" ? firstColumnPath : secondColumnPath;

    editor.tf.withoutNormalizing(() => {
      // Move the target element into its column
      editor.tf.moveNodes({
        at: [],
        to: [...targetColumnPath, 0],
        match: (n) => n.id === targetElementId,
      });

      if (
        isExternalNode &&
        dragItem.element &&
        typeof dragItem.element === "object"
      ) {
        // Handle external node insertion
        if (Array.isArray(dragItem.element)) {
          dragItem.element.forEach((elem, index) => {
            editor.tf.insertNodes(elem, {
              at: [...draggedColumnPath, index],
            });
          });
        } else {
          editor.tf.insertNodes(dragItem.element as TElement, {
            at: [...draggedColumnPath, 0],
          });
        }
      } else {
        // Move all dragged nodes into the dragged column
        const nodesToMove: TElement[] = [];
        draggedElementIds.forEach((id) => {
          const entry = editor.api.node({ id, at: [] });
          if (entry) {
            nodesToMove.push(entry[0] as TElement);
          }
        });

        if (nodesToMove.length > 0) {
          editor.tf.moveNodes({
            at: [],
            to: [...draggedColumnPath, 0],
            match: (n) => draggedElementIds.has(n.id as string),
          });
        }
      }

      // Update siblings for dropped elements
      draggedElementIds.forEach((id) => {
        const entry = editor.api.node({ id });
        const node = entry?.[0];

        if (node && typeof node === "object" && "type" in node) {
          updateSiblingsAfterDrop(
            editor,
            node as TElement,
            [...draggedColumnPath, 0],
          );
        }
      });
    });

    return;
  }

  // Handle reordering (all other cases: top/bottom or left/right without column creation)
  if (!to) return;

  if (draggedIds.length > 1) {
    // Handle multi-node drop
    const draggedElementIds = new Set(draggedIds);

    editor.tf.moveNodes({
      at: [],
      to,
      match: (n) => draggedElementIds.has(n.id as string),
    });

    // Update siblings for dropped elements
    draggedElementIds.forEach((id) => {
      const entry = editor.api.node({ id });
      const node = entry?.[0];

      if (node && typeof node === "object" && "type" in node) {
        updateSiblingsAfterDrop(editor, node as TElement, to);
      }
    });
  } else if (
    isExternalNode &&
    dragItem.element &&
    typeof dragItem.element === "object"
  ) {
    // External node - insert at position
    editor.tf.insertNodes(dragItem.element as TElement, {
      at: to,
    });
  } else if (dragPath) {
    // Single node drop - standard move
    editor.tf.moveNodes({
      at: dragPath,
      to,
    });

    // Update siblings for dropped element
    const droppedElement = editor.api.node(to);
    const node = droppedElement?.[0];

    if (node && typeof node === "object" && "type" in node) {
      updateSiblingsAfterDrop(editor, node as TElement, to);
    }
  }
};
