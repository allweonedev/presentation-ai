"use client";

import * as React from "react";

import { BlockSelectionPlugin } from "@platejs/selection/react";
import { HighlighterIcon } from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef, useEditorSelector } from "platejs/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/plate/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/plate/ui/tooltip";
import { cn } from "@/lib/utils";

import {
  ToolbarSplitButton,
  ToolbarSplitButtonPrimary,
  ToolbarSplitButtonSecondary,
} from "./toolbar";

// Default yellow highlight color
const DEFAULT_HIGHLIGHT_COLOR = "#FEFF00";

// Highlight color options - lighter/pastel colors suitable for highlighting
const HIGHLIGHT_COLORS = [
  {
    isBrightColor: true,
    name: "yellow",
    value: "#FEFF00",
  },
  {
    isBrightColor: true,
    name: "light yellow",
    value: "#FFF2CC",
  },
  {
    isBrightColor: true,
    name: "light orange",
    value: "#FCE4CD",
  },
  {
    isBrightColor: true,
    name: "light green",
    value: "#D9EAD3",
  },
  {
    isBrightColor: true,
    name: "light cyan",
    value: "#D0DFE3",
  },
  {
    isBrightColor: true,
    name: "light blue",
    value: "#CFE1F3",
  },
  {
    isBrightColor: true,
    name: "light purple",
    value: "#D9D2E9",
  },
  {
    isBrightColor: true,
    name: "light pink",
    value: "#EAD1DB",
  },
  {
    isBrightColor: false,
    name: "orange",
    value: "#F9CB9C",
  },
  {
    isBrightColor: false,
    name: "green",
    value: "#B7D6A8",
  },
  {
    isBrightColor: false,
    name: "cyan",
    value: "#A1C4C9",
  },
  {
    isBrightColor: false,
    name: "blue",
    value: "#A4C2F4",
  },
  {
    isBrightColor: false,
    name: "purple",
    value: "#B5A7D5",
  },
  {
    isBrightColor: false,
    name: "pink",
    value: "#D5A6BD",
  },
  {
    isBrightColor: false,
    name: "red",
    value: "#EA9999",
  },
  {
    isBrightColor: false,
    name: "light red",
    value: "#F4CCCC",
  },
];

export function HighlightToolbarButton() {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const currentColor = useEditorSelector(
    (editor) => editor.api.mark(KEYS.backgroundColor) as string | undefined,
    [],
  );

  const isHighlighted = !!currentColor;

  const applyHighlight = React.useCallback(
    (color: string) => {
      const blockSelectionApi =
        editor.getApi(BlockSelectionPlugin).blockSelection;
      const selectedBlocks = blockSelectionApi
        ? blockSelectionApi.getNodes()
        : [];

      if (selectedBlocks.length > 0) {
        selectedBlocks.forEach(([_, path]) => {
          editor.tf.setNodes(
            { [KEYS.backgroundColor]: color },
            { at: path, match: (n) => editor.api.isText(n), mode: "all" },
          );
        });
        return;
      }

      if (editor.selection) {
        editor.tf.select(editor.selection);
        editor.tf.focus();
        editor.tf.addMarks({ [KEYS.backgroundColor]: color });
      }
    },
    [editor],
  );

  const removeHighlight = React.useCallback(() => {
    const blockSelectionApi =
      editor.getApi(BlockSelectionPlugin).blockSelection;
    const selectedBlocks = blockSelectionApi
      ? blockSelectionApi.getNodes()
      : [];

    if (selectedBlocks.length > 0) {
      selectedBlocks.forEach(([_, path]) => {
        editor.tf.unsetNodes(KEYS.backgroundColor, {
          at: path,
          match: (n) => editor.api.isText(n),
          mode: "all",
        });
      });
      return;
    }

    if (editor.selection) {
      editor.tf.select(editor.selection);
      editor.tf.focus();
      editor.tf.removeMarks(KEYS.backgroundColor);
    }
  }, [editor]);

  const handlePrimaryClick = React.useCallback(() => {
    if (isHighlighted) {
      removeHighlight();
    } else {
      applyHighlight(DEFAULT_HIGHLIGHT_COLOR);
    }
  }, [isHighlighted, applyHighlight, removeHighlight]);

  const handleColorSelect = React.useCallback(
    (color: string) => {
      applyHighlight(color);
      setOpen(false);
    },
    [applyHighlight],
  );

  return (
    <ToolbarSplitButton pressed={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolbarSplitButtonPrimary
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            onClick={handlePrimaryClick}
            data-state={isHighlighted ? "on" : "off"}
          >
            <HighlighterIcon className="size-4" />
          </ToolbarSplitButtonPrimary>
        </TooltipTrigger>
        <TooltipContent>Highlight</TooltipContent>
      </Tooltip>

      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <ToolbarSplitButtonSecondary />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="ignore-click-outside/toolbar p-2"
          align="start"
          alignOffset={-32}
        >
          <TooltipProvider>
            <div className="grid grid-cols-4 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <Tooltip key={color.value}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "size-6 rounded border transition-transform hover:scale-110",
                        color.isBrightColor
                          ? "border-muted"
                          : "border-transparent",
                        currentColor === color.value &&
                          "ring-2 ring-primary ring-offset-1",
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorSelect(color.value)}
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="capitalize">
                    {color.name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            {currentColor && (
              <button
                type="button"
                className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-muted px-2 py-1 text-xs hover:bg-muted"
                onClick={() => {
                  removeHighlight();
                  setOpen(false);
                }}
              >
                Remove highlight
              </button>
            )}
          </TooltipProvider>
        </DropdownMenuContent>
      </DropdownMenu>
    </ToolbarSplitButton>
  );
}
