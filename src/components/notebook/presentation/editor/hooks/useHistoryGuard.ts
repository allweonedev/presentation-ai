"use client";

import { type Value } from "platejs";
import { type PlateEditor } from "platejs/react";
import { useEffect, useRef } from "react";

interface UseHistoryGuardArgs {
  editor: PlateEditor;
  initialContent?: { content?: Value; id?: string } | null;
  isGenerating: boolean;
  readOnly: boolean;
  isPresenting: boolean;
  currentSlideId: string | null;
  lastContentRef: React.MutableRefObject<string>;
}

/**
 * Simplified history guard - syncs editor state when slide content changes externally.
 * No longer needs to track "applying history" since we use type='history' in state.
 */
export function useHistoryGuard({
  editor,
  initialContent,
  isGenerating,
  readOnly,
  isPresenting,
  currentSlideId,
  lastContentRef,
}: UseHistoryGuardArgs) {
  const lastSyncedIdRef = useRef<string | null>(null);

  // Handle content updates during generation
  useEffect(() => {
    if (isGenerating && initialContent?.content) {
      requestAnimationFrame(() => {
        editor.tf.setValue(initialContent.content);
        lastContentRef.current = JSON.stringify(initialContent.content);
      });
    }
  }, [initialContent?.content, isGenerating, editor, lastContentRef]);

  // Handle external updates (from undo/redo or other sources)
  useEffect(() => {
    if (!initialContent?.content || isGenerating || readOnly || isPresenting) {
      return;
    }

    const newContentString = JSON.stringify(initialContent.content);
    const currentContentString = JSON.stringify(editor.children);

    // Skip if content hasn't changed or matches what we last synced
    if (
      newContentString === lastContentRef.current ||
      newContentString === currentContentString
    ) {
      return;
    }

    // Content changed externally - sync editor
    const isCurrentSlide = initialContent?.id === currentSlideId;
    const savedSelection = isCurrentSlide ? editor.selection : null;

    requestAnimationFrame(() => {
      editor.tf.setValue(initialContent.content);
      lastContentRef.current = newContentString;
      lastSyncedIdRef.current = initialContent?.id ?? null;

      // Restore cursor if this is the active slide
      if (savedSelection && isCurrentSlide) {
        requestAnimationFrame(() => {
          try {
            editor.tf.select(savedSelection, { edge: "end" });
            editor.tf.focus();
          } catch {
            editor.tf.focus();
          }
        });
      }
    });
  }, [
    initialContent?.content,
    initialContent?.id,
    editor,
    isGenerating,
    readOnly,
    isPresenting,
    currentSlideId,
    lastContentRef,
  ]);
}
