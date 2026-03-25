"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UsePresentingLoadingGateOptions {
  isPresenting: boolean;
  isPresentingLoading: boolean;
  slideIds: string[];
  presentingScaleLocks: Record<string, boolean>;
  setIsPresentingLoading: (isLoading: boolean) => void;
  clearDelayMs?: number;
}

export function usePresentingLoadingGate({
  isPresenting,
  isPresentingLoading,
  slideIds,
  presentingScaleLocks,
  setIsPresentingLoading,
  clearDelayMs = 150,
}: UsePresentingLoadingGateOptions) {
  const [isLayoutStable, setIsLayoutStable] = useState(false);
  const clearLoadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const cancelClearLoading = useCallback(() => {
    if (clearLoadingTimeoutRef.current) {
      clearTimeout(clearLoadingTimeoutRef.current);
      clearLoadingTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPresenting || !isPresentingLoading) {
      setIsLayoutStable(false);
      cancelClearLoading();
      return;
    }

    let rafId = 0;
    let stableFrames = 0;
    let lastWidth = 0;
    let lastHeight = 0;

    const measure = () => {
      const container = document.querySelector<HTMLElement>(
        ".presentation-slides",
      );

      if (container) {
        const width = Math.max(container.scrollWidth, container.clientWidth);
        const height = Math.max(container.scrollHeight, container.clientHeight);

        if (width === lastWidth && height === lastHeight) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
          lastWidth = width;
          lastHeight = height;
        }

        if (stableFrames >= 2) {
          setIsLayoutStable(true);
          return;
        }
      }

      rafId = window.requestAnimationFrame(measure);
    };

    rafId = window.requestAnimationFrame(measure);
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [cancelClearLoading, isPresenting, isPresentingLoading, slideIds.length]);

  useEffect(() => {
    if (!isPresenting || !isPresentingLoading) return;

    const allLocked = slideIds.length
      ? slideIds.every((slideId) => presentingScaleLocks[slideId])
      : true;
    const shouldClearLoading = allLocked && isLayoutStable;

    if (!shouldClearLoading) {
      cancelClearLoading();
      return;
    }

    cancelClearLoading();
    clearLoadingTimeoutRef.current = setTimeout(() => {
      setIsPresentingLoading(false);
    }, clearDelayMs);
  }, [
    cancelClearLoading,
    clearDelayMs,
    isLayoutStable,
    isPresenting,
    isPresentingLoading,
    presentingScaleLocks,
    setIsPresentingLoading,
    slideIds,
  ]);
}
