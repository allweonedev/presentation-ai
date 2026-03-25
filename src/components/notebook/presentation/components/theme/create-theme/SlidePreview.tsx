"use client";

import StaticPresentationEditor from "@/components/notebook/presentation/editor/presentation-editor-static";
import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { useSlideContentScaling } from "@/hooks/presentation/useSlideContentScaling";

interface SlidePreviewProps {
  slide: PlateSlide;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function SlidePreview({ slide, containerRef }: SlidePreviewProps) {
  const formatCategory = slide.formatCategory ?? "presentation";
  const aspectRatio = slide.aspectRatio ?? { type: "fluid" };
  const slideWidth = slide.width ?? "M";

  const scalingConfig = useSlideContentScaling(
    slideWidth as "S" | "M" | "L",
    false, // not presenting
    formatCategory,
    aspectRatio,
    containerRef,
  );

  const { contentRef, scaledHeight } = scalingConfig;

  return (
    <div className="flex w-full justify-center pb-6">
      <div
        style={{
          height: scaledHeight ? `${scaledHeight}px` : undefined,
          width: `${scalingConfig.slideWidth}px`,
        }}
        className="relative"
      >
        <div
          ref={contentRef}
          className="absolute top-0 left-0"
          style={{
            width: `${scalingConfig.slideWidth}px`,
            transform: `scale(${scalingConfig.scale})`,
            transformOrigin: "top center",
            fontSize: "16px",
          }}
        >
          <div className="relative">
            <StaticPresentationEditor
              initialContent={slide}
              className="rounded-md"
              id={slide.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
