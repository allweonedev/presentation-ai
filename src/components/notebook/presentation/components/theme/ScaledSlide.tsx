"use client";

import { type testSlides } from "@/components/notebook/presentation/components/theme/create-theme/test-slide";
import StaticPresentationEditor from "@/components/notebook/presentation/editor/presentation-editor-static";
import { useLayoutEffect, useRef, useState } from "react";

interface ScaledSlideProps {
  slide: (typeof testSlides)[number];
  slideWidth: number;
  scale: number;
}

/**
 * Component that scales content and adjusts container height using ResizeObserver.
 * This ensures the outer container height matches the scaled content height.
 */
export function ScaledSlide({ slide, slideWidth, scale }: ScaledSlideProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(
    undefined,
  );

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const updateHeight = () => {
      // Use scrollHeight to get the unscaled height, then multiply by scale
      const height = el.scrollHeight;
      setScaledHeight(height * scale);
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    updateHeight();

    return () => observer.disconnect();
  }, [scale]);

  return (
    <div
      style={{
        width: `${slideWidth * scale}px`,
        height: scaledHeight ? `${scaledHeight}px` : "auto",
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: `${slideWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <StaticPresentationEditor
          initialContent={slide}
          className="rounded-md"
          id={slide.id}
        />
      </div>
    </div>
  );
}
