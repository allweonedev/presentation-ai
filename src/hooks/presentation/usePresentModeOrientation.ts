"use client";

import { useEffect, useState } from "react";

type PresentModeViewportState = {
  isPhoneViewport: boolean;
  isPortraitViewport: boolean;
  shouldForceLandscape: boolean;
  forcedLandscapeRotationDeg: 90 | -90;
  forcedLandscapeProgressSide: "left" | "right";
};

const FORCED_LANDSCAPE_ROTATION_DEG = -90;
const FORCED_LANDSCAPE_PROGRESS_SIDE = "right" as const;

function getViewportDimensions() {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }

  return {
    width: Math.max(
      window.innerWidth,
      Math.round(window.visualViewport?.width ?? 0),
    ),
    height: Math.max(
      window.innerHeight,
      Math.round(window.visualViewport?.height ?? 0),
    ),
  };
}

function isPhoneLikeViewport(width: number, height: number): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const smallerSide = Math.min(width, height);
  const largerSide = Math.max(width, height);
  const phoneSizedViewport = smallerSide <= 500 && largerSide <= 1000;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  const hasTouchPoints = navigator.maxTouchPoints > 0;

  return phoneSizedViewport || coarsePointer || (noHover && hasTouchPoints);
}

export function getPresentModeViewportState(): PresentModeViewportState {
  const { width, height } = getViewportDimensions();
  const isPortraitViewport = height > width;
  const isPhoneViewport = isPhoneLikeViewport(width, height);

  return {
    isPhoneViewport,
    isPortraitViewport,
    shouldForceLandscape: isPhoneViewport && isPortraitViewport,
    forcedLandscapeRotationDeg: FORCED_LANDSCAPE_ROTATION_DEG,
    forcedLandscapeProgressSide: FORCED_LANDSCAPE_PROGRESS_SIDE,
  };
}

export function getPresentModeViewportDimensions() {
  const { width, height } = getViewportDimensions();
  const state = getPresentModeViewportState();

  if (state.shouldForceLandscape) {
    return {
      width: height,
      height: width,
      ...state,
    };
  }

  return {
    width,
    height,
    ...state,
  };
}

export function usePresentModeOrientation(isPresenting: boolean) {
  const [viewportState, setViewportState] = useState<PresentModeViewportState>(
    () => getPresentModeViewportState(),
  );

  useEffect(() => {
    if (!isPresenting) {
      setViewportState(getPresentModeViewportState());
      return;
    }

    const updateViewportState = () => {
      setViewportState(getPresentModeViewportState());
    };

    updateViewportState();
    window.addEventListener("resize", updateViewportState, { passive: true });
    window.addEventListener("orientationchange", updateViewportState);
    window.visualViewport?.addEventListener("resize", updateViewportState);

    return () => {
      window.removeEventListener("resize", updateViewportState);
      window.removeEventListener("orientationchange", updateViewportState);
      window.visualViewport?.removeEventListener("resize", updateViewportState);
    };
  }, [isPresenting]);

  return {
    ...viewportState,
    shouldShowLandscapePrompt: false,
  };
}
