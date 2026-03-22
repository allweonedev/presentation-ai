"use client";

import { type PreviewTab } from "@/components/notebook/presentation/components/theme/create-theme/create-theme-types";
import { testSlides } from "@/components/notebook/presentation/components/theme/create-theme/test-slide";
import { type ThemeFormValues } from "@/components/notebook/presentation/components/theme/types";
import { usePresentationTheme } from "@/components/presentation/providers/PresentationThemeProvider";
import { type ThemeProperties } from "@/lib/presentation/themes";
import { useMemo } from "react";
import { type Control, useWatch } from "react-hook-form";
import { type PlateSlide } from "../../../utils/parser";

interface UsePreviewDataProps {
  control: Control<ThemeFormValues>;
  previewTab: PreviewTab;
  currentSlides: PlateSlide[];
}

export function usePreviewData({
  control,
  previewTab,
  currentSlides,
}: UsePreviewDataProps) {
  // Use useWatch to properly subscribe to form changes
  const values = useWatch({ control });

  const { resolvedTheme } = usePresentationTheme();
  const previewThemeData: ThemeProperties = useMemo(
    () =>
      ({
        name: values.name || "Preview Theme",
        description: values.description || "",
        colors: values.colors,
        fonts: values.fonts as ThemeProperties["fonts"],
        borderRadius: values.borderRadius,
        transitions: values.transitions,
        shadows: values.shadows,
        background: values.background,
        mode: resolvedTheme as unknown as "light" | "dark",
      }) as ThemeProperties,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(values), resolvedTheme],
  );

  const slidesToDisplay = useMemo(() => {
    if (previewTab === "test") {
      return testSlides;
    }
    return currentSlides.length > 0 ? currentSlides : testSlides;
  }, [previewTab, currentSlides]);

  return {
    previewThemeData,
    slidesToDisplay,
  };
}
