"use client";

import { type LayoutType } from "@/components/notebook/presentation/utils/parser";
import { themes } from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { useCallback, useMemo } from "react";
import { type ContentAlignment } from "../types";

export function useCommonValues() {
  const { slides, theme, customThemeData } = usePresentationState();

  // Get the current theme's font family as default
  const getThemeFontFamily = useCallback(() => {
    // If custom theme data exists, use its fonts
    if (customThemeData?.fonts) {
      return {
        heading: customThemeData.fonts.heading,
        body: customThemeData.fonts.body,
      };
    }
    // Otherwise, use the theme from themes object
    if (typeof theme === "string" && theme in themes) {
      const themeData = themes[theme as keyof typeof themes];
      return {
        heading: themeData.fonts.heading,
        body: themeData.fonts.body,
      };
    }
    // Fallback
    return { heading: "Inter", body: "Inter" };
  }, [theme, customThemeData]);

  const getMostCommonValue = useCallback(
    <T>(key: keyof (typeof slides)[0], defaultValue: T): T => {
      if (slides.length === 0) {
        // Special handling for fontFamily: use theme fonts as default
        if (key === "fontFamily") {
          return getThemeFontFamily() as T;
        }
        return defaultValue;
      }

      const map = new Map<string, { count: number; sample: unknown }>();

      for (const slide of slides) {
        const raw = slide[key] as unknown;
        if (raw === undefined || raw === null || (raw as unknown) === "")
          continue;
        const label =
          typeof raw === "object" ? JSON.stringify(raw) : String(raw as string);
        const entry = map.get(label);
        if (entry) {
          entry.count += 1;
        } else {
          map.set(label, { count: 1, sample: raw });
        }
      }

      if (map.size === 0) {
        // Special handling for fontFamily: use theme fonts as default
        if (key === "fontFamily") {
          return getThemeFontFamily() as T;
        }
        return defaultValue;
      }
      let best: { count: number; sample: unknown } | null = null;
      for (const entry of map.values()) {
        if (!best || entry.count > best.count) best = entry;
      }
      return (best?.sample as T) ?? defaultValue;
    },
    [slides, getThemeFontFamily],
  );

  const derived = useMemo(() => {
    const currentLayout = getMostCommonValue(
      "layoutType",
      "left" as LayoutType,
    );

    // Get the theme background color as a default
    let defaultBgColor = "#ffffff";
    if (typeof window !== "undefined") {
      const root = window.getComputedStyle(document.documentElement);
      const themeBg = root.getPropertyValue("--presentation-background").trim();
      if (themeBg) defaultBgColor = themeBg;
    }

    const currentBgColor = getMostCommonValue("bgColor", defaultBgColor);

    const currentWidth = getMostCommonValue("width", "M" as "S" | "M" | "L");
    const currentAlignment = getMostCommonValue(
      "alignment",
      "start" as ContentAlignment,
    );
    const currentFontSize = getMostCommonValue(
      "fontSize",
      "M" as "S" | "M" | "L",
    );

    const currentFormatCategory = getMostCommonValue(
      "formatCategory",
      "presentation" as "presentation" | "social" | "document" | "webpage",
    );
    const currentAspectRatio = getMostCommonValue("aspectRatio", {
      type: "fluid",
      value: "",
    } as unknown) as unknown as {
      type: string;
      value?: string;
      width?: number;
      height?: number;
    };

    return {
      currentLayout,
      currentBgColor,
      currentWidth,
      currentAlignment,
      currentFontSize,
      currentFormatCategory,
      currentAspectRatio,
    };
  }, [getMostCommonValue]);

  return { slides, getMostCommonValue, ...derived };
}
