"use client";

import { ListOrdered, MinusIcon } from "lucide-react";

import { ToolbarButton, ToolbarGroup } from "@/components/plate/ui/toolbar";
import { useToolbarContext } from "./ToolbarContext";

export function ToggleControls() {
  const {
    supportsNumberedControl,
    supportsShowLineControl,
    currentNumbered,
    currentShowLine,
    handleNodePropertyUpdate,
  } = useToolbarContext();

  if (!supportsNumberedControl && !supportsShowLineControl) {
    return null;
  }

  return (
    <>
      {/* Numbered Control */}
      {supportsNumberedControl && (
        <ToolbarGroup>
          <ToolbarButton
            pressed={currentNumbered}
            onClick={() => {
              handleNodePropertyUpdate("numbered", !currentNumbered);
            }}
            tooltip="Toggle Numbered"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>
      )}

      {/* Show Line Control */}
      {supportsShowLineControl && (
        <ToolbarGroup>
          <ToolbarButton
            pressed={currentShowLine}
            onClick={() => {
              handleNodePropertyUpdate("showLine", !currentShowLine);
            }}
            tooltip="Toggle Show Line"
          >
            <MinusIcon className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>
      )}
    </>
  );
}
