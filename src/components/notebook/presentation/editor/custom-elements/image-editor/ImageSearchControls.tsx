"use client";

import { type RootImage as RootImageType } from "@/components/notebook/presentation/utils/parser";
import { SharedImageSearchControls } from "@/components/presentation/shared/SharedImageSearchControls";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { usePresentationState } from "@/states/presentation-state";
import { type TElement } from "platejs";
import { useEditorRef } from "platejs/react";
import React from "react";

interface ImageSearchControlsProps {
  element: TElement & RootImageType;
  slideId?: string;
  isRootImage: boolean;
  onPick?: () => void;
}

export function ImageSearchControls({
  element,
  slideId,
  isRootImage,
  onPick,
}: ImageSearchControlsProps) {
  const editor = useEditorRef(slideId);
  const setSlides = usePresentationState((s) => s.setSlides);
  const { saveImmediately } = useDebouncedSave();

  const handleSelect = React.useCallback(
    (url: string) => {
      const { clearRootImageGeneration } = usePresentationState.getState();
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
                    imageSource: "search",
                  },
                }
              : slide,
          ),
        );
        void saveImmediately();
      } else {
        editor.tf.setNodes({
          ...element,
          url: url,
          imageSource: "search",
        });
        void saveImmediately();
      }
      onPick?.();
    },
    [
      isRootImage,
      setSlides,
      slideId,
      editor,
      element,
      onPick,
      saveImmediately,
    ],
  );

  return (
    <SharedImageSearchControls
      onImageSelect={handleSelect}
      className="h-full"
    />
  );
}
