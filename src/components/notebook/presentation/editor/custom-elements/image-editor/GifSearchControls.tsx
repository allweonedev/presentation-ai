"use client";

import { type RootImage as RootImageType } from "@/components/notebook/presentation/utils/parser";
import { SharedGifSearchControls } from "@/components/presentation/shared/SharedGifSearchControls";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { usePresentationState } from "@/states/presentation-state";
import { type TElement } from "platejs";
import { useEditorRef } from "platejs/react";
import React from "react";

interface GifSearchControlsProps {
  element: TElement & RootImageType;
  slideId?: string;
  isRootImage: boolean;
  onPick?: () => void;
}

export function GifSearchControls({
  element,
  slideId,
  isRootImage,
  onPick,
}: GifSearchControlsProps) {
  const editor = useEditorRef(slideId);
  const { saveImmediately } = useDebouncedSave();

  const handleSelect = React.useCallback(
    async (url: string) => {
      // Get the latest state directly from the store to avoid stale closures
      const { setSlides, clearRootImageGeneration } =
        usePresentationState.getState();

      if (isRootImage) {
        if (slideId) clearRootImageGeneration(slideId);
        setSlides((slides) =>
          slides.map((slide) =>
            slide.id === slideId
              ? {
                  ...slide,
                  rootImage: {
                    ...slide.rootImage!,
                    url: url,
                    imageSource: "gif" as const,
                  },
                }
              : slide,
          ),
        );
        await saveImmediately();
      } else {
        editor.tf.setNodes({
          ...element,
          url: url,
          imageSource: "gif",
        });
        await saveImmediately();
      }
      onPick?.();
    },
    [isRootImage, slideId, editor, element, onPick, saveImmediately],
  );

  return (
    <SharedGifSearchControls onGifSelect={handleSelect} className="h-full" />
  );
}
