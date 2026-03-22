"use client";

import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { MdOutlineWidthFull } from "react-icons/md";
import { useCommonValues } from "../hooks/useCommonValues";
import { useUpdateAllSlides } from "../hooks/useUpdateAllSlides";

export function WidthSection() {
  const { currentWidth } = useCommonValues();
  const updateAllSlides = useUpdateAllSlides();

  return (
    <div className="space-y-2">
      <Label
        htmlFor="card-width"
        className="flex items-center gap-2 text-sm font-semibold text-foreground"
      >
        <MdOutlineWidthFull className="h-4 w-4 text-muted-foreground" />
        Card Width
      </Label>
      <ToggleGroup
        id="card-width"
        type="single"
        variant="outline"
        value={currentWidth}
        onValueChange={(val) =>
          val && updateAllSlides({ width: val as "S" | "M" | "L" })
        }
        className="w-full gap-2 rounded-full"
      >
        <ToggleGroupItem
          value="S"
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 border-border transition-all",
            currentWidth === "S" &&
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
            currentWidth === "M" &&
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
            currentWidth === "L" &&
              "border-primary bg-primary text-primary-foreground",
          )}
        >
          L
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
