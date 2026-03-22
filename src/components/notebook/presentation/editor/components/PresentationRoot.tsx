"use client";

import { FontLoader } from "@/components/plate/utils/font-loader";
import { cn } from "@/lib/utils";
import { type ReactNode, useMemo } from "react";
import { type PlateSlide } from "../../utils/parser";
import ImageSlide from "../custom-elements/image-slide/ImageSlide";
import ImageSlideStatic from "../custom-elements/image-slide/ImageSlideStatic";
import {
  getLayoutClasses,
  getPresentingClasses,
  getSlideCustomStyles,
  getSlideFormatStyles,
} from "../utils/slide-format-styles";

interface PresentationRootProps {
  className?: string;
  initialContent?: PlateSlide;
  fontsToLoad: string[];
  isPresenting: boolean;
  readOnly: boolean;
  isStatic?: boolean;
  onActivateSlide?: (slideId: string) => void;
  children: ReactNode;
}

export function PresentationRoot({
  className,
  initialContent,
  fontsToLoad,
  isPresenting,
  readOnly,
  isStatic = false,
  onActivateSlide,
  children,
}: PresentationRootProps) {
  // Calculate format styles using extracted utility
  const styleByFormat = useMemo(
    () =>
      getSlideFormatStyles(
        initialContent?.formatCategory,
        initialContent?.width,
        initialContent?.aspectRatio,
      ),
    [
      initialContent?.formatCategory,
      initialContent?.aspectRatio,
      initialContent?.width,
    ],
  );

  // Calculate custom inline styles
  const customStyles = useMemo(
    () => getSlideCustomStyles(initialContent, isPresenting, styleByFormat),
    [initialContent, isPresenting, styleByFormat],
  );

  return (
    <div
      id={!isStatic ? `presentation-root-${initialContent?.id}` : undefined}
      className={cn(
        "group/overflow-border flex",
        "scrollbar-thin p-0 scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30",
        "relative",
        "bg-(--presentation-background)",
        "text-(--presentation-text)",
        "focus-within:ring-opacity-50 focus-within:ring-2 focus-within:ring-primary",
        getPresentingClasses(isPresenting, initialContent?.formatCategory),
        className,
        getLayoutClasses(initialContent?.layoutType),
      )}
      style={customStyles}
      data-is-presenting={readOnly && isPresenting ? "true" : "false"}
      data-slide-content="true"
      onClickCapture={() => {
        if (readOnly && initialContent?.id)
          onActivateSlide?.(initialContent.id);
      }}
    >
      <FontLoader fontsToLoad={fontsToLoad} />
      {initialContent?.isImageSlide && initialContent.rootImage ? (
        readOnly ? (
          <ImageSlideStatic
            image={initialContent.rootImage}
            slideId={initialContent.id}
          />
        ) : (
          <ImageSlide
            image={initialContent.rootImage}
            slideId={initialContent.id}
          />
        )
      ) : (
        children
      )}
    </div>
  );
}
