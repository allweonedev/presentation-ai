"use client";

import { ANTV_INFOGRAPHIC } from "@/components/notebook/presentation/editor/lib";
import { type TAntvInfographicElement } from "@/components/notebook/presentation/editor/plugins/antv-infographic-plugin";
import { MarkdownPlugin } from "@platejs/markdown";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { ZapIcon } from "lucide-react";
import { nanoid } from "platejs";
import { useEditorRef } from "platejs/react";
import { useCallback } from "react";

import { ToolbarButton } from "./toolbar";

export function TextToDiagramToolbarButton() {
  const editor = useEditorRef();

  const handleClick = useCallback(() => {
    // Try to get text from block selection first
    const blockSelectionApi =
      editor.getApi(BlockSelectionPlugin)?.blockSelection;
    const selectedBlocks = blockSelectionApi
      ? blockSelectionApi.getNodes()
      : [];
    const markdownApi = editor.getApi(MarkdownPlugin).markdown;

    let selectedText = "";

    if (selectedBlocks.length > 0) {
      selectedText = markdownApi.serialize({
        value: selectedBlocks.map(([node]) => node),
        withBlockId: true,
      });
    } else if (editor.selection) {
      selectedText = editor.api.string(editor.selection);

      if (!selectedText.trim()) {
        const block = editor.api.block({ at: editor.selection });

        if (block) {
          selectedText = markdownApi.serialize({
            value: [block[0]],
            withBlockId: true,
          });
        }
      }
    }

    if (!selectedText || selectedText.trim().length === 0) {
      return;
    }

    // Create the infographic element in loading state
    const infographicElement: TAntvInfographicElement = {
      type: ANTV_INFOGRAPHIC,
      id: nanoid(),
      syntax: "",
      isLoading: true,
      sourceText: selectedText,
      width: "100%",
      align: "center",
      children: [{ text: "" }],
    };

    if (selectedBlocks.length > 0) {
      // Insert after the last selected block
      const lastBlockPath = selectedBlocks[selectedBlocks.length - 1]![1];
      const insertPath = [lastBlockPath[0]! + 1];
      editor.tf.insertNodes(infographicElement, {
        at: insertPath,
      });

      // Clear the block selection after insertion
      editor.getApi(BlockSelectionPlugin)?.blockSelection.unselect();
    } else if (editor.selection) {
      // Insert after the current block
      const entry = editor.api.block();
      if (entry) {
        const [, path] = entry;
        editor.tf.insertNodes(infographicElement, {
          at: [path[0]! + 1],
        });
      } else {
        // Fallback: insert at selection
        editor.tf.insertNodes(infographicElement);
      }
    } else {
      // Insert at the end if no selection
      editor.tf.insertNodes(infographicElement);
    }
  }, [editor]);

  return (
    <ToolbarButton tooltip="Text to Diagram" onClick={handleClick}>
      <ZapIcon />
    </ToolbarButton>
  );
}
