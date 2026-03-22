import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { usePresentationState } from "@/states/presentation-state";
import { useEffect, useRef } from "react";
import { useDebouncedSave } from "./useDebouncedSave";

interface UseSlideChangeWatcherOptions {
  /**
   * The delay in milliseconds before triggering a save.
   * @default 1000
   */
  debounceDelay?: number;
  /**
   * Whether the watcher should be active
   * @default true
   */
  enabled?: boolean;
}

/**
 * A hook that watches for changes to the slides and triggers
 * a debounced save function whenever changes are detected.
 */
export const useSlideChangeWatcher = (
  options: UseSlideChangeWatcherOptions = {},
) => {
  const { debounceDelay = 1000, enabled = true } = options;
  const slides = usePresentationState((s) => s.slides);
  const { save, saveImmediately } = useDebouncedSave({ delay: debounceDelay });

  const didInitRef = useRef(false);
  const hasSavedOnceRef = useRef(false);
  const prevSlidesRef = useRef<PlateSlide[]>([]);

  // Watch for changes to the slides array and trigger save
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const { isGeneratingPresentation } = usePresentationState.getState();
    if (isGeneratingPresentation) {
      return;
    }

    if (!didInitRef.current && slides.length > 0) {
      didInitRef.current = true;
      prevSlidesRef.current = slides;
      return;
    }

    if (hasSavedOnceRef.current) {
      save();
    }

    if (
      !hasSavedOnceRef.current &&
      JSON.stringify(slides) !== JSON.stringify(prevSlidesRef.current)
    ) {
      hasSavedOnceRef.current = true;
      prevSlidesRef.current = slides;
      save();
    }
  }, [slides, enabled]);

  return {
    saveImmediately,
  };
};
