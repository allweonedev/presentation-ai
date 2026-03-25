"use client";

import { usePresentationNavigation } from "@/hooks/presentation/usePresentationNavigation";
import { usePresentModeOrientation } from "@/hooks/presentation/usePresentModeOrientation";
import { usePresentationSlides } from "@/hooks/presentation/usePresentationSlides";
import { useSlideOperations } from "@/hooks/presentation/useSlideOperations";
import { usePresentingLoadingGate } from "@/hooks/presentation/usePresentingLoadingGate";
import { useSlideChangeWatcher } from "@/hooks/presentation/useSlideChangeWatcher";
import { usePresentationState } from "@/states/presentation-state";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Presentation } from "lucide-react";
import { PlateController } from "platejs/react";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import {
  PresentModeHeader,
  PresentModePhoneOverlay,
  PresentModeProgressBar,
} from "../present-mode";
import { SlideItem } from "./SlideItem";

interface SlidesContainerProps {
  isGeneratingPresentation: boolean;
  isReadOnly?: boolean;
}

export const SlidesContainer = ({
  isGeneratingPresentation,
  isReadOnly = false,
}: SlidesContainerProps) => {
  const isPresenting = usePresentationState((s) => s.isPresenting);
  const isPresentingLoading = usePresentationState(
    (s) => s.isPresentingLoading,
  );
  const presentingScaleLocks = usePresentationState(
    (s) => s.presentingScaleLocks,
  );
  const setIsPresentingLoading = usePresentationState(
    (s) => s.setIsPresentingLoading,
  );
  const currentPresentationTitle = usePresentationState(
    (s) => s.currentPresentationTitle,
  );
  const shouldShowExitHeader = usePresentationState(
    (s) => s.shouldShowExitHeader,
  );

  const { slideIds, items, sensors, handleDragStart, handleDragEnd } =
    usePresentationSlides();
  const { addFirstSlide } = useSlideOperations();

  useSlideChangeWatcher({
    debounceDelay: 600,
    enabled: !isGeneratingPresentation && !isReadOnly,
  });

  usePresentationNavigation();
  const {
    isPhoneViewport,
    shouldForceLandscape,
    forcedLandscapeRotationDeg,
  } =
    usePresentModeOrientation(isPresenting);

  const slidesCount = slideIds.length;

  usePresentingLoadingGate({
    isPresenting,
    isPresentingLoading,
    slideIds,
    presentingScaleLocks,
    setIsPresentingLoading,
    clearDelayMs: 150,
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <PresentModeHeader
          presentationTitle={currentPresentationTitle}
          showHeader={isPresenting && shouldShowExitHeader}
        />
        <PlateController>
          {isGeneratingPresentation && slidesCount === 0 && (
            <div className="aspect-video w-full">
              <Skeleton className="h-full w-full"></Skeleton>
            </div>
          )}
          {!isGeneratingPresentation &&
            !isPresenting &&
            slidesCount === 0 &&
            !isReadOnly && (
            <div className="mx-auto w-full max-w-5xl">
              <div className="relative flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/85 p-8 text-center shadow-xs">
                <div className="absolute inset-5 rounded-xl border border-dashed border-border/50" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <span className="rounded-full border border-border/70 bg-muted/70 p-3">
                    <Presentation className="size-6 text-muted-foreground" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-base font-semibold">No slides yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start this presentation by adding your first slide.
                    </p>
                  </div>
                  <Button
                    onClick={() => addFirstSlide()}
                    className="gap-2"
                    size="sm"
                  >
                    <Plus className="size-4" />
                    Add first slide
                  </Button>
                </div>
              </div>
            </div>
          )}
          {slideIds.map((slideId) => (
            <SlideItem
              key={slideId}
              slideId={slideId}
              isGeneratingPresentation={isGeneratingPresentation}
              slidesCount={slidesCount}
              isReadOnly={isReadOnly}
              forceLandscapePresentMode={isPresenting && shouldForceLandscape}
              forceLandscapeRotationDeg={forcedLandscapeRotationDeg}
            />
          ))}

          {isPresenting && (
            <PresentModePhoneOverlay
              slideIds={slideIds}
              isPhoneViewport={isPhoneViewport}
            />
          )}
          {isPresenting && <PresentModeProgressBar slideIds={slideIds} />}
        </PlateController>
      </SortableContext>
    </DndContext>
  );
};
