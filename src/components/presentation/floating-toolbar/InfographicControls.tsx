"use client";

import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  type LucideIcon,
  Minus,
  Pencil,
  Plus,
  Split,
  WandSparkles,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { EditWithAI } from "./EditWithAI";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/plate/ui/dropdown-menu";
import { ToolbarButton, ToolbarGroup } from "@/components/plate/ui/toolbar";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/ui/color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import {
  parseInfographicPalette,
  parseInfographicStylize,
  updateInfographicTheme,
} from "@/components/notebook/presentation/editor/utils/infographic-utils";
import { useToolbarContext } from "./ToolbarContext";

type PaletteOption = {
  id: string;
  label: string;
  value: string | string[] | null;
};

const PALETTE_OPTIONS: PaletteOption[] = [
  { id: "classic", label: "Prism", value: "antv" },
  {
    id: "bloom",
    label: "Bloom",
    value: ["#61DDAA", "#F6BD16", "#F08BB4"],
  },
  {
    id: "ember",
    label: "Ember",
    value: ["#F08BB4", "#F6BD16", "#D588F0"],
  },
  {
    id: "tide",
    label: "Tide",
    value: ["#5B8FF9", "#5AD8A6", "#5D7092"],
  },
];

function useToolbarPressAction(action: () => void) {
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      action();
    },
    [action],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      action();
    },
    [action],
  );

  return {
    onMouseDown: handleMouseDown,
    onKeyDown: handleKeyDown,
  };
}

function InfographicActionButton({
  icon: Icon,
  label,
  tooltip,
  pressed,
  className,
  action,
}: {
  icon: LucideIcon;
  label?: string;
  tooltip: string;
  pressed?: boolean;
  className?: string;
  action: () => void;
}) {
  const actionProps = useToolbarPressAction(action);

  return (
    <ToolbarButton
      type="button"
      tooltip={tooltip}
      pressed={pressed}
      size="sm"
      className={className}
      {...actionProps}
    >
      <Icon
        className={cn("h-4 w-4", pressed && label == null && "fill-current")}
      />
      {label ? <span className="text-xs">{label}</span> : null}
    </ToolbarButton>
  );
}

