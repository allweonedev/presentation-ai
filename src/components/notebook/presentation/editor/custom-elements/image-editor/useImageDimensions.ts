import {
  BASE_HEIGHT,
  BASE_WIDTH_PERCENTAGE,
} from "@/hooks/presentation/useRootImageActions";
import { type TElement } from "platejs";
import { useEffect, useState } from "react";
import { type RootImage as RootImageType } from "../../../utils/parser";

const MAX_HEIGHT_RATIO_WITH_WINDOW = 0.6;
const TOTAL_PADDING_FROM_SHEET = 48;
const HORIZONTAL_PADDING = 48; // Padding for horizontal images (vertical layout)
const DEFAULT_DIMENSIONS = { width: 800, height: 450 };

interface UseImageDimensionsProps {
  element: TElement & RootImageType;
  slideId?: string;
  layoutType: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
  scale: number;
}

function computeScale(
  dimensions: { width: number; height: number },
  layoutType: string,
) {
  const maxHeight = window.innerHeight * MAX_HEIGHT_RATIO_WITH_WINDOW;
  let availableWidth = window.innerWidth * 0.45 - TOTAL_PADDING_FROM_SHEET;

  if (layoutType === "vertical") {
    availableWidth *= 0.85;
  }

  const heightFits = dimensions.height <= maxHeight;
  const widthFits = dimensions.width <= availableWidth;

  if (heightFits && widthFits) {
    return 1;
  }

  const heightScale = maxHeight / dimensions.height;
  const widthScale = availableWidth / dimensions.width;
  return Math.min(heightScale, widthScale, 1);
}

/**
 * Custom hook to calculate image dimensions and scale for the presentation image editor.
 * Handles both vertical (horizontal images) and horizontal (vertical images) layouts.
 */
export function useImageDimensions({
  element,
  slideId,
  layoutType,
}: UseImageDimensionsProps): ImageDimensions {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>(DEFAULT_DIMENSIONS);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    let resizeObserver: ResizeObserver | null = null;
    let animationFrameId: number | null = null;
    let retryTimeoutId: number | null = null;
    let observedContainer: Element | null = null;

    const selector = slideId ? `.slide-container-${slideId}` : null;
    const supportsResizeObserver = typeof window.ResizeObserver !== "undefined";

    const getDimensionsFromContainer = (
      container: Element,
    ): { width: number; height: number } => {
      const parentRect = container.getBoundingClientRect();
      const parentWidth = parentRect.width;
      const parentHeight = parentRect.height;

      const BASE_WIDTH_PERCENTAGE_NUMERICAL =
        parseFloat(BASE_WIDTH_PERCENTAGE) / 100;
      let actualWidth: number = parentWidth * BASE_WIDTH_PERCENTAGE_NUMERICAL;
      let actualHeight: number = BASE_HEIGHT;

      if (layoutType === "vertical") {
        actualHeight = element.size?.h ?? BASE_HEIGHT;
        actualWidth = Math.max(parentWidth - HORIZONTAL_PADDING, 0);
      } else {
        actualWidth =
          parentWidth *
          (parseFloat(element.size?.w ?? BASE_WIDTH_PERCENTAGE) / 100);
        actualHeight = parentHeight;
      }

      return { width: actualWidth, height: actualHeight };
    };

    const updateMeasurements = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const slideContainer = selector
          ? document.querySelector(selector)
          : null;

        if (!slideContainer) {
          setDimensions(DEFAULT_DIMENSIONS);
          setScale(computeScale(DEFAULT_DIMENSIONS, layoutType));

          if (retryTimeoutId !== null) {
            clearTimeout(retryTimeoutId);
          }
          retryTimeoutId = window.setTimeout(() => {
            retryTimeoutId = null;
            updateMeasurements();
          }, 200);

          return;
        }

        if (supportsResizeObserver && observedContainer !== slideContainer) {
          resizeObserver?.disconnect();
          resizeObserver = new ResizeObserver(() => updateMeasurements());
          resizeObserver.observe(slideContainer);
          observedContainer = slideContainer;
        }

        const nextDimensions = getDimensionsFromContainer(slideContainer);

        setDimensions((prev) =>
          prev.width === nextDimensions.width &&
          prev.height === nextDimensions.height
            ? prev
            : nextDimensions,
        );
        setScale(computeScale(nextDimensions, layoutType));
      });
    };

    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);

    return () => {
      window.removeEventListener("resize", updateMeasurements);
      resizeObserver?.disconnect();

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      if (retryTimeoutId !== null) {
        clearTimeout(retryTimeoutId);
      }
    };
  }, [slideId, layoutType, element.size?.h, element.size?.w]);

  return {
    width: dimensions.width,
    height: dimensions.height,
    scale,
  };
}
