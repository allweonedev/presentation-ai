import { DndPlugin } from "@platejs/dnd";
import {
  getSelectionBoundingClientRect,
  useVirtualFloating,
  type UseVirtualFloatingOptions,
} from "@platejs/floating";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { mergeProps, type TElement } from "platejs";
import {
  useEditorReadOnly,
  useEditorRef,
  useEditorSelector,
  useFocused,
  useOnClickOutside,
  usePluginOption,
} from "platejs/react";
import React from "react";
import { type MyEditor } from "../editor-kit";

export type FloatingToolbarState = {
  floatingOptions?: UseVirtualFloatingOptions;
  hideToolbar?: boolean;
  showWhenReadOnly?: boolean;
  enableBlockSelection?: boolean;
};

export const useFloatingToolbarState = ({
  editorId,
  floatingOptions,
  focusedEditorId,
  hideToolbar,
  showWhenReadOnly,
  enableBlockSelection = true, // Changed default to true
}: {
  editorId: string;
  focusedEditorId: string | null;
} & FloatingToolbarState) => {
  const editor = useEditorRef<MyEditor>();

  // Existing text selection state
  const selectionExpanded = useEditorSelector(
    () => editor.api.isExpanded(),
    [],
  );
  const selectionText = useEditorSelector(() => editor.api.string(), []);

  // Block selection state
  const selectedIds = usePluginOption(BlockSelectionPlugin, "selectedIds");
  const hasBlockSelection =
    enableBlockSelection && selectedIds && selectedIds.size > 0;

  // Check if dragging is active
  const isDragging = usePluginOption(DndPlugin, "isDragging");

  const readOnly = useEditorReadOnly();
  const focused = useFocused();
  const [open, setOpen] = React.useState(false);
  const [mousedown, setMousedown] = React.useState(false);
  const [waitForCollapsedSelection, setWaitForCollapsedSelection] =
    React.useState(false);

  const getBoundingClientRect = React.useCallback(() => {
    if (hasBlockSelection && enableBlockSelection) {
      // Get all selected block IDs and find their DOM elements
      const selectedIdArray = Array.from(selectedIds || []);

      if (selectedIdArray.length > 0) {
        const elements: HTMLElement[] = [];

        for (const id of selectedIdArray) {
          const element = editor.api.node({ id, at: [] })?.[0] as TElement;
          const domElement = editor.api.toDOMNode(element);
          if (domElement) {
            elements.push(domElement);
          }
        }

        if (elements.length > 0) {
          // Get bounding rects for all elements
          const rects = elements.map((el) => el.getBoundingClientRect());

          // Calculate combined bounding rect
          const top = Math.min(...rects.map((r) => r.top));
          const left = Math.min(...rects.map((r) => r.left));
          const right = Math.max(...rects.map((r) => r.right));
          const bottom = Math.max(...rects.map((r) => r.bottom));

          const combinedRect = {
            top,
            left,
            right,
            bottom,
            width: right - left,
            height: bottom - top,
            x: left,
            y: top,
          } as DOMRect;

          return combinedRect;
        }
      }
    }

    // Fallback to text selection
    return getSelectionBoundingClientRect(editor);
  }, [editor, hasBlockSelection, enableBlockSelection, selectedIds]);

  const floating = useVirtualFloating(
    mergeProps(
      {
        open,
        getBoundingClientRect,
        onOpenChange: setOpen,
      },
      floatingOptions,
    ),
  );

  return {
    editorId,
    floating,
    focused,
    focusedEditorId,
    hideToolbar,
    mousedown,
    open,
    readOnly,
    selectionExpanded,
    selectionText,
    hasBlockSelection,
    enableBlockSelection,
    isDragging,

    setMousedown,
    setOpen,
    setWaitForCollapsedSelection,
    showWhenReadOnly,
    waitForCollapsedSelection,
    selectedIds,
  };
};

export const useFloatingToolbar = ({
  editorId,
  floating,
  focusedEditorId,
  hideToolbar,
  mousedown,
  open,
  readOnly,
  selectionExpanded,
  selectionText,
  hasBlockSelection,
  isDragging,

  setMousedown,
  setOpen,
  setWaitForCollapsedSelection,
  showWhenReadOnly,
  waitForCollapsedSelection,
  selectedIds,
}: ReturnType<typeof useFloatingToolbarState>) => {
  const editor = useEditorRef<MyEditor>();
  // On refocus, the editor keeps the previous selection,
  // so we need to wait it's collapsed at the new position before displaying the floating toolbar.
  React.useEffect(() => {
    if (!(editorId === focusedEditorId)) {
      setWaitForCollapsedSelection(true);
    }
    // Reset wait flag if we have block selection OR no text selection
    if (!selectionExpanded || hasBlockSelection) {
      setWaitForCollapsedSelection(false);
    }
  }, [
    editorId,
    focusedEditorId,
    selectionExpanded,
    hasBlockSelection,
    setWaitForCollapsedSelection,
  ]);

  React.useEffect(() => {
    const mouseup = () => setMousedown(false);
    const mousedown = () => setMousedown(true);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("mousedown", mousedown);
    return () => {
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("mousedown", mousedown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MODIFIED: Updated visibility logic to include block selections and hide during dragging/mouse down
  React.useEffect(() => {
    const hasTextSelection = selectionExpanded && selectionText;
    const hasAnySelection = hasTextSelection || hasBlockSelection;

    // Hide conditions
    if (
      !hasAnySelection ||
      (mousedown && !open) ||
      hideToolbar ||
      (readOnly && !showWhenReadOnly) ||
      isDragging // Hide toolbar when dragging is active
    ) {
      setOpen(false);
    }
    // Show conditions - MODIFIED: Don't wait for collapsed selection if we have block selection
    else if (
      hasAnySelection &&
      (!waitForCollapsedSelection || readOnly || hasBlockSelection) &&
      !isDragging // Don't show if dragging is active
    ) {
      setOpen(true);
    }
  }, [
    setOpen,
    editorId,
    focusedEditorId,
    hideToolbar,
    showWhenReadOnly,
    selectionExpanded,
    selectionText,
    hasBlockSelection,
    mousedown,
    waitForCollapsedSelection,
    open,
    readOnly,
    isDragging, // Add isDragging to dependencies
  ]);

  const { update } = floating;

  useEditorSelector(() => {
    update?.();
  }, [update, selectedIds]);

  const clickOutsideRef = useOnClickOutside(
    () => {
      editor.api.blockSelection.deselect();
      setOpen(false);
    },
    {
      ignoreClass: "ignore-click-outside/toolbar",
    },
  );

  return {
    clickOutsideRef,
    hidden: !open,
    props: {
      style: floating.style,
    },
    ref: floating.refs.setFloating,
  };
};
