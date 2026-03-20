"use client";

import { TooltipProvider } from "@/components/plate/ui/tooltip";
import { loadCustomFonts } from "@/lib/presentation/loadCustomFont";
import { usePresentationState } from "@/states/presentation-state";
import "@/styles/presentation.css";
import { type Value } from "platejs";
import React, { useEffect, useRef } from "react";
import {
  EditablePlate,
  PresentationRoot,
  slideSignature,
  useDebouncedOnChange,
  useEditorFonts,
  useHistoryGuard,
  usePresentationEditorInstance,
  useSlideFocus,
} from ".";
import { type PlateNode, type PlateSlide } from "../utils/parser";

interface PresentationEditorProps {
  initialContent?: PlateSlide;
  className?: string;
  id?: string;
  isGenerating: boolean;
  readOnly?: boolean;
  isPreview?: boolean;
}

// Use React.memo with a custom comparison function to prevent unnecessary re-renders
const PresentationEditor = React.memo(
  ({
    initialContent,
    className,
    id,
    isGenerating = false,
    readOnly = false,
    isPreview = false,
  }: PresentationEditorProps) => {
    const isPresenting = usePresentationState((s) => s.isPresenting);
    const currentSlideId = usePresentationState((s) => s.currentSlideId);
    const setCurrentSlideId = usePresentationState((s) => s.setCurrentSlideId);

    const { fontsToLoad, onEditorReady, updateFontsFromEditor } =
      useEditorFonts();
    const lastContentRef = useRef<string>("");

    const editor = usePresentationEditorInstance({
      initialValue: initialContent?.content as Value | undefined,
      id: id,
      onReady: ({ editor }) => {
        lastContentRef.current = JSON.stringify(initialContent?.content);
        onEditorReady(editor, [
          initialContent?.fontFamily?.heading,
          initialContent?.fontFamily?.body,
        ]);
      },
    });

    // Load custom fonts if defined in initialContent
    useEffect(() => {
      if (initialContent?.fontFamily) {
        const {
          heading,
          body,
          headingUrl,
          bodyUrl,
          headingWeight,
          bodyWeight,
        } = initialContent.fontFamily;

        if (headingUrl || bodyUrl) {
          loadCustomFonts({
            headingFont: heading,
            headingUrl,
            headingWeight,
            bodyFont: body,
            bodyUrl,
            bodyWeight,
          }).catch((error) => {
            console.error("Failed to load custom fonts in editor:", error);
          });
        }
      }
    }, [initialContent?.fontFamily]);

    useSlideFocus(editor, currentSlideId, initialContent?.id);

    useHistoryGuard({
      editor,
      initialContent,
      isGenerating,
      readOnly: Boolean(readOnly),
      isPresenting,
      currentSlideId,
      lastContentRef,
    });

    const handleDebouncedApply = React.useCallback(
      (value: Value) => {
        updateFontsFromEditor(editor);
        const slideId = initialContent?.id ?? id;
        if (slideId) {
          lastContentRef.current = JSON.stringify(value);
          usePresentationState.getState().updateSlide(slideId, {
            content: value as PlateNode[],
          });
        }
      },
      [editor, id, initialContent?.id, updateFontsFromEditor],
    );

    const debouncedOnChange = useDebouncedOnChange<Value>({
      isGenerating,
      onApply: handleDebouncedApply,
    });

    return (
      <TooltipProvider>
        <PresentationRoot
          className={className}
          initialContent={initialContent}
          fontsToLoad={fontsToLoad}
          isPresenting={isPresenting}
          readOnly={Boolean(readOnly)}
          isStatic={false}
          onActivateSlide={(slideId) => setCurrentSlideId(slideId)}
        >
          <EditablePlate
            editor={editor}
            className={className}
            id={id}
            readOnly={Boolean(readOnly)}
            isPreview={Boolean(isPreview)}
            isGenerating={Boolean(isGenerating)}
            isPresenting={Boolean(isPresenting)}
            initialContent={initialContent}
            onFocusSlide={(slideId) => setCurrentSlideId(slideId)}
            onDebouncedChange={(value) => debouncedOnChange(value)}
          />
        </PresentationRoot>
      </TooltipProvider>
    );
  },
  (prev, next) => {
    if (prev.id !== next.id) return false;
    // Deep-compare important slide fields using a stable JSON signature
    if (
      slideSignature(prev.initialContent) !==
      slideSignature(next.initialContent)
    ) {
      return false;
    }
    if (prev.readOnly !== next.readOnly) return false;
    if (prev.isPreview !== next.isPreview) return false;
    if (prev.className !== next.className) return false;
    if (prev.isGenerating !== next.isGenerating) return false;
    // Intentionally ignore function prop identity (onChange) differences
    return true;
  },
);

PresentationEditor.displayName = "PresentationEditor";

export default PresentationEditor;
