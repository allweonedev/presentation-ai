"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { type DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

import { LayoutPreviewSheet } from "./LayoutPreviewSheet";
import { ToolbarProvider, useToolbarContext } from "./ToolbarContext";

// Sub-components
import { AlignmentControl } from "./AlignmentControl";
import { ChartControls } from "./ChartControls";
import { ColorControl } from "./ColorControl";
import { ColumnSizeSlider } from "./ColumnSizeSlider";
import { DeleteButton } from "./DeleteButton";
import { ElementTypeSelector } from "./ElementTypeSelector";
import { ImageControls } from "./ImageControls";
import { InfographicControls } from "./InfographicControls";
import { OrientationControl } from "./OrientationControl";
import { SidednessControl } from "./SidednessControl";
import { ToggleControls } from "./ToggleControls";

function ToolbarContent() {
  const { element, isImageElement, isInfographicElement } = useToolbarContext();

  // For image elements, only show ImageControls
  if (isImageElement) {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <ImageControls />
        </div>
      </TooltipProvider>
    );
  }

  // For infographic elements, only show InfographicControls
  if (isInfographicElement) {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <InfographicControls />
          <DeleteButton />
        </div>
      </TooltipProvider>
    );
  }

  // For other elements, show the full toolbar
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <ElementTypeSelector />
        <OrientationControl />
        <SidednessControl />
        <ToggleControls />
        <ColumnSizeSlider />
        <ChartControls />
        <ColorControl />
        <AlignmentControl />
        <DeleteButton />

        {/* Layout Preview Sheet */}
        <LayoutPreviewSheet currentElement={element} />
      </div>
    </TooltipProvider>
  );
}

export function LayoutFloatingToolbarButtons(_props: DropdownMenuProps) {
  return (
    <ToolbarProvider>
      <ToolbarContent />
    </ToolbarProvider>
  );
}
