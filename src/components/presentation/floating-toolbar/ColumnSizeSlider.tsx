"use client";

import { Columns3 } from "lucide-react";

import { getColumnSizeLabel } from "@/components/notebook/presentation/editor/lib";
import { ToolbarGroup } from "@/components/plate/ui/toolbar";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToolbarContext } from "./ToolbarContext";

export function ColumnSizeSlider() {
  const {
    supportsColumnSizeControl,
    currentColumnSize,
    columnSizeOptions,
    handleNodePropertyUpdate,
  } = useToolbarContext();

  if (!supportsColumnSizeControl) {
    return null;
  }

  return (
    <ToolbarGroup className="flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-2">
            <Columns3 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[
                columnSizeOptions.indexOf(currentColumnSize) !== -1
                  ? columnSizeOptions.indexOf(currentColumnSize)
                  : 1,
              ]}
              onValueChange={(values) => {
                const value = values[0];
                if (
                  typeof value === "number" &&
                  value >= 0 &&
                  value < columnSizeOptions.length
                ) {
                  const newColumnSize = columnSizeOptions[value];
                  if (newColumnSize) {
                    handleNodePropertyUpdate("columnSize", newColumnSize);
                  }
                }
              }}
              max={columnSizeOptions.length - 1}
              step={1}
              className="w-20 [data-slider-thumb]:size-3!"
            />
          </div>
        </TooltipTrigger>

        <TooltipContent>
          <p>Column Size ({getColumnSizeLabel(currentColumnSize)})</p>
        </TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  );
}
