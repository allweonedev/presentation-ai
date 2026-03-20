/** biome-ignore-all lint/suspicious/noExplicitAny: This is a valid use case */
import React from "react";

import { useEditorRef } from "platejs/react";

import { DRAG_ITEM_BLOCK } from "@platejs/dnd";
import { type UseDndNodeOptions, useDndNode } from "./useDndNode";

export type DraggableState = {
  /**
   * True when the element is ready to be dragged (e.g., on mouse down but
   * before drag starts)
   */
  isAboutToDrag: boolean;
  isDragging: boolean;
  /** The ref of the draggable element */
  nodeRef: React.RefObject<HTMLDivElement | null>;
  /** The ref of the multiple preview element */
  previewRef: React.RefObject<HTMLDivElement | null>;
  /** The ref of the draggable handle */
  handleRef: (
    elementOrNode:
      | Element
      | React.ReactElement<any>
      | React.RefObject<any>
      | null,
  ) => void;
};

export const useDraggable = (props: UseDndNodeOptions): DraggableState => {
  const { type = DRAG_ITEM_BLOCK, canCreateColumns, onDropHandler } = props;

  const editor = useEditorRef();

  const nodeRef = React.useRef<HTMLDivElement>(null);

  const multiplePreviewRef = React.useRef<HTMLDivElement>(null);

  if (!editor.plugins.dnd) return {} as any;

  // biome-ignore lint/correctness/useHookAtTopLevel: We don't need to calculate anything when props are not available
  const { dragRef, isAboutToDrag, isDragging } = useDndNode({
    multiplePreviewRef,
    nodeRef,
    type,
    onDropHandler,
    canCreateColumns,
    ...props,
  });

  return {
    isAboutToDrag,
    isDragging,
    nodeRef,
    previewRef: multiplePreviewRef,
    handleRef: dragRef,
  };
};
