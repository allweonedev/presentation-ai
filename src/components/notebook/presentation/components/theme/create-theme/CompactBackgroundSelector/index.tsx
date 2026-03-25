"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ban, ImageIcon, PaintBucket, Palette } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CompactColorGrid } from "./CompactColorGrid";
import { CompactGradientGrid } from "./CompactGradientGrid";
import { CompactImageSelector } from "./CompactImageSelector";
import {
  type BackgroundType,
  type CompactBackgroundSelectorProps,
  type LinearPreset,
} from "./types";

export function CompactBackgroundSelector({
  value,
  onChange,
}: CompactBackgroundSelectorProps) {
  // Determine current background type
  const derivedType: BackgroundType = useMemo(() => {
    if (!value || !value.type) return "none";
    if (value.type === "image") return "image";
    if (value.type === "linear" || value.type === "radial") return "gradient";
    return "solid";
  }, [value]);

  const [activeType, setActiveType] = useState<BackgroundType>(derivedType);

  useEffect(() => {
    setActiveType(derivedType);
  }, [derivedType]);

  // Handle background type change
  const handleTypeChange = useCallback(
    (type: BackgroundType) => {
      setActiveType(type);
      if (type === "none") {
        // Use null to explicitly clear the value, avoiding react-hook-form default value fallback
        onChange?.(null);
      }
    },
    [onChange],
  );

  // Handle solid color selection
  const handleSolidColorChange = useCallback(
    (color: string) => {
      setActiveType("solid");
      onChange?.({
        type: "solid",
        override: color,
      });
    },
    [onChange],
  );

  // Handle gradient selection
  const handleGradientChange = useCallback(
    (preset: LinearPreset) => {
      setActiveType("gradient");
      onChange?.({
        type: "linear",
        override: preset.css,
        gradient: {
          type: "linear",
          ...preset.gradient,
        },
      });
    },
    [onChange],
  );

  return (
    <div className="space-y-4">
      {/* Background Type Selector */}
      <Select
        key={activeType}
        value={activeType}
        onValueChange={(v) => handleTypeChange(v as BackgroundType)}
      >
        <SelectTrigger className="h-10 w-full border-input bg-background">
          <SelectValue placeholder="Select background type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <div className="flex items-center gap-2">
              <Ban className="size-4 text-muted-foreground" />
              <span>None</span>
            </div>
          </SelectItem>
          <SelectItem value="solid">
            <div className="flex items-center gap-2">
              <PaintBucket className="size-4 text-muted-foreground" />
              <span>Solid Color</span>
            </div>
          </SelectItem>
          <SelectItem value="gradient">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-muted-foreground" />
              <span>Gradient</span>
            </div>
          </SelectItem>
          <SelectItem value="image">
            <div className="flex items-center gap-2">
              <ImageIcon className="size-4 text-muted-foreground" />
              <span>Image</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Content Area */}
      <div className="min-h-[200px]">
        {activeType === "solid" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <CompactColorGrid
                selected={value?.override}
                onPick={handleSolidColorChange}
              />
            </div>
          </div>
        )}

        {activeType === "gradient" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <CompactGradientGrid onPick={handleGradientChange} />
            </div>
          </div>
        )}

        {activeType === "image" && (
          <div className="space-y-4">
            <CompactImageSelector value={value} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
}
