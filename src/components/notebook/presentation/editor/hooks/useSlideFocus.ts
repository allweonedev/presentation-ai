"use client";

import { type PlateEditor } from "platejs/react";
import { useEffect } from "react";

export function useSlideFocus(
  editor: PlateEditor,
  currentSlideId: string | null,
  slideId: string | undefined,
) {
  useEffect(() => {
    if (currentSlideId === slideId) {
      setTimeout(() => {
        try {
          editor?.tf?.focus({ edge: "endEditor" });
        } catch {}
      }, 100);
    }
  }, [currentSlideId, slideId, editor]);
}
