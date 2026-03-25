"use client";

import * as React from "react";

import { type DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

import { BlockSelectionPlugin } from "@platejs/selection/react";
import { type NodeEntry, type TText } from "platejs";
import { useEditorRef } from "platejs/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/plate/ui/dropdown-menu";

import { ToolbarButton } from "./toolbar";

export function TextCaseToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const transformCase = (type: "uppercase" | "lowercase" | "titlecase") => {
    const blockSelectionApi =
      editor.getApi(BlockSelectionPlugin).blockSelection;
    const selectedBlocks = blockSelectionApi
      ? blockSelectionApi.getNodes()
      : [];

    console.log(selectedBlocks);

    if (selectedBlocks.length > 0) {
      editor.tf.withoutNormalizing(() => {
        selectedBlocks.forEach(([_node, path]) => {
          const entries = Array.from(
            editor.api.nodes({ at: path, match: (n) => editor.api.isText(n) }),
          ) as NodeEntry<TText>[];

          console.log(entries);
          entries.forEach(([textNode, textPath]) => {
            const text: string = (textNode.text as string) || "";
            if (!text) return;
            let transformedText = "";
            switch (type) {
              case "uppercase":
                transformedText = text.toUpperCase();
                break;
              case "lowercase":
                transformedText = text.toLowerCase();
                break;
              case "titlecase":
                transformedText = text.replace(
                  /\w\S*/g,
                  (txt: string) =>
                    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
                );
                break;
            }
            console.log(transformedText);

            editor.tf.insertText(transformedText, { at: textPath });
          });
        });
      });

      setOpen(false);
      return;
    }

    if (editor.selection) {
      const selectedText = editor.api.string(editor.selection);

      if (selectedText) {
        let transformedText = "";

        switch (type) {
          case "uppercase":
            transformedText = selectedText.toUpperCase();
            break;
          case "lowercase":
            transformedText = selectedText.toLowerCase();
            break;
          case "titlecase":
            transformedText = selectedText.replace(
              /\w\S*/g,
              (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
            );
            break;
        }

        editor.tf.select(editor.selection);
        editor.tf.focus();
        editor.tf.insertText(transformedText);
      }
    }
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Change case">
          <span className="text-sm font-bold">aA</span>
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="ignore-click-outside/toolbar min-w-[140px]"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => transformCase("uppercase")}>
            UPPERCASE
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => transformCase("lowercase")}>
            lowercase
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => transformCase("titlecase")}>
            Title Case
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
