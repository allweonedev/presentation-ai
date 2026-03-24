"use client";

import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { type PointerEvent as ReactPointerEvent, useRef } from "react";
import { createPortal } from "react-dom";

interface PresentModePhoneOverlayProps {
  isPhoneViewport: boolean;
  slideIds: string[];
}

interface PointerGesture {
  pointerId: number;
  startX: number;
  startY: number;
}

const TAP_DISTANCE_THRESHOLD = 12;
const SWIPE_DISTANCE_THRESHOLD = 56;

function isPortraitRatio(value?: string): boolean {
  if (!value) return false;

  const parts = value.split(":").map(Number);
  if (parts.length !== 2) {
    return false;
  }

  const width = parts[0] ?? Number.NaN;
  const height = parts[1] ?? Number.NaN;
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0) {
    return false;
  }

  return height > width;
}

function isPhoneFormattedSlide(slide?: PlateSlide): boolean {
  if (!slide) return false;

  if (slide.aspectRatio?.type === "tall") {
    return true;
  }

  if (slide.aspectRatio?.type === "ratio") {
    return isPortraitRatio(slide.aspectRatio.value);
  }

  return false;
}

export function PresentModePhoneOverlay({
  isPhoneViewport,
  slideIds,
}: PresentModePhoneOverlayProps) {
  const isPresenting = usePresentationState((s) => s.isPresenting);
  const currentSlide = usePresentationState((s) =>
    s.slides.find((slide) => slide.id === s.currentSlideId),
  );
  const nextSlide = usePresentationState((s) => s.nextSlide);
  const previousSlide = usePresentationState((s) => s.previousSlide);
  const gestureRef = useRef<PointerGesture | null>(null);
  const shouldShowForViewport =
    isPhoneViewport || isPhoneFormattedSlide(currentSlide);
  const useRotatedControls = isPhoneViewport;

  if (!isPresenting || !shouldShowForViewport || slideIds.length <= 1) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const navigateFromTap = (
    event: ReactPointerEvent<HTMLDivElement>,
    deltaX: number,
    deltaY: number,
  ) => {
    if (
      Math.abs(deltaX) > TAP_DISTANCE_THRESHOLD ||
      Math.abs(deltaY) > TAP_DISTANCE_THRESHOLD
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    if (useRotatedControls) {
      // With -90deg rotation, phone top -> landscape RIGHT, phone bottom -> landscape LEFT.
      // Tap landscape RIGHT (screen top) -> next, tap landscape LEFT (screen bottom) -> previous.
      const navigationZone = event.currentTarget.dataset.navigationZone;
      if (navigationZone === "bottom") {
        previousSlide();
        return;
      }

      if (navigationZone === "top") {
        nextSlide();
        return;
      }

      const tapY = event.clientY - bounds.top;
      if (tapY >= bounds.height / 2) {
        previousSlide();
        return;
      }

      nextSlide();
      return;
    }

    const tapX = event.clientX - bounds.left;
    if (tapX >= bounds.width / 2) {
      nextSlide();
      return;
    }

    previousSlide();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    gestureRef.current = null;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;

    if (!gesture || gesture.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    gestureRef.current = null;

    if (
      useRotatedControls &&
      Math.abs(deltaY) >= SWIPE_DISTANCE_THRESHOLD &&
      Math.abs(deltaY) > Math.abs(deltaX)
    ) {
      // With -90deg rotation: swipe up (screen) = swipe right (landscape) = next,
      // swipe down (screen) = swipe left (landscape) = previous.
      if (deltaY > 0) {
        previousSlide();
        return;
      }

      nextSlide();
      return;
    }

    if (
      !useRotatedControls &&
      Math.abs(deltaX) >= SWIPE_DISTANCE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX > 0) {
        nextSlide();
        return;
      }

      previousSlide();
      return;
    }

    navigateFromTap(event, deltaX, deltaY);
  };

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-1000">
      {useRotatedControls ? (
        <>
          <div
            className="pointer-events-auto absolute inset-x-0 top-0 z-2147483646 h-[24%] select-none touch-pan-x"
            data-navigation-zone="top"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            aria-label="Phone presentation previous slide zone"
            role="button"
          />
          <div
            className="pointer-events-auto absolute inset-x-0 bottom-0 z-2147483646 h-[24%] select-none touch-pan-x"
            data-navigation-zone="bottom"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            aria-label="Phone presentation next slide zone"
            role="button"
          />
        </>
      ) : (
        <div
          className={cn(
            "pointer-events-auto absolute inset-0 z-2147483646 select-none",
            "touch-pan-y",
          )}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        />
      )}
    </div>,
    document.body,
  );
}
