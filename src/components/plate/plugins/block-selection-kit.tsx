/** biome-ignore-all lint/suspicious/noExplicitAny: This use requires any */
"use client";

import * as React from "react";

import {
  BlockSelectionAfterEditable,
  BlockSelectionPlugin,
} from "@platejs/selection/react";
import { getPluginTypes, KEYS } from "platejs";
import { useEditorRef, usePluginOption } from "platejs/react";

import { BlockSelection } from "@/components/plate/ui/block-selection";

function BlockSelectionFocusBridge() {
  const editor = useEditorRef();
  const selectedIds = usePluginOption(BlockSelectionPlugin, "selectedIds");
  const isSelectionAreaVisible = usePluginOption(
    BlockSelectionPlugin,
    "isSelectionAreaVisible",
  );

  React.useEffect(() => {
    if (!selectedIds || selectedIds.size === 0 || isSelectionAreaVisible) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      editor.getApi(BlockSelectionPlugin).blockSelection.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [editor, isSelectionAreaVisible, selectedIds]);

  return null;
}

export const BlockSelectionKit = [
  BlockSelectionPlugin.configure(({ editor }) => ({
    options: {
      enableContextMenu: false,
      isSelectable: (element) => {
        return !getPluginTypes(editor, [
          KEYS.column,
          KEYS.codeLine,
          KEYS.table,
          KEYS.td,
        ]).includes(element.type);
      },
    },
    render: {
      afterEditable: () => (
        <>
          <BlockSelectionAfterEditable />
          <BlockSelectionFocusBridge />
        </>
      ),
      belowRootNodes: (props) => {
        if (!props.attributes.className?.includes("slate-selectable"))
          return null;

        return <BlockSelection {...(props as any)} />;
      },
    },
  })),
];
