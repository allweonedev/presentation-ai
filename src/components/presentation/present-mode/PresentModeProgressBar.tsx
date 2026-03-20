"use client";

import { usePresentationState } from "@/states/presentation-state";

interface PresentModeProgressBarProps {
  slideIds: string[];
}

export function PresentModeProgressBar({
  slideIds,
}: PresentModeProgressBarProps) {
  const currentSlideId = usePresentationState((s) => s.currentSlideId);
  const setCurrentSlideId = usePresentationState((s) => s.setCurrentSlideId);

  if (slideIds.length === 0) return null;

  return (
    <div className="fixed right-1 bottom-0.5 left-1 z-1001 m-0!">
      <div className="flex h-1.5 w-full gap-1">
        {slideIds.map((slideId, index) => (
          <button
            key={slideId}
            className={`h-full flex-1 rounded-full transition-all ${
              slideId === currentSlideId
                ? "bg-primary shadow-xs"
                : "bg-white/20 hover:bg-white/40"
            }`}
            onClick={() => setCurrentSlideId(slideId)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
