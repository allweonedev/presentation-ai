"use client";

import { Button } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { X } from "lucide-react";
import { ChartEditorControls } from "./ChartEditorControls";

export function ChartEditorPanel() {
  const closeChartEditor = usePresentationState((s) => s.closeChartEditor);
  const currentSlideId = usePresentationState((s) => s.currentSlideId);

  if (!currentSlideId) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col border-l bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-sm font-semibold">Chart Editor</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeChartEditor}
          className="size-8 rounded-full p-0"
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ChartEditorControls slideId={currentSlideId} />
      </div>
    </div>
  );
}
