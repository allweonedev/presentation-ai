"use client";

import { cn } from "@/lib/utils";
import { GripVertical, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useLayoutEffect, useState } from "react";

import { Resizable } from "@/components/ui/resizable";
import { usePresentationSlides } from "@/hooks/presentation/usePresentationSlides";
import { usePresentationState } from "@/states/presentation-state";
import StaticPresentationEditor from "../../notebook/presentation/editor/presentation-editor-static";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import { SlideThumbnail } from "./SlideThumbnail";

const SIDEBAR_WIDTH_STORAGE_KEY = "presentation-sidebar-width";
const DEFAULT_SIDEBAR_WIDTH = 150;

interface SlideSidebarProps {
  onSlideClick?: (slideId: string) => void;
  currentSlideId?: string;
  showSidebar?: boolean;
  variant?: "docked" | "sheet";
  className?: string;
}

function SlideSidebarBase({
  onSlideClick,
  currentSlideId: currentSlideIdProp,
  showSidebar = true,
  variant = "docked",
  className,
}: SlideSidebarProps) {
  // Only subscribe to slide IDs to prevent re-render when content changes
  // shallow ensures array comparison is shallow (same values = no re-render)
  const slideIds = usePresentationState((s) =>
    s.slides.map((slide) => slide.id),
  );
  const slidesCount = slideIds.length;
  const stateCurrentSlideId = usePresentationState((s) => s.currentSlideId);
  const setCurrentSlideId = usePresentationState((s) => s.setCurrentSlideId);
  const isSidebarCollapsed = usePresentationState((s) => s.isSidebarCollapsed);
  const setIsSidebarCollapsed = usePresentationState(
    (s) => s.setIsSidebarCollapsed,
  );
  const isGeneratingPresentation = usePresentationState(
    (s) => s.isGeneratingPresentation,
  );
  const effectiveCurrentSlideId =
    typeof currentSlideIdProp === "string"
      ? currentSlideIdProp
      : stateCurrentSlideId;
  const isSheetVariant = variant === "sheet";

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const { scrollToSlide } = usePresentationSlides();

  // Load sidebar width from localStorage on mount
  useLayoutEffect(() => {
    if (isSheetVariant) {
      return;
    }

    const stored = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!Number.isNaN(parsed) && parsed >= 100 && parsed <= 300) {
        setSidebarWidth(parsed);
      }
    }
  }, [isSheetVariant]);

  const handleSlideClick = useCallback(
    (slideId: string) => {
      setCurrentSlideId(slideId);
      scrollToSlide(slideId);
      onSlideClick?.(slideId);
    },
    [onSlideClick, scrollToSlide, setCurrentSlideId],
  );

  const handleResize = useCallback(
    (_e: unknown, _direction: unknown, _ref: unknown, d: { width: number }) => {
      setSidebarWidth((prev) => {
        const newWidth = prev + d.width;
        localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, newWidth.toString());
        return newWidth;
      });
    },
    [],
  );

  const slideList = (
    <div
      className={
        isSheetVariant
          ? "scrollbar-thin h-full overflow-auto pr-1 scrollbar-thumb-muted scrollbar-track-transparent"
          : "scrollbar-thin h-max max-h-[80dvh] overflow-auto scrollbar-thumb-muted scrollbar-track-transparent"
      }
    >
      <div className="flex flex-col space-y-4 p-4">
        {!isSheetVariant && (
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Slides</h2>

            <Button
              onClick={() => setIsSidebarCollapsed(true)}
              variant="ghost"
              size="sm"
            >
              <PanelRightOpen className="size-3" />
            </Button>
          </div>
        )}
        <div className="flex flex-col space-y-4">
          {isGeneratingPresentation && slidesCount === 0 && (
            <div className="aspect-video w-full">
              <Skeleton className="h-full w-full"></Skeleton>
            </div>
          )}
          {slideIds.map((slideId, index) => (
            <MemoPreviewItem
              key={slideId}
              index={index}
              isActive={effectiveCurrentSlideId === slideId}
              onClick={handleSlideClick}
              slideId={slideId}
              containerWidth={isSheetVariant ? undefined : sidebarWidth - 32}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (isSheetVariant) {
    if (!showSidebar) {
      return null;
    }

    return (
      <div
        className={cn(
          "pointer-events-none fixed top-1/2 left-3 z-40 flex -translate-y-1/2 justify-start",
          className,
        )}
      >
        {isSidebarCollapsed ? (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto"
          >
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="rounded-2xl border border-border/70 bg-background/95 px-3 py-4 shadow-lg backdrop-blur-sm"
              aria-label="Open slides sidebar"
            >
              <PanelLeftOpen className="size-5 text-primary" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex h-[min(60dvh,32rem)] w-[min(11rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-3 py-2.5">
              <h2 className="text-sm font-semibold">Slides</h2>
              <Button
                onClick={() => setIsSidebarCollapsed(true)}
                variant="ghost"
                size="sm"
                className="size-8"
              >
                <PanelRightOpen className="size-4" />
              </Button>
            </div>
            <div className="min-h-0 flex-1">{slideList}</div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        className
          ? `flex h-full items-center ${className}`
          : "flex h-full items-center"
      }
    >
      <div className="flex h-full items-center">
        <AnimatePresence>
          {showSidebar && !isSidebarCollapsed && (
            <motion.div
              initial={{
                scale: 1,
                width: "auto",
                opacity: 1,
                x: "-100%",
                originX: 0.5,
                originY: 0.5,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                scale: 0,
                width: 0,
                opacity: 0,
                originX: 0.5,
                originY: 0.5,
              }}
              transition={{
                duration: 0.35,
                opacity: { duration: 0.25 },
              }}
              className="overflow-hidden"
            >
              <Resizable
                size={{ width: sidebarWidth }}
                minWidth={100}
                maxWidth={300}
                enable={{ right: true }}
                onResizeStop={handleResize}
                handleComponent={{
                  right: (
                    <div className="group/resize relative flex h-full w-1 cursor-col-resize bg-border">
                      <GripVertical className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-muted-foreground opacity-0 group-hover/resize:opacity-100" />
                    </div>
                  ),
                }}
              >
                {slideList}
              </Resizable>
            </motion.div>
          )}
        </AnimatePresence>

        {showSidebar && isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: "0.5rem" }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              opacity: { duration: 0.4, delay: 0.1 },
            }}
          >
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="rounded-md border border-(--presentation-primary) px-1 py-2"
            >
              <PanelLeftOpen className="size-5 text-sm" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// moved to hooks/presentation/previewSignature

const MemoPreviewItem = React.memo(
  function PreviewItem({
    index,
    isActive,
    onClick,
    slideId,
    containerWidth,
  }: {
    index: number;
    isActive: boolean;
    onClick: (slideId: string) => void;
    slideId: string;
    containerWidth?: number;
  }) {
    // Each item fetches its own slide - stable reference unless THIS slide changes
    const slide = usePresentationState((s) =>
      s.slides.find((slide) => slide.id === slideId),
    );

    const handleClick = useCallback(() => onClick(slideId), [onClick, slideId]);

    if (!slide) return null;

    const effectiveContainerWidth =
      typeof containerWidth === "number"
        ? containerWidth -
          ((slide.formatCategory ?? "presentation") === "social" ? 8 : 0)
        : undefined;

    return (
      <SlideThumbnail
        index={index} // For showing the slide number
        isActive={isActive}
        onClick={handleClick}
        widthSize={(slide.width ?? "M") as "S" | "M" | "L"}
        formatCategory={slide.formatCategory ?? "presentation"}
        aspectRatio={slide.aspectRatio ?? { type: "fluid" }}
        containerWidth={effectiveContainerWidth}
      >
        <StaticPresentationEditor
          initialContent={slide}
          className="border"
          id={`preview-${slideId}`}
        />
      </SlideThumbnail>
    );
  },
  (prev, next) => {
    if (prev.index !== next.index) return false;
    if (prev.isActive !== next.isActive) return false;
    if (prev.slideId !== next.slideId) return false;
    if (prev.containerWidth !== next.containerWidth) return false;
    // Note: We don't need to compare slide anymore since each item fetches its own
    // and React will re-render when the selector returns a new reference
    return true;
  },
);

export const SlideSidebar = React.memo(SlideSidebarBase);
