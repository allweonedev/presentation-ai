// File: components/notebook/presentation/components/theme/create-theme/PreviewSection.tsx

"use client";

import { type ThemeProperties } from "@/lib/presentation/themes";
import { cn } from "@/lib/utils";
import { type RefObject } from "react";
import { type PlateSlide } from "../../../utils/parser";
import { ThemeBackground } from "../ThemeBackground";
import { type PreviewTab } from "./create-theme-types";
import { SlidePreview } from "./SlidePreview";

interface PreviewSectionProps {
  containerRef: RefObject<HTMLDivElement | null>;
  previewTab: PreviewTab;
  previewThemeData: ThemeProperties;
  slidesToDisplay: PlateSlide[];
  onTabChange: (tab: PreviewTab) => void;
}

export function PreviewSection({
  containerRef,
  previewTab,
  previewThemeData,
  slidesToDisplay,
  onTabChange,
}: PreviewSectionProps) {
  return (
    <div
      ref={containerRef}
      className="grid max-w-[50vw] flex-1 place-items-center overflow-clip bg-muted/30 lg:w-1/2"
    >
      <div className="flex h-full max-w-[50vw] flex-col items-center">
        {/* Preview Header */}
        <div className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex gap-2">
            {(["test", "current"] satisfies PreviewTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab as PreviewTab)}
                className={cn(
                  "rounded-t-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  previewTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
                type="button"
              >
                {tab === "test" ? "Test page" : "Current page"}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Content */}
        <ThemeBackground themeDataOverride={previewThemeData}>
          <div className="mb-20 flex h-[calc(100vh-65px)] justify-center overflow-x-clip overflow-y-auto">
            <div className="max-h-max min-h-full space-y-2">
              {slidesToDisplay.map((slide) => (
                <SlidePreview
                  key={slide.id}
                  slide={slide}
                  containerRef={containerRef}
                />
              ))}
              {slidesToDisplay.length === 0 && (
                <div className="rounded-lg bg-background p-8 text-center shadow-lg">
                  <p className="text-muted-foreground">
                    {previewTab === "current"
                      ? "No slides available. Create some slides first."
                      : "No test slides available."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ThemeBackground>
      </div>
    </div>
  );
}
