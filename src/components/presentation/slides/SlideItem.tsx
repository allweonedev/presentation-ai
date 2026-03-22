"use client";

import { SlideGenerationProvider } from "@/components/notebook/presentation/editor/context/SlideGenerationContext";
import PresentationEditor from "@/components/notebook/presentation/editor/presentation-editor";
import StaticPresentationEditor from "@/components/notebook/presentation/editor/presentation-editor-static";
import { SlideWrapper } from "@/components/presentation/slides/SlideWrapper";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import React from "react";

interface SlideItemProps {
  slideId: string;
  isGeneratingPresentation: boolean;
  slidesCount: number;
  isReadOnly?: boolean;
  forceLandscapePresentMode?: boolean;
  forceLandscapeRotationDeg?: 90 | -90;
}

/**
 * SlideItem fetches its own slide data from the store.
 * This isolates re-renders: only this component re-renders when its slide changes.
 */
export const SlideItem = React.memo(function SlideItem({
  slideId,
  isGeneratingPresentation,
  slidesCount,
  isReadOnly = false,
  forceLandscapePresentMode = false,
  forceLandscapeRotationDeg = -90,
}: SlideItemProps) {
  // Each slide item fetches its own data - stable reference unless THIS slide changes
  const slide = usePresentationState((s) =>
    s.slides.find((slide) => slide.id === slideId),
  );
  const isPresenting = usePresentationState((s) => s.isPresenting);
  const currentSlideId = usePresentationState((s) => s.currentSlideId);
  const setCurrentSlideId = usePresentationState((s) => s.setCurrentSlideId);

  if (!slide) return null;

  return (
    <div className={`slide-wrapper slide-wrapper-${slide.id} w-full`}>
      <SlideGenerationProvider>
        <SlideWrapper
          id={slide.id}
          slideWidth={slide.width}
          slidesCount={slidesCount}
          isReadOnly={isReadOnly}
          forceLandscapePresentMode={forceLandscapePresentMode}
          forceLandscapeRotationDeg={forceLandscapeRotationDeg}
        >
          <div
            className={cn(`slide-container-${slide.id}`)}
            onClickCapture={() => setCurrentSlideId(slide.id)}
          >
            {isGeneratingPresentation ? (
              <StaticPresentationEditor
                initialContent={slide}
                className={cn(
                  "min-h-[300px] rounded-md border",
                  !isPresenting &&
                    slide.id === currentSlideId &&
                    "border-primary ring-4! ring-primary ring-offset-2!",
                )}
                id={slide.id}
              />
            ) : (
              <PresentationEditor
                initialContent={slide}
                className={cn(
                  "min-h-[300px] rounded-md border",
                  !isPresenting &&
                    slide.id === currentSlideId &&
                    "border-primary ring-2! ring-primary",
                )}
                id={slide.id}
                isGenerating={isGeneratingPresentation}
                readOnly={isReadOnly || isPresenting}
              />
            )}
          </div>
        </SlideWrapper>
      </SlideGenerationProvider>
    </div>
  );
});
