"use client";

import { Palette, RotateCcw } from "lucide-react";

import { ToolbarButton, ToolbarGroup } from "@/components/plate/ui/toolbar";
import ColorPicker from "@/components/ui/color-picker";
import { useToolbarContext } from "./ToolbarContext";

export function ColorControl() {
  const { element, currentColor, handleNodePropertyUpdate } =
    useToolbarContext();

  const hasCustomColor = (element as { color?: string })?.color !== undefined;

  return (
    <ToolbarGroup>
      <ColorPicker
        value={currentColor}
        onChange={(color) => {
          handleNodePropertyUpdate("color", color);
        }}
      >
        <ToolbarButton
          tooltip="Choose Accent Color"
          size="sm"
          className="gap-1"
        >
          <Palette className="h-4 w-4" />
          <span>Color</span>
        </ToolbarButton>
      </ColorPicker>

      {/* Reset Color Button */}
      {hasCustomColor && (
        <ToolbarButton
          onClick={() => {
            handleNodePropertyUpdate("color", undefined);
          }}
          tooltip="Reset to Theme Color"
          size="sm"
          className="gap-1"
        >
          <RotateCcw className="h-4 w-4" />
        </ToolbarButton>
      )}
    </ToolbarGroup>
  );
}
