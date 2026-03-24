"use client";

import { usePresentationTheme } from "@/components/presentation/providers/PresentationThemeProvider";
import { Button } from "@/components/ui/button";
import { useSlideContentScaling } from "@/hooks/presentation/useSlideContentScaling";
import { useSlideOperations } from "@/hooks/presentation/useSlideOperations";
import { themes } from "@/lib/presentation/themes";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import {
  getPresentModeOverlayClasses,
  getPresentModeSlideClasses,
} from "../present-mode";
import { SlideEditor } from "./SlideEditor";

interface SlideWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  isReadOnly?: boolean;
  slideWidth?: string;
  slidesCount?: number;
  forceLandscapePresentMode?: boolean;
  forceLandscapeRotationDeg?: 90 | -90;
}

export function SlideWrapper({
  children,
  id,
  className,
  isReadOnly = false,
  slideWidth,
  forceLandscapePresentMode = false,
  forceLandscapeRotationDeg = -90,
}: SlideWrapperProps) {
  const isPresenting = usePresentationState((s) => s.isPresenting);
  const isReorderingSlides = usePresentationState((s) => s.isReorderingSlides);
  const currentSlideId = usePresentationState((s) => s.currentSlideId);
  const currentSlide = usePresentationState((s) =>
    s.slides.find((slide) => slide.id === id),
  );
  const formatCategory = currentSlide?.formatCategory ?? "presentation";
  const aspectRatio = currentSlide?.aspectRatio ?? { type: "fluid" };
  const zoomLevel = usePresentationState((s) => s.zoomLevel);

  const presentationTheme = usePresentationState((s) => s.theme);
  const customThemeData = usePresentationState((s) => s.customThemeData);
  const pageBackground = usePresentationState((s) => s.pageBackground);
  const { resolvedTheme } = usePresentationTheme();
  const isDark = resolvedTheme === "dark";

  const themeBackground = useMemo((): string => {
    const themeData = customThemeData;
    const theme = presentationTheme;

    let currentTheme = themeData;
    if (!currentTheme && typeof theme === "string" && theme in themes) {
      currentTheme = themes[theme as keyof typeof themes];
    }

    const bgOverride = pageBackground.backgroundOverride;
    const themeBgOverride = currentTheme?.background?.override;

    if (typeof bgOverride === "string" && bgOverride) return bgOverride;
    if (typeof themeBgOverride === "string" && themeBgOverride)
      return themeBgOverride;
    return isDark ? "#0a0a0a" : "#ffffff";
  }, [
    customThemeData,
    presentationTheme,
    pageBackground.backgroundOverride,
    isDark,
  ]);

  const activeRightPanel = usePresentationState((s) => s.activeRightPanel);
  const isSidebarOpen = activeRightPanel !== null;
  const scalingConfig = useSlideContentScaling(
    (slideWidth ?? currentSlide?.width ?? "M") as "S" | "M" | "L",
    isPresenting,
    formatCategory,
    aspectRatio,
    undefined,
    zoomLevel,
  );
  const setPresentingScaleLock = usePresentationState(
    (s) => s.setPresentingScaleLock,
  );

  const { contentRef, scaledHeight } = scalingConfig;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: isPresenting || isReadOnly,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [dragTransparent, setDragTransparent] = React.useState(false);

  useEffect(() => {
    if (isDragging) {
      const timeout = setTimeout(() => {
        setDragTransparent(true);
      }, 200);
      return () => clearTimeout(timeout);
    }

    setDragTransparent(false);
  }, [isDragging]);

  useEffect(() => {
    if (!isPresenting) return;
    if (!scalingConfig.isScaleLocked) return;
    setPresentingScaleLock(id, true);
  }, [id, isPresenting, scalingConfig.isScaleLocked, setPresentingScaleLock]);

  const { addSlide, deleteSlide: deleteSlideWithId } = useSlideOperations();

  const deleteSlide = () => {
    deleteSlideWithId(id);
  };

  const presentWidth = Math.round(
    scalingConfig.slideWidth * Math.max(scalingConfig.scale, 0.1),
  );
  const editModeScaledWidth = Math.round(
    scalingConfig.slideWidth * Math.max(scalingConfig.scale, 0.1),
  );
  const forceLandscapeStageHeight = Math.max(presentWidth, 0);
  const forceLandscapeStageWidth = Math.max(
    0,
    Math.ceil(scalingConfig.contentHeight),
  );
  const shouldUseTallLandscapeStage =
    isPresenting &&
    forceLandscapePresentMode &&
    scalingConfig.contentHeight > forceLandscapeStageHeight;
  const shouldApplyForcedLandscape = isPresenting && forceLandscapePresentMode;
  const forceLandscapeRotationStyle = shouldApplyForcedLandscape
    ? shouldUseTallLandscapeStage && forceLandscapeRotationDeg === -90
      ? {
          position: "absolute" as const,
          top: `${forceLandscapeStageHeight}px`,
          left: "0",
          transform: `rotate(${forceLandscapeRotationDeg}deg)`,
          transformOrigin: "top left",
        }
      : shouldUseTallLandscapeStage
        ? {
            position: "absolute" as const,
            top: "0",
            left: `${forceLandscapeStageWidth}px`,
            transform: `rotate(${forceLandscapeRotationDeg}deg)`,
            transformOrigin: "top left",
          }
        : undefined
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        ...(scaledHeight ? { height: `${scaledHeight}px` } : {}),
        ...(isPresenting ? { background: themeBackground } : {}),
      }}
      className={cn(
        "group/card-container relative z-10 flex w-full flex-col pb-6",
        `slide-container-${id}`,
        isDragging && "z-50 opacity-50",
        dragTransparent && "opacity-30",
        isPresenting && getPresentModeOverlayClasses(formatCategory),
        isPresenting &&
          shouldApplyForcedLandscape &&
          (shouldUseTallLandscapeStage
            ? "overflow-auto overscroll-contain"
            : "overflow-x-auto overflow-y-hidden overscroll-x-contain"),
        id === currentSlideId && isPresenting && "z-999",
      )}
      {...attributes}
    >
      <div
        className={cn(
          "relative w-full",
          !isPresenting && !isSidebarOpen && "flex justify-center",
          isPresenting &&
            shouldUseTallLandscapeStage &&
            "min-h-full min-w-full",
        )}
      >
        <div
          className="relative"
          style={
            !isPresenting
              ? {
                  width: `${editModeScaledWidth}px`,
                  maxWidth: "100%",
                }
              : shouldApplyForcedLandscape
                ? shouldUseTallLandscapeStage
                  ? {
                      width: `${forceLandscapeStageWidth}px`,
                      minWidth: "100dvw",
                      height: `${forceLandscapeStageHeight}px`,
                      minHeight: "100dvh",
                    }
                  : {
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "100dvh",
                      height: "100dvw",
                      maxWidth: "none",
                      maxHeight: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `translate(-50%, -50%) rotate(${forceLandscapeRotationDeg}deg)`,
                      transformOrigin: "center center",
                    }
                : undefined
          }
        >
          <div
            className={cn(
              shouldUseTallLandscapeStage ? "absolute" : "relative",
            )}
            style={forceLandscapeRotationStyle}
          >
            <div
              ref={contentRef}
              className={cn(
                "relative origin-[top_left]",
                isPresenting && getPresentModeSlideClasses(formatCategory),
                className,
              )}
              style={{
                ...(!isPresenting && {
                  width: `${scalingConfig.slideWidth}px`,
                  transform: `scale(${scalingConfig.scale})`,
                }),
                ...(isPresenting && {
                  width: `${presentWidth}px`,
                  fontSize: `${scalingConfig.fontSize * scalingConfig.presentFitScale}px`,
                }),
                ...(isPresenting &&
                  shouldApplyForcedLandscape &&
                  !shouldUseTallLandscapeStage &&
                  formatCategory !== "social" && {
                    minHeight: "100dvw",
                  }),
              }}
            >
              {isReorderingSlides && !isPresenting && (
                <div className="absolute inset-0 z-101 cursor-grabbing bg-transparent" />
              )}

              {!isPresenting && !isReadOnly && (
                <div
                  className="absolute top-2 left-4 z-999999 flex opacity-0 transition-opacity duration-200 group-hover/card-container:opacity-100"
                  style={{
                    transform: `scale(${0.6 + 0.4 / scalingConfig.scale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <SlideEditor
                    slideId={id}
                    dragListeners={listeners}
                    onDuplicate={() => addSlide("after", id, currentSlide)}
                    onDelete={deleteSlide}
                  />
                </div>
              )}

              {children}
            </div>
          </div>
        </div>
      </div>

      {!isPresenting && !isReadOnly && (
        <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover/card-container:opacity-100">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-background shadow-md"
            onClick={() => addSlide("before", id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!isPresenting && !isReadOnly && (
        <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover/card-container:opacity-100">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-background shadow-md"
            onClick={() => addSlide("after", id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
