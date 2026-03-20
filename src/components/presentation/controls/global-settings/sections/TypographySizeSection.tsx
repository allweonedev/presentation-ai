"use client";

import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { RiFontSize } from "react-icons/ri";
import { useCommonValues } from "../hooks/useCommonValues";
import { useUpdateAllSlides } from "../hooks/useUpdateAllSlides";

export function TypographySizeSection() {
  const { currentFontSize } = useCommonValues();
  const updateAllSlides = useUpdateAllSlides();

  return (
    <div className="space-y-2">
      <Label
        htmlFor="font-size"
        className="flex items-center gap-2 text-sm font-semibold text-foreground"
      >
        <RiFontSize className="h-4 w-4 text-muted-foreground" />
        Font Size
      </Label>

      <ToggleGroup
        id="font-size"
        type="single"
        value={currentFontSize}
        onValueChange={(val) =>
          val && updateAllSlides({ fontSize: val as "S" | "M" | "L" })
        }
        className="w-full gap-2 rounded-full"
      >
        <ToggleGroupItem
          value="S"
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 border-border transition-all",
            currentFontSize === "S" &&
              "border-primary bg-primary text-primary-foreground",
          )}
        >
          S
        </ToggleGroupItem>
        <ToggleGroupItem
          value="M"
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 border-border transition-all",
            currentFontSize === "M" &&
              "border-primary bg-primary text-primary-foreground",
          )}
        >
          M
        </ToggleGroupItem>
        <ToggleGroupItem
          value="L"
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 border-border transition-all",
            currentFontSize === "L" &&
              "border-primary bg-primary text-primary-foreground",
          )}
        >
          L
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
