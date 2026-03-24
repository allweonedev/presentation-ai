"use client";

import StaticPresentationEditor from "@/components/notebook/presentation/editor/presentation-editor-static";
import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { usePresentationState } from "@/states/presentation-state";
import { useEffect, useRef, useState } from "react";
import { SlideThumbnail } from "../sidebar/SlideThumbnail";

export default function Compare({
  left,
  right,
  shouldReplaceTheSlides = false,
}: {
  left: PlateSlide[];
  right: PlateSlide[];
  shouldReplaceTheSlides?: boolean;
}) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (scrollStopTimerRef.current) {
        clearTimeout(scrollStopTimerRef.current);
      }
    };
  }, []);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = () => {
    if (!isScrolling) {
      setIsScrolling(true);
    }

    if (scrollStopTimerRef.current) {
      clearTimeout(scrollStopTimerRef.current);
    }

    scrollStopTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  return (
    <div
      className="scrollbar-thumb-rounded-full relative h-full max-h-55 w-full max-w-104 overflow-x-clip overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent"
      onScroll={handleScroll}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-transparent to-background transition-opacity duration-150 ${isScrolling ? "opacity-0" : "opacity-100"}`}
      />

      <div className="flex h-max gap-2">
        <div
          className="group w-1/2 cursor-pointer"
          onClick={() => {
            const { slides, setSlides } = usePresentationState.getState();

            if (shouldReplaceTheSlides) {
              setSlides(left);
              return;
            }

            setSlides(
              slides.map((slide) => {
                const replacement = left.find((candidate) => candidate.id === slide.id);
                return replacement ?? slide;
              }),
            );
          }}
        >
          <h3 className="text-lg font-bold">Original</h3>
          <div className="pointer-events-none space-y-2 rounded-md group-hover:outline-solid group-hover:outline-primary">
            {left.map((slide, index) => (
              <SlideThumbnail
                key={slide.id}
                index={index}
                isActive={false}
                onClick={() => {}}
              >
                <StaticPresentationEditor
                  initialContent={slide}
                  className="min-h-[300px] border"
                  id={`preview-original-${slide.id}`}
                />
              </SlideThumbnail>
            ))}
          </div>
        </div>

        <div
          className="group w-1/2 cursor-pointer"
          onClick={() => {
            const { slides, setSlides } = usePresentationState.getState();

            if (shouldReplaceTheSlides) {
              setSlides(right);
              return;
            }

            setSlides(
              slides.map((slide) => {
                const replacement = right.find(
                  (candidate) => candidate.id === slide.id,
                );
                return replacement ?? slide;
              }),
            );
          }}
        >
          <h3 className="text-lg font-bold">Modified</h3>
          <div className="space-y-2 rounded-md group-hover:outline-solid group-hover:outline-primary">
            {right.map((slide, index) => (
              <SlideThumbnail
                key={slide.id}
                index={index}
                isActive={false}
                onClick={() => {}}
              >
                <StaticPresentationEditor
                  initialContent={slide}
                  className="min-h-[300px] border"
                  id={`preview-modified-${slide.id}`}
                />
              </SlideThumbnail>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
