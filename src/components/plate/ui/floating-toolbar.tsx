"use client";

import * as React from "react";

import { type FloatingToolbarState, flip, offset } from "@platejs/floating";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { KEYS } from "platejs";
import {
  useComposedRef,
  useEditorId,
  useEditorRef,
  useEventEditorValue,
  usePluginOption,
} from "platejs/react";

import { cn } from "@/lib/utils";

import {
  ANTV_INFOGRAPHIC,
  BLOCKS,
} from "@/components/notebook/presentation/editor/lib";
import { type MyEditor } from "../editor-kit";
import {
  useFloatingToolbar,
  useFloatingToolbarState,
} from "../hooks/use-floating-toolbar";
import { Toolbar } from "./toolbar";

export function FloatingToolbar({
  children,
  className,
  state,
  ...props
}: React.ComponentProps<typeof Toolbar> & {
  state?: FloatingToolbarState;
}) {
  const editorId = useEditorId();
  const editor = useEditorRef<MyEditor>();
  const focusedEditorId = useEventEditorValue("focus");
  const isFloatingLinkOpen = !!usePluginOption({ key: KEYS.link }, "mode");
  const isAIChatOpen = usePluginOption({ key: KEYS.aiChat }, "open");

  // Check if any blocks are selected
  const selectedIds = usePluginOption(BlockSelectionPlugin, "selectedIds");
  const hasBlockSelection = selectedIds && selectedIds.size > 0;

  // Check if the selected blocks are layout blocks or image elements
  const isLayoutBlockSelected = React.useMemo(() => {
    if (!hasBlockSelection || !selectedIds) return false;

    // Check if any of the selected blocks are layout blocks or images
    for (const blockId of selectedIds) {
      const block = editor.api.node({ id: blockId, at: [] });
      if (block?.[0]) {
        const blockType = block[0].type as string;
        // Hide for image elements (they use layout floating toolbar)
        if (blockType === "img" || blockType === ANTV_INFOGRAPHIC) {
          return true;
        }

        if (BLOCKS.some((block) => block.type === blockType)) {
          return true;
        }
      }
    }

    return false;
  }, [hasBlockSelection, selectedIds, editor]);

  const floatingToolbarState = useFloatingToolbarState({
    editorId,
    focusedEditorId,
    hideToolbar: isLayoutBlockSelected || isFloatingLinkOpen || isAIChatOpen,
    // Override the default behavior to show toolbar when blocks are selected
    enableBlockSelection: true,
    ...state,
    floatingOptions: {
      middleware: [
        offset(12),
        flip({
          fallbackPlacements: [
            "top-start",
            "top-end",
            "bottom-start",
            "bottom-end",
          ],
          padding: 12,
        }),
      ],
      placement: "top",
      strategy: "fixed",
      ...state?.floatingOptions,
    },
  });

  const {
    clickOutsideRef,
    hidden,
    props: rootProps,
    ref: floatingRef,
  } = useFloatingToolbar(floatingToolbarState);

  const ref = useComposedRef<HTMLDivElement>(props.ref, floatingRef);

  // Show toolbar if blocks are selected, even if normally hidden
  if (hidden && !hasBlockSelection) return null;

  return (
    <div ref={clickOutsideRef}>
      <Toolbar
        {...props}
        {...rootProps}
        ref={ref}
        className={cn(
          "z-99999 scrollbar-hide overflow-x-auto rounded-md border bg-popover p-1 whitespace-nowrap opacity-100 shadow-md print:hidden",
          "max-w-[80vw]",
          className,
        )}
      >
        {children}
      </Toolbar>
    </div>
  );
}
