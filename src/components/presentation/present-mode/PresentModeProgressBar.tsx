"use client";

import { usePresentModeOrientation } from "@/hooks/presentation/usePresentModeOrientation";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";

interface PresentModeProgressBarProps {
  slideIds: string[];
}

export function PresentModeProgressBar({
  slideIds,
}: PresentModeProgressBarProps) {
  const isPresenting = usePresentationState((s) => s.isPresenting);
  const currentSlideId = usePresentationState((s) => s.currentSlideId);
  const setCurrentSlideId = usePresentationState((s) => s.setCurrentSlideId);
  const { shouldForceLandscape, forcedLandscapeProgressSide } =
    usePresentModeOrientation(isPresenting);

  if (slideIds.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-1001 m-0!",
        shouldForceLandscape
          ? forcedLandscapeProgressSide === "right"
            ? "top-1 right-1 bottom-1"
            : "top-1 bottom-1 left-1"
          : "right-1 bottom-0.5 left-1",
      )}
    >
      <div
        className={cn(
          "flex gap-1",
          shouldForceLandscape
            ? "h-full w-1.5 flex-col-reverse"
            : "h-1.5 w-full",
        )}
      >
        {slideIds.map((slideId, index) => (
          <button
            key={slideId}
            className={cn(
              "rounded-full transition-all",
              shouldForceLandscape ? "w-full flex-1" : "h-full flex-1",
              slideId === currentSlideId
                ? "bg-primary shadow-2xs"
                : "bg-white/20 hover:bg-white/40",
            )}
            onClick={() => setCurrentSlideId(slideId)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
