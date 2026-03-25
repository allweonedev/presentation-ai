"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { Play, X } from "lucide-react";

export function PresentButton() {
  const isPresenting = usePresentationState((s) => s.isPresenting);
  const setIsPresenting = usePresentationState((s) => s.setIsPresenting);
  const setIsPresentingLoading = usePresentationState(
    (s) => s.setIsPresentingLoading,
  );
  const resetPresentingScaleLocks = usePresentationState(
    (s) => s.resetPresentingScaleLocks,
  );
  const isGeneratingPresentation = usePresentationState(
    (s) => s.isGeneratingPresentation,
  );
  const isGeneratingOutline = usePresentationState(
    (s) => s.isGeneratingOutline,
  );

  // Check if generation is in progress
  const isGenerating = isGeneratingPresentation || isGeneratingOutline;
  const buttonLabel = isPresenting ? "Exit" : "Present";

  return (
    <Button
      type="button"
      size="sm"
      className={cn(
        "notranslate h-10 w-10 shrink-0 rounded-lg px-0 sm:h-9 sm:w-auto sm:rounded-md sm:gap-1.5 sm:px-3",
        isPresenting
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-purple-600 text-white hover:bg-purple-700",
        isGenerating && "cursor-not-allowed opacity-70",
      )}
      translate="no"
      aria-label={buttonLabel}
      onClick={() => {
        if (isGenerating) return;

        if (isPresenting) {
          setIsPresenting(false);
          setIsPresentingLoading(false);
          resetPresentingScaleLocks();
          return;
        }

        resetPresentingScaleLocks();
        setIsPresentingLoading(true);
        setIsPresenting(true);
      }}
      disabled={isGenerating}
    >
      {isPresenting ? (
        <>
          <X className="h-5 w-5 sm:mr-1 sm:h-4 sm:w-4" aria-hidden="true" />
          <span className="hidden sm:inline" translate="no">
            {buttonLabel}
          </span>
        </>
      ) : (
        <>
          <Play className="h-5 w-5 sm:mr-1 sm:h-4 sm:w-4" aria-hidden="true" />
          <span className="hidden sm:inline" translate="no">
            {buttonLabel}
          </span>
        </>
      )}
    </Button>
  );
}
