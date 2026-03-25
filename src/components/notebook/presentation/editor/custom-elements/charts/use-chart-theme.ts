"use client";

import { usePresentationTheme } from "@/components/presentation/providers/PresentationThemeProvider";
import { useMemo } from "react";

// Default chart colors - vibrant, visible colors
export const CHART_COLORS = [
  "#2563eb", // Blue
  "#16a34a", // Green
  "#ea580c", // Orange
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#84cc16", // Lime
];

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0]!;
}

export interface ChartThemeConfig {
  /** AG Charts base theme name */
  theme: "ag-default" | "ag-default-dark";
}

/**
 * Hook to get theme-aware chart configuration based on presentation theme
 * Returns configuration for light/dark mode that can be applied to AG Charts
 */
export function useChartTheme(): ChartThemeConfig {
  const { resolvedTheme } = usePresentationTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === "dark";

    return {
      theme: isDark ? "ag-default-dark" : "ag-default",
    };
  }, [resolvedTheme]);
}
