"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePresentationState } from "@/states/presentation-state";
import { Check } from "lucide-react";

const ZOOM_LEVELS = [
  { value: 1.8, label: "180%" },
  { value: 1.7, label: "170%" },
  { value: 1.6, label: "160%" },
  { value: 1.5, label: "150%" },
  { value: 1.4, label: "140%" },
  { value: 1.3, label: "130%" },
  { value: 1.2, label: "120%" },
  { value: 1.1, label: "110%" },
  { value: 1, label: "100%" },
  { value: 0.9, label: "90%" },
  { value: 0.8, label: "80%" },
  { value: 0.7, label: "70%" },
  { value: 0.6, label: "60%" },
  { value: 0.5, label: "50%" },
];

export function ZoomControl() {
  const zoomLevel = usePresentationState((s) => s.zoomLevel);
  const setZoomLevel = usePresentationState((s) => s.setZoomLevel);

  const displayPercentage = Math.round(zoomLevel * 100);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-full border border-primary/10 px-2 text-xs"
        >
          {displayPercentage}%
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-28">
        {ZOOM_LEVELS.map((level) => (
          <DropdownMenuItem
            key={level.value}
            className="flex items-center justify-between"
            onClick={() => setZoomLevel(level.value)}
          >
            <span>{level.label}</span>
            {zoomLevel === level.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-between"
          onClick={() => setZoomLevel(1)}
        >
          <span>Fit</span>
          {zoomLevel === 1 && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
