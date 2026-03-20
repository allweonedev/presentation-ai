"use client";

import {
  CATEGORY_ICONS,
  ELEMENT_CATEGORIES,
} from "@/components/notebook/presentation/editor/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/plate/ui/dropdown-menu";
import { ToolbarButton, ToolbarGroup } from "@/components/plate/ui/toolbar";
import * as React from "react";
import { useToolbarContext } from "./ToolbarContext";

export function ElementTypeSelector() {
  const [open, setOpen] = React.useState(false);
  const {
    editor,
    element,
    elementType,
    availableOptionsGrouped,
    selectedOption,
    isCurrentElementChart,
    handleLayoutChange,
  } = useToolbarContext();

  return (
    <ToolbarGroup>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <ToolbarButton
            className="min-w-[125px]"
            pressed={open}
            tooltip="Change Element Type"
            isDropdown
          >
            {selectedOption}
          </ToolbarButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="ignore-click-outside/toolbar w-80 min-w-0"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            editor.tf.focus();
          }}
          align="start"
        >
          <div className="border-b border-border p-3">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Change Element Type
            </p>
          </div>

          <div className="scrollbar-thin max-h-96 overflow-y-auto p-2 scrollbar-thumb-primary scrollbar-track-primary/20">
            <div className="space-y-1">
              {/* For charts: show compatible charts directly without submenu */}
              {isCurrentElementChart ? (
                <div className="grid grid-cols-2 gap-1">
                  {availableOptionsGrouped[ELEMENT_CATEGORIES.CHARTS]?.map(
                    (block) => {
                      const isSelected = block.type === elementType;
                      const IconComponent = block.icon;
                      return (
                        <DropdownMenuItem
                          key={block.type}
                          onClick={() => {
                            handleLayoutChange(block.type);
                            setOpen(false);
                          }}
                          className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {IconComponent}
                          <span className="flex-1 text-left">{block.name}</span>
                          {isSelected && (
                            <span className="text-xs font-bold">✓</span>
                          )}
                        </DropdownMenuItem>
                      );
                    },
                  )}
                </div>
              ) : (
                /* For non-charts: use categories with submenus */
                Object.entries(availableOptionsGrouped).map(
                  ([category, elements]) => (
                    <DropdownMenuSub key={category}>
                      <DropdownMenuSubTrigger className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-accent hover:text-accent-foreground">
                        {CATEGORY_ICONS[category]}
                        <span className="flex-1 text-left">{category}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-56">
                        <div className="space-y-1 p-1">
                          {elements.map((block) => {
                            const isSelected =
                              block.type === elementType &&
                              (!block.variant ||
                                (element as Record<string, unknown>)?.[
                                  block.key
                                ] === block.variant ||
                                (block.key === "isFunnel" &&
                                  ((element as Record<string, unknown>)
                                    ?.isFunnel
                                    ? "funnel"
                                    : "pyramid") === block.variant));

                            const IconComponent = block.icon;

                            return (
                              <DropdownMenuItem
                                key={`${block.type}-${block.variant || "default"}`}
                                onClick={() => {
                                  if (block.supportsOrientation) {
                                    handleLayoutChange(block.type, {
                                      orientation: "vertical",
                                    });
                                  } else if (block.variant && block.key) {
                                    const variantData = {
                                      [block.key]: block.variant,
                                    };
                                    handleLayoutChange(block.type, variantData);
                                  } else {
                                    handleLayoutChange(block.type);
                                  }
                                  setOpen(false);
                                }}
                                className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                                }`}
                              >
                                {IconComponent}
                                <span className="flex-1 text-left">
                                  {block.name}
                                </span>
                                {isSelected && (
                                  <span className="text-xs font-bold">✓</span>
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </div>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  ),
                )
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </ToolbarGroup>
  );
}
