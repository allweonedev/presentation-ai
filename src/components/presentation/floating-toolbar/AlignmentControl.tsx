"use client";

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

import { ToolbarButton, ToolbarGroup } from "@/components/plate/ui/toolbar";
import { useToolbarContext } from "./ToolbarContext";

export function AlignmentControl() {
  const {
    supportsAlignmentControl,
    currentAlignment,
    alignmentOptions,
    handleNodePropertyUpdate,
    isCurrentElementChart,
  } = useToolbarContext();

  // Don't show alignment controls for charts
  if (isCurrentElementChart) {
    return null;
  }

  // If element supports specific alignment options, use those
  if (supportsAlignmentControl) {
    return (
      <ToolbarGroup>
        {alignmentOptions.includes("left") && (
          <ToolbarButton
            onClick={() => {
              handleNodePropertyUpdate("alignment", "left");
            }}
            pressed={currentAlignment === "left"}
            tooltip="Align Left"
            size="sm"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
        )}
        {alignmentOptions.includes("center") && (
          <ToolbarButton
            onClick={() => {
              handleNodePropertyUpdate("alignment", "center");
            }}
            pressed={currentAlignment === "center"}
            tooltip="Align Center"
            size="sm"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
        )}
        {alignmentOptions.includes("right") && (
          <ToolbarButton
            onClick={() => {
              handleNodePropertyUpdate("alignment", "right");
            }}
            pressed={currentAlignment === "right"}
            tooltip="Align Right"
            size="sm"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
        )}
      </ToolbarGroup>
    );
  }

  // Default alignment controls for all elements
  return (
    <ToolbarGroup>
      <ToolbarButton
        onClick={() => {
          handleNodePropertyUpdate("alignment", "left");
        }}
        pressed={currentAlignment === "left"}
        tooltip="Align Left"
        size="sm"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          handleNodePropertyUpdate("alignment", "center");
        }}
        pressed={currentAlignment === "center"}
        tooltip="Align Center"
        size="sm"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          handleNodePropertyUpdate("alignment", "right");
        }}
        pressed={currentAlignment === "right"}
        tooltip="Align Right"
        size="sm"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
    </ToolbarGroup>
  );
}
