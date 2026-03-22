"use client";

import { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  TouchBackend,
  type TouchBackendOptions,
} from "react-dnd-touch-backend";

const TOUCH_BACKEND_OPTIONS: Partial<TouchBackendOptions> = {
  enableMouseEvents: true,
};

function supportsTouch() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    "ontouchstart" in window ||
    window.navigator.maxTouchPoints > 0 ||
    window.matchMedia?.("(pointer: coarse)").matches === true
  );
}

export default function TouchAwareDndProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isTouchDevice = useMemo(supportsTouch, []);

  return (
    <DndProvider
      backend={isTouchDevice ? TouchBackend : HTML5Backend}
      options={isTouchDevice ? TOUCH_BACKEND_OPTIONS : undefined}
    >
      {children}
    </DndProvider>
  );
}
