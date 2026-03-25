"use client";

import { useDraggable } from "@/components/notebook/presentation/editor/dnd/hooks/useDraggable";
import {
  type LayoutType,
  type PlateSlide,
  type RootImage,
} from "@/components/notebook/presentation/utils/parser";
import { type ImageCropSettings } from "@/components/notebook/presentation/utils/types";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { usePresentationState } from "@/states/presentation-state";
import { DndPlugin, type DragItemNode } from "@platejs/dnd";
import { ImagePlugin } from "@platejs/media/react";
import { useEditorRef } from "platejs/react";
import { useCallback, useId, useMemo } from "react";
import { type DragSourceMonitor } from "react-dnd";

export const BASE_WIDTH_PERCENTAGE = "45%";
export const BASE_HEIGHT = 384;

// Min and max size constraints
export const MIN_WIDTH_PERCENTAGE = 20; // 20% of parent width
export const MAX_WIDTH_PERCENTAGE = 80; // 80% of parent width
export const MIN_HEIGHT = 200; // 200px minimum height
export const MAX_HEIGHT = 800; // 800px maximum height

type UseRootImageActionsOptions = {
  image?: RootImage;
  layoutType?: LayoutType | string;
  slideId?: string;
};

export function useRootImageActions(
  slideId: string,
  options: UseRootImageActionsOptions = {},
) {
  const { image, layoutType } = options;

  const setSlides = usePresentationState((s) => s.setSlides);
  const startRootImageGeneration = usePresentationState(
    (s) => s.startRootImageGeneration,
  );
  const rootImageGeneration = usePresentationState(
    (s) => s.rootImageGeneration,
  );
  const { saveImmediately } = useDebouncedSave();

  const editor = useEditorRef();

  const size = useMemo(
    () => ({
    w: image?.size?.w ?? undefined,
    h: image?.size?.h ?? undefined,
    }),
    [image?.size?.h, image?.size?.w],
  );

  const computedGen = useMemo(
    () => (slideId ? rootImageGeneration[slideId] : undefined),
    [rootImageGeneration, slideId],
  );
  const computedImageUrl = useMemo(() => {
    // If it's an embed, return the embed URL directly
    if (image?.embedType) {
      return image.url;
    }
    // Otherwise, use the generated or existing image URL
    return computedGen?.url ?? image?.url;
  }, [computedGen?.url, image?.url, image?.embedType]);

  // Get crop settings from image or use defaults
  const cropSettings: ImageCropSettings = useMemo(
    () =>
      image?.cropSettings || {
        objectFit: "cover",
        objectPosition: { x: 50, y: 50 },
        zoom: 1,
      },
    [image?.cropSettings],
  );

  // Derived styles
  const imageStyles: React.CSSProperties = useMemo(
    () => ({
      objectFit: cropSettings.objectFit,
      objectPosition: `${cropSettings.objectPosition.x}% ${cropSettings.objectPosition.y}%`,
      transform: `scale(${cropSettings.zoom ?? 1})`,
      transformOrigin: `${cropSettings.objectPosition.x}% ${cropSettings.objectPosition.y}%`,
      height: "100%",
      width: "100%",
      display: "block",
    }),
    [cropSettings],
  );

  const sizeStyle: React.CSSProperties = useMemo(() => {
    if (!size.h && !size.w) {
      if (layoutType === "vertical") {
        return { height: BASE_HEIGHT, width: "100%" } as const;
      }
      return { width: BASE_WIDTH_PERCENTAGE } as const;
    }
    if (layoutType === "vertical") {
      return { height: size.h ?? BASE_HEIGHT, width: "100%" } as const;
    }
    return { width: size.w ?? BASE_WIDTH_PERCENTAGE, height: "auto" } as const;
  }, [layoutType, size.h, size.w]);

  const updateCropSettings = useCallback(
    (settings: ImageCropSettings) => {
      const { slides } = usePresentationState.getState();
      const updatedSlides = slides.map((slide: PlateSlide) => {
        if (slide.id === slideId) {
          return {
            ...slide,
            rootImage: {
              ...slide.rootImage!,
              cropSettings: settings,
            },
          };
        }
        return slide;
      });
      setSlides(updatedSlides);
      setTimeout(() => {
        void saveImmediately();
      }, 100);
    },
    [saveImmediately, setSlides, slideId],
  );

  const replaceImageUrl = useCallback(
    (url: string, query: string) => {
      const { slides } = usePresentationState.getState();
      const resetCrop: ImageCropSettings = {
        objectFit: "cover",
        objectPosition: { x: 50, y: 50 },
        zoom: 1,
      };
      const updatedSlides = slides.map((slide: PlateSlide) => {
        if (slide.id === slideId) {
          return {
            ...slide,
            rootImage: {
              ...(slide.rootImage ?? { query }),
              url,
              cropSettings: resetCrop,
            },
          };
        }
        return slide;
      });
      setSlides(updatedSlides);
      void saveImmediately();
    },
    [saveImmediately, setSlides, slideId],
  );

  const removeRootImage = useCallback(
    (matchUrls?: string[]) => {
      const { slides, clearRootImageGeneration } =
        usePresentationState.getState();
      const updatedSlides = slides.map((slide: PlateSlide) => {
        if (slide.id === slideId) {
          if (!slide.rootImage) return slide;
          if (matchUrls && !matchUrls.includes(slide.rootImage.url ?? "")) {
            return slide;
          }
          const { rootImage: _rootImage, ...rest } = slide as PlateSlide & {
            rootImage?: PlateSlide["rootImage"];
          };
          if (slideId) {
            clearRootImageGeneration(slideId);
          }
          return rest as PlateSlide;
        }
        return slide;
      });
      setSlides(updatedSlides);
    },
    [setSlides, slideId],
  );

  const removeRootImageFromSlide = useCallback(() => {
    // For charts (no URL), remove without URL matching
    if (image?.chartType && !image?.url) {
      removeRootImage();
    } else {
      const urls = [image?.url, computedImageUrl].filter((u): u is string =>
        Boolean(u),
      );
      removeRootImage(urls);
    }
  }, [computedImageUrl, image?.url, image?.chartType, removeRootImage]);

  const updateRootImageSize = useCallback(
    (newSize: { w?: string; h?: number }) => {
      const { slides } = usePresentationState.getState();
      const updatedSlides = slides.map((slide: PlateSlide) => {
        if (slide.id === slideId) {
          return {
            ...slide,
            rootImage: {
              ...slide.rootImage!,
              size: {
                ...slide.rootImage?.size,
                ...newSize,
              },
            },
          };
        }
        return slide;
      });
      setSlides(updatedSlides);
      void saveImmediately();
    },
    [setSlides, slideId],
  );

  // Resizable handler logic moved here
  const onResizeStop = useCallback(
    (
      _e: unknown,
      _direction: unknown,
      _ref: HTMLElement,
      d: { width: number; height: number },
    ) => {
      if (layoutType === "vertical") {
        const nextHeight = (size?.h ?? BASE_HEIGHT) + d.height;
        // Enforce min/max height constraints
        const constrainedHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, nextHeight),
        );
        updateRootImageSize({ h: constrainedHeight });
      } else {
        const parentElementRect = _ref.parentElement!.getBoundingClientRect();
        const parentWidth = parentElementRect.width;
        const width = parseFloat(size?.w ?? BASE_WIDTH_PERCENTAGE);
        const originalWidth = parentWidth * (width / 100);
        const changeInWidth = d.width;
        const newWidth = originalWidth + changeInWidth;
        const newWidthPercentage = (newWidth / parentWidth) * 100;
        // Enforce min/max width percentage constraints
        const constrainedWidthPercentage = Math.max(
          MIN_WIDTH_PERCENTAGE,
          Math.min(MAX_WIDTH_PERCENTAGE, newWidthPercentage),
        );
        const nextWidth = `${constrainedWidthPercentage}%`;
        updateRootImageSize({ w: nextWidth });
      }
    },
    [layoutType, size?.h, size?.w, updateRootImageSize],
  );

  // Drag-and-drop logic moved here
  const id = useId();
  const dragElement = useMemo(() => {
    // If it's a chart, create a chart drag element
    if (image?.chartType && image?.chartData) {
      return {
        id: id,
        type: image.chartType,
        data: image.chartData,
        variant: image.chartOptions?.variant,
        children: [{ text: "" }],
      };
    }
    // Otherwise, create an image drag element
    return {
      id: id,
      type: ImagePlugin.key,
      url: computedImageUrl,
      query: image?.query,
      cropSettings: cropSettings,
      children: [{ text: "" }],
    };
  }, [
    computedImageUrl,
    cropSettings,
    id,
    image?.query,
    image?.chartType,
    image?.chartData,
    image?.chartOptions?.variant,
  ]);

  const onDragEnd = useCallback(
    (_item: DragItemNode, monitor: DragSourceMonitor) => {
      const dropResult: { droppedInLayoutZone: boolean } =
        monitor.getDropResult()!;
      if (monitor.didDrop() && !dropResult?.droppedInLayoutZone) {
        // Remove the entire root image (including layout) when dragging to editor
        removeRootImageFromSlide();
      }
      editor.setOption(DndPlugin, "isDragging", false);
    },
    [editor, removeRootImageFromSlide],
  );

  const { isDragging, handleRef } = useDraggable({
    element: dragElement,
    drag: { end: onDragEnd },
  });

  return {
    // Derived data
    computedGen,
    computedImageUrl,
    cropSettings,
    imageStyles,
    sizeStyle,
    isDragging,
    handleRef,

    // Actions
    startRootImageGeneration,
    updateCropSettings,
    replaceImageUrl,
    removeRootImage,
    removeRootImageFromSlide,
    updateRootImageSize,
    onResizeStop,
    dragId: id,
  };
}
