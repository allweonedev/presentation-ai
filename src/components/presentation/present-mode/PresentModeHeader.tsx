"use client";

import { Button } from "@/components/ui/button";
import { usePresentationRecordingState } from "@/states/presentation-recording-state";
import { usePresentationState } from "@/states/presentation-state";

interface PresentModeHeaderProps {
  showHeader: boolean;
  presentationTitle: string | null;
}

export function PresentModeHeader({
  showHeader,
  presentationTitle,
}: PresentModeHeaderProps) {
  return (
    <div
      className={`fixed top-0 right-0 left-0 z-1000 transition-all duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-xs">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-white">
              {presentationTitle}
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => {
                usePresentationState.getState().setIsPresenting(false);
                usePresentationState.getState().setIsPresentingLoading(false);
                usePresentationState.getState().resetPresentingScaleLocks();
                usePresentationRecordingState
                  .getState()
                  .setWantsToRecord(false);
              }}
            >
              Exit Presentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
