"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Pencil,
  Trash2Icon,
} from "lucide-react";
import { useRemoveNodeButton } from "platejs/react";

import { Button } from "@/components/plate/ui/button";
import { Separator } from "@/components/plate/ui/separator";
import { ToolbarButton, ToolbarGroup } from "@/components/plate/ui/toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToolbarContext } from "./ToolbarContext";

export function ImageControls() {
  const { element, isImageElement, handleOpenImageEditor, editor } =
    useToolbarContext();

  // Get remove button props for the current element
  const { props: removeButtonProps } = useRemoveNodeButton({
    element: element as Parameters<typeof useRemoveNodeButton>[0]["element"],
  });

  // Get current alignment from element
  const currentAlignment =
    (element as { align?: "left" | "center" | "right" } | undefined)?.align ??
    "center";

  // Update alignment
  const handleAlignmentChange = (value: string) => {
    if (!element) return;
    const path = editor.api.findPath(
      element as unknown as Parameters<typeof editor.api.findPath>[0],
    );
    if (path) {
      editor.tf.setNodes({ align: value }, { at: path });
    }
  };

  // Only show for image elements
  if (!isImageElement) {
    return null;
  }

  return (
    <ToolbarGroup>
      {/* Edit Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <ToolbarButton
            onClick={() => handleOpenImageEditor("generate")}
            size="sm"
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Edit
          </ToolbarButton>
        </TooltipTrigger>
        <TooltipContent>Edit Image</TooltipContent>
      </Tooltip>

      {/* Alignment Dropdown */}
      <DropdownMenu modal={false}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <ToolbarButton size="sm">
                {currentAlignment === "left" && (
                  <AlignLeft className="h-4 w-4" />
                )}
                {currentAlignment === "center" && (
                  <AlignCenter className="h-4 w-4" />
                )}
                {currentAlignment === "right" && (
                  <AlignRight className="h-4 w-4" />
                )}
              </ToolbarButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Alignment</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={currentAlignment}
            onValueChange={handleAlignmentChange}
            className="ignore-click-outside/toolbar"
          >
            <DropdownMenuRadioItem value="left">
              <AlignLeft className="mr-2 h-4 w-4" />
              Left
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="center">
              <AlignCenter className="mr-2 h-4 w-4" />
              Center
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">
              <AlignRight className="mr-2 h-4 w-4" />
              Right
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Delete Button */}
      <Button size="sm" variant="ghost" {...removeButtonProps}>
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </ToolbarGroup>
  );
}
