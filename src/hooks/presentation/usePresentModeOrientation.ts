"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

type ScreenOrientationLock =
  | "any"
  | "natural"
  | "landscape"
  | "portrait"
  | "portrait-primary"
  | "portrait-secondary"
  | "landscape-primary"
  | "landscape-secondary";

type LockableScreenOrientation = ScreenOrientation & {
  lock?: (orientation: ScreenOrientationLock) => Promise<void>;
  unlock?: () => void;
};

export function usePresentModeOrientation(isPresenting: boolean) {
  const isMobile = useIsMobile();
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setIsPortraitMobile(false);
      return;
    }

    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const updateOrientation = () => setIsPortraitMobile(mediaQuery.matches);

    updateOrientation();
    mediaQuery.addEventListener("change", updateOrientation);

    return () => mediaQuery.removeEventListener("change", updateOrientation);
  }, [isMobile]);

  useEffect(() => {
    if (!isPresenting || !isMobile) {
      return;
    }

    const screenOrientation = screen.orientation as LockableScreenOrientation;
    void screenOrientation.lock?.("landscape").catch(() => {
      // Some mobile browsers ignore or reject orientation locks outside fullscreen/PWA mode.
    });

    return () => {
      screenOrientation.unlock?.();
    };
  }, [isMobile, isPresenting]);

  return {
    isMobile,
    shouldShowLandscapePrompt: isPresenting && isMobile && isPortraitMobile,
  };
}
