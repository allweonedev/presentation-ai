"use client";

import ColorPicker from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { useState } from "react";
import { useCommonValues } from "../hooks/useCommonValues";
import { useUpdateAllSlides } from "../hooks/useUpdateAllSlides";

export function BackgroundSection() {
  const { currentBgColor } = useCommonValues();
  const updateAllSlides = useUpdateAllSlides();
  const [hexInput, setHexInput] = useState(currentBgColor || "");

  console.log(currentBgColor);
  // To sync input if color is changed outside
  // but simple usage is ok for now - set on color picker change also
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    // only set if it looks like a valid hex
    const validHex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    if (validHex.test(val)) {
      updateAllSlides({ bgColor: val });
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Label
        htmlFor="background-color"
        className="flex items-center gap-2 text-sm font-semibold text-foreground"
      >
        <Palette className="h-4 w-4 text-muted-foreground" />
        Background Color
      </Label>
      <div className="flex items-center gap-3">
        <ColorPicker
          value={currentBgColor}
          onChange={(color) => {
            updateAllSlides({ bgColor: color });
            setHexInput(color);
          }}
        />
        <Input
          className="w-28 rounded border border-border bg-background px-2 py-1 text-xs focus:border-primary focus:outline-hidden"
          value={hexInput}
          onChange={handleHexChange}
          placeholder="#RRGGBB"
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
