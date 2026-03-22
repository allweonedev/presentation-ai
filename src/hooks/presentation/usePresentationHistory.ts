"use client";

import { usePresentationHistoryState } from "@/states/presentation-history-state";
import { usePresentationState } from "@/states/presentation-state";
import { useEffect, useRef } from "react";

/**
 * Simplified history hook - only handles keyboard shortcuts and initialization.
 * History pushing is now done directly in setSlides/updateSlide.
 */
export function usePresentationHistory() {
  const slides = usePresentationState((s) => s.slides);
  const theme = usePresentationState((s) => s.theme);
  const customThemeData = usePresentationState((s) => s.customThemeData);
  const isGeneratingPresentation = usePresentationState(
    (s) => s.isGeneratingPresentation,
  );

  const undo = usePresentationHistoryState((s) => s.undo);
  const redo = usePresentationHistoryState((s) => s.redo);
  const canUndo = usePresentationHistoryState((s) => s.canUndo);
  const canRedo = usePresentationHistoryState((s) => s.canRedo);
  const initializeHistory = usePresentationHistoryState(
    (s) => s.initializeHistory,
  );
  const clearHistory = usePresentationHistoryState((s) => s.clearHistory);
  const history = usePresentationHistoryState((s) => s.history);

  useEffect(() => {
    console.log("history", history);
  }, [history]);

  const hasInitializedRef = useRef(false);

  // Initialize history when slides are first loaded (after generation completes)
  useEffect(() => {
    // Don't initialize during generation
    if (isGeneratingPresentation) {
      hasInitializedRef.current = false;
      return;
    }

    // Initialize once when we have slides and haven't initialized yet
    if (
      slides.length > 0 &&
      !hasInitializedRef.current &&
      history.present === null
    ) {
      initializeHistory(slides, theme, customThemeData);
      hasInitializedRef.current = true;
    }
  }, [
    slides,
    theme,
    customThemeData,
    isGeneratingPresentation,
    initializeHistory,
    history.present,
  ]);

  // Clear history when navigating away
  useEffect(() => {
    return () => {
      clearHistory();
      hasInitializedRef.current = false;
    };
  }, [clearHistory]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModKey = event.ctrlKey || event.metaKey;

      if (!isModKey) return;

      const key = event.key.toLowerCase();

      // Undo: Ctrl+Z or Cmd+Z (but not Shift+Z)
      if (key === "z" && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (canUndo) {
          undo();
        }
        return;
      }

      // Redo: Ctrl+Shift+Z or Cmd+Shift+Z
      if (key === "z" && event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (canRedo) {
          redo();
        }
        return;
      }

      // Redo: Ctrl+Y or Cmd+Y (alternative)
      if (key === "y") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (canRedo) {
          redo();
        }
        return;
      }
    };

    // Use capture phase to intercept before Plate.js
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [undo, redo, canUndo, canRedo]);
}
