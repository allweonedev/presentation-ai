"use client";

import { Button } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { X } from "lucide-react";
import { InfographicEditorControls } from "./InfographicEditorControls";

export function InfographicEditorPanel() {
  const closeInfographicEditor = usePresentationState(
    (s) => s.closeInfographicEditor,
  );
  const currentSlideId = usePresentationState((s) => s.currentSlideId);

  if (!currentSlideId) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col border-l bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-sm font-semibold">Infographic Editor</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeInfographicEditor}
          className="size-8 rounded-full p-0"
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <InfographicEditorControls />
      </div>
    </div>
  );
}
