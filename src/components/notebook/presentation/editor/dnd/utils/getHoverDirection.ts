/** biome-ignore-all lint/suspicious/noExplicitAny: This use requires any */
import { type TElement } from "platejs";
import { type DropTargetMonitor, type XYCoord } from "react-dnd";

import {
  type DragItemNode,
  type DropDirection,
  type ElementDragItemNode,
} from "@platejs/dnd";

export interface GetHoverDirectionOptions {
  dragItem: DragItemNode;

  /** Hovering node. */
  element: TElement;

  monitor: DropTargetMonitor;

  /** The node ref of the node being dragged. */
  nodeRef: any;
}

/**
 * If dragging a node A over another node B: get the direction of node A
 * relative to node B based on mouse position.
 *
 * Always detects all 4 directions (top/bottom/left/right).
 * Uses edge zones for left/right detection with fallback to vertical.
 */
export const getHoverDirection = ({
  dragItem,
  element,
  monitor,
  nodeRef,
}: GetHoverDirectionOptions): DropDirection => {
  if (!nodeRef.current) return;

  // Don't replace items with themselves
  if (element === (dragItem as ElementDragItemNode).element) return;

  // For multiple node drag, don't show drop line if hovering over any selected element
  const elementDragItem = dragItem as ElementDragItemNode;
  const draggedIds = Array.isArray(elementDragItem.id)
    ? elementDragItem.id
    : [elementDragItem.id];
  if (draggedIds.includes(element.id as string)) return;

  const HORIZONTAL_THRESHOLD = 40;

  const hoverBoundingRect = nodeRef.current?.getBoundingClientRect();
  if (!hoverBoundingRect) return;

  const clientOffset = monitor.getClientOffset();
  if (!clientOffset) return;

  const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;
  const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

  // Check for left edge zone
  if (hoverClientX < HORIZONTAL_THRESHOLD) {
    return "left";
  }

  // Check for right edge zone
  const hoverMiddleX = hoverBoundingRect.width / 2;
  if (hoverClientX > hoverMiddleX + HORIZONTAL_THRESHOLD) {
    return "right";
  }

  // Default: vertical direction based on mouse Y position
  const hoverMiddleY = hoverBoundingRect.height / 2;
  return hoverClientY < hoverMiddleY ? "top" : "bottom";
};
