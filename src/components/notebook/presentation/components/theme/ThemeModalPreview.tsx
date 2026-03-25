"use client";

import { testSlides } from "@/components/notebook/presentation/components/theme/create-theme/test-slide";
import { ScaledSlide } from "@/components/notebook/presentation/components/theme/ScaledSlide";
import { ThemeBackground } from "@/components/notebook/presentation/components/theme/ThemeBackground";
import { type ThemeProperties } from "@/lib/presentation/themes";

interface ThemeModalPreviewProps {
  selectedThemeData: ThemeProperties | null;
}

const SLIDE_WIDTH = 1000;
const SCALE = 0.53;

/**
 * Right panel preview section showing scaled slides with the selected theme
 */
export function ThemeModalPreview({
  selectedThemeData,
}: ThemeModalPreviewProps) {
  return (
    <div className="hidden h-[calc(85vh)] w-[60%] flex-col overflow-y-auto bg-muted/30 lg:flex">
      {/* Preview Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="text-lg font-semibold">Preview</h2>
      </div>

      {/* Preview Content */}
      <div className="scrollbar-thin min-h-0 flex-1 overflow-auto p-4 scrollbar-thumb-accent scrollbar-track-transparent">
        {selectedThemeData && (
          <ThemeBackground
            themeDataOverride={selectedThemeData}
            suppressThemeUpdates={true}
          >
            <div className="flex flex-col items-center gap-4 py-4">
              {testSlides.map((slide) => (
                <ScaledSlide
                  key={slide.id}
                  slide={slide}
                  slideWidth={SLIDE_WIDTH}
                  scale={SCALE}
                />
              ))}
            </div>
          </ThemeBackground>
        )}
      </div>
    </div>
  );
}
