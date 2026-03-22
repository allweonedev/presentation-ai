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
import { type MyEditor } from "@/components/plate/editor-kit";
import {
  useFloatingToolbar,
  useFloatingToolbarState,
} from "@/components/plate/hooks/use-floating-toolbar";
import { Toolbar } from "@/components/plate/ui/toolbar";

export function LayoutFloatingToolbar({
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

  // Check if floating UI elements are open
  const isFloatingLinkOpen = !!usePluginOption({ key: KEYS.link }, "mode");
  const isAIChatOpen = usePluginOption({ key: KEYS.aiChat }, "open");

  // Get current selection
  const selectedIds = usePluginOption(BlockSelectionPlugin, "selectedIds");
  const hasBlockSelection = selectedIds && selectedIds.size > 0;

  // Check if selected blocks are layout blocks or image elements
  const isLayoutBlockSelected = React.useMemo(() => {
    if (!hasBlockSelection || !selectedIds) return false;

    // Check if any of the selected blocks are layout blocks or images
    for (const blockId of selectedIds) {
      const block = editor.api.node({ id: blockId, at: [] });
      if (block?.[0]) {
        const blockType = block[0].type as string;
        // Layout toolbar owns image and infographic blocks
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

  // Configure floating toolbar state
  const floatingToolbarState = useFloatingToolbarState({
    editorId,
    focusedEditorId,
    hideToolbar: !isLayoutBlockSelected || isFloatingLinkOpen || isAIChatOpen,
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

  // Get floating toolbar props
  const {
    clickOutsideRef,
    hidden,
    props: rootProps,
    ref: floatingRef,
  } = useFloatingToolbar(floatingToolbarState);

  const ref = useComposedRef<HTMLDivElement>(props.ref, floatingRef);

  // Match the shared floating toolbar behavior: keep the wrapper mounted
  // while block selection still exists so interactions don't collapse it
  // more aggressively than the standard floating toolbar.
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