export function InfographicControls() {
  const {
    element,
    handleNodePropertyUpdate,
    isInfographicElement,
    handleOpenInfographicEditor,
  } = useToolbarContext();

  const [openPaletteDropdown, setOpenPaletteDropdown] = useState(false);
  const [openAIEditPopover, setOpenAIEditPopover] = useState(false);

  const [customPalette, setCustomPalette] = useState<string[]>([
    "#5B8FF9",
    "#5AD8A6",
    "#F6BD16",
  ]);

  const currentAlignment =
    (element as { align?: "left" | "center" | "right" } | undefined)?.align ??
    "center";

  const handleAlignmentChange = useCallback(
    (value: string) => {
      handleNodePropertyUpdate("align", value);
    },
    [handleNodePropertyUpdate],
  );

  // Get current state from syntax
  const currentSyntax =
    (element as { syntax?: string } | undefined)?.syntax ?? "";

  const currentStylize = useMemo(
    () => parseInfographicStylize(currentSyntax),
    [currentSyntax],
  );

  const currentPalette = useMemo(
    () => parseInfographicPalette(currentSyntax),
    [currentSyntax],
  );

  const currentThemeStyle =
    currentStylize === "rough" ? "hand-drawn" : "default";

  const currentPaletteId = useMemo(() => {
    if (!currentPalette) return "classic";
    const paletteEntry = PALETTE_OPTIONS.find((option) => {
      if (typeof option.value === "string")
        return option.value === currentPalette;
      if (Array.isArray(option.value) && Array.isArray(currentPalette)) {
        return option.value.join(",") === currentPalette.join(",");
      }
      return false;
    });
    return paletteEntry?.id ?? "custom";
  }, [currentPalette]);

  const currentPaletteColors = useMemo(() => {
    if (currentPaletteId === "custom") return customPalette.slice(0, 3);
    const option = PALETTE_OPTIONS.find((o) => o.id === currentPaletteId);
    if (!option || !option.value) return ["currentColor"];
    if (typeof option.value === "string")
      return ["#5B8FF9", "#5AD8A6", "#5D7092"]; // Fallback for 'antv' named theme
    return option.value.slice(0, 3);
  }, [currentPaletteId, customPalette]);

  const handleThemeStyleToggle = useCallback(() => {
    if (!currentSyntax) return;
    const newStylize = currentThemeStyle === "hand-drawn" ? null : "rough";
    const newSyntax = updateInfographicTheme(currentSyntax, {
      stylize: newStylize,
    });
    handleNodePropertyUpdate("syntax", newSyntax);
  }, [currentSyntax, currentThemeStyle, handleNodePropertyUpdate]);

  const handlePaletteChange = useCallback(
    (value: string) => {
      if (!currentSyntax) return;
      if (value === "custom") {
        const newSyntax = updateInfographicTheme(currentSyntax, {
          palette: customPalette,
        });
        handleNodePropertyUpdate("syntax", newSyntax);
        return;
      }
      const palette = PALETTE_OPTIONS.find(
        (option) => option.id === value,
      )?.value;
      const newSyntax = updateInfographicTheme(currentSyntax, {
        palette: palette ?? null,
      });
      handleNodePropertyUpdate("syntax", newSyntax);
    },
    [currentSyntax, customPalette, handleNodePropertyUpdate],
  );

  const handleCustomColorChange = useCallback(
    (index: number, color: string) => {
      setCustomPalette((prev) => {
        const newPalette = [...prev];
        newPalette[index] = color;
        return newPalette;
      });
    },
    [],
  );

  const addCustomColor = useCallback(() => {
    setCustomPalette((prev) => [...prev, "#888888"]);
  }, []);

  const removeCustomColor = useCallback((index: number) => {
    setCustomPalette((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const applyCustomPalette = useCallback(() => {
    if (!currentSyntax) return;
    const newSyntax = updateInfographicTheme(currentSyntax, {
      palette: customPalette,
    });
    handleNodePropertyUpdate("syntax", newSyntax);
    setOpenPaletteDropdown(false);
  }, [currentSyntax, customPalette, handleNodePropertyUpdate]);

  const handleAISyntaxChange = useCallback(
    (newSyntax: string) => {
      handleNodePropertyUpdate("syntax", newSyntax);
    },
    [handleNodePropertyUpdate],
  );

  if (!isInfographicElement) return null;

  return (
    <ToolbarGroup className="gap-1.5 px-0.5">
      {/* Edit Infographic Button - Opens sidebar for template conversion */}
      <ToolbarGroup>
        <InfographicActionButton
          icon={Split}
          label="Change"
          tooltip="Edit Infographic"
          className="gap-1"
          action={handleOpenInfographicEditor}
        />
      </ToolbarGroup>
      {/* Alignment Dropdown */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <ToolbarButton tooltip="Alignment" size="sm">
            {currentAlignment === "left" && <AlignLeft className="h-4 w-4" />}
            {currentAlignment === "center" && (
              <AlignCenter className="h-4 w-4" />
            )}
            {currentAlignment === "right" && <AlignRight className="h-4 w-4" />}
          </ToolbarButton>
        </DropdownMenuTrigger>
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

      <Separator orientation="vertical" className="mx-0.5 h-5 bg-border/60" />

      {/* Style Toggle */}
      <InfographicActionButton
        icon={Pencil}
        pressed={currentThemeStyle === "hand-drawn"}
        action={handleThemeStyleToggle}
        tooltip={
          currentThemeStyle === "hand-drawn"
            ? "Switch to standard"
            : "Switch to hand-drawn"
        }
        className={cn(
          "h-7 w-7 p-0 transition-all",
          currentThemeStyle === "hand-drawn" &&
            "bg-primary/10 text-primary hover:bg-primary/20",
        )}
      />

      <Separator orientation="vertical" className="mx-0.5 h-5 bg-border/60" />

      {/* Palette Picker */}
      <DropdownMenu
        open={openPaletteDropdown}
        onOpenChange={setOpenPaletteDropdown}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <ToolbarButton
            isDropdown
            tooltip="Adjust colors"
            className="w-auto gap-1.5 px-2"
          >
            <div className="mr-0.5 flex items-center -space-x-1.5">
              {currentPaletteColors.slice(0, 3).map((color, i) => (
                <div
                  key={i}
                  className="h-3.5 w-3.5 rounded-full border border-background shadow-xs ring-1 ring-border/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="ignore-click-outside/toolbar w-64 scroll-smooth rounded-xl border-border/50 bg-background/95 p-2 shadow-xl backdrop-blur-xl"
          align="start"
          side="top"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Color Palette
          </DropdownMenuLabel>
          <div className="mb-2 grid grid-cols-1 gap-1">
            {PALETTE_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onSelect={() => handlePaletteChange(option.id)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2",
                  currentPaletteId === option.id &&
                    "bg-accent text-accent-foreground",
                )}
              >
                <span className="text-sm font-medium">{option.label}</span>
                {option.value && (
                  <div className="flex gap-1">
                    {(Array.isArray(option.value)
                      ? option.value
                      : ["#5B8FF9", "#5AD8A6", "#5D7092"]
                    )
                      .slice(0, 5)
                      .map((color, i) => (
                        <div
                          key={i}
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </div>

          <Separator className="my-2 bg-border/50" />

          <div className="px-2 pb-1">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Custom Colors
              </span>
              {currentPaletteId === "custom" && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  Active
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {customPalette.map((color, index) => (
                  <div key={index} className="group relative">
                    <ColorPicker
                      value={color}
                      onChange={(value) =>
                        handleCustomColorChange(index, value)
                      }
                    >
                      <button
                        type="button"
                        className="h-6 w-6 rounded-full border border-border shadow-xs transition-transform hover:scale-110 focus:ring-2 focus:ring-primary/50 focus:outline-hidden"
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${index + 1}`}
                      />
                    </ColorPicker>
                    {customPalette.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeCustomColor(index)}
                        className="absolute -top-1 -right-1 hidden h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-xs group-hover:flex"
                      >
                        <Minus className="h-2 w-2" />
                      </button>
                    )}
                  </div>
                ))}

                {customPalette.length < 10 && (
                  <button
                    type="button"
                    onClick={addCustomColor}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-muted-foreground/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="flex w-full gap-2 pt-1">
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 w-full text-xs"
                  onClick={applyCustomPalette}
                >
                  Apply Custom Palette
                </Button>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-0.5 h-5 bg-border/60" />

      {/* Edit with AI */}
      <Popover open={openAIEditPopover} onOpenChange={setOpenAIEditPopover}>
        <PopoverTrigger asChild>
          <ToolbarButton
            tooltip="Edit with AI"
            className={cn(
              "h-7 gap-1.5 px-2 text-xs font-medium",
              openAIEditPopover && "bg-primary/10 text-primary",
            )}
          >
            <WandSparkles className="h-3.5 w-3.5" />
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverContent
          className="ignore-click-outside/toolbar w-auto rounded-xl border-border/50 bg-background/95 p-0 shadow-xl backdrop-blur-xl"
          align="start"
          sideOffset={8}
        >
          <EditWithAI
            currentSyntax={currentSyntax}
            onSyntaxChange={handleAISyntaxChange}
            onClose={() => setOpenAIEditPopover(false)}
          />
        </PopoverContent>
      </Popover>
    </ToolbarGroup>
  );
}
